class AdministrationController < ApplicationController
  before_filter :require_login, except: :start
  before_action :authenticate, except: :start

  skip_before_action :verify_authenticity_token, :only => [:csv, :map_upload]

  def index
    @origin = cookies[:origin]
    @departments = Department.all
    @people = Person.all
    @rooms = Room.all
    @rss_feeds = RssFeed.all
    @rss_feed = RssFeed.new # for adding new RSS feeds
    @unmatched_queries = UnmatchedQueryLog.all
    @search_terms = SearchTermLog.all.order(:count).limit(30)
  end

  # POST
  # Modifies the starting location. Useful for kiosks.
  def origin
    unless params[:origin].blank?
      params[:origin].slice!(0) if params[:origin][0].upcase == "R" # Remove proceeding R if present
      origin = params[:origin].to_s.rjust(4, '0').prepend("R") # Add zero padding and Prepend R
      cookies.permanent[:origin] = origin.upcase

      cookies.delete :start_location

      notice = "Origin successfully updated to: #{cookies[:origin]}"
    else
      cookies.delete :origin
      notice = "Origin successfully cleared"
    end

    respond_to do |format|
      format.json {
        render :json => {
          origin: cookies[:origin],
          notice: notice
        }
      }
    end
  end

  # GET
  # Modifies the starting location passed via URL (QR Codes)
  def start
    unless params[:location].blank? or cookies[:origin].present?
      params[:location].slice!(0) if params[:location][0].upcase == "R" # Remove proceeding R if present
      start_location = params[:location].to_s.rjust(4, '0').prepend("R") # Add zero padding and Prepend R
      cookies.permanent[:start_location] = start_location.upcase
    end

    redirect_to root_path
  end

  def department_location
    room_number = params[:department_room_number]
    id = params[:department_id]

    room = Room.where(room_number: room_number).first_or_create
    department = Department.find(id)
    department.room = room
    respond_to do |format|
      if department.save && room_number.present?
        format.json {render json: { notice: "Department location saved successfully" } }
      else
        format.json {render json: { error: "Error saving department location" } }
      end
    end
  end

  # POST
  # Import a CSV file
  def csv
    require 'csv'

    unless params[:uploaded_csv].blank?
      csv_path = params[:uploaded_csv].path

      # Wipe database on csv load, will need to be modified when event RSS feeds are fixed
      data_validated = false
      begin
        CSV.foreach(csv_path, :headers => true) do |row|
          csv_building = row[1]
          csv_room_number = row[3]
          csv_room_name = row[4]
          csv_department = row[7]
          csv_person_name = row[9] #can be general purpose name like 'general graduate student'
          csv_last_name, csv_first_name = csv_person_name.split(',').map(&:strip)

          csv_person_department = row[11] # appears to be less relevant to our needs
          csv_organization = row[12]
          csv_org_code, csv_person_organization = csv_organization.split(' ', 2) # Use this for department
          csv_phone = row[13]
          csv_email = row[14]

          # Destroy data only if the first row was parsed successfully
          unless data_validated
            Rails.logger.debug "[[[[[[ Data validated, wiping db!!! ]]]]]]"
            Person.destroy_all
            Department.destroy_all
            DirectoryObject.where(type: "Room").delete_all
            data_validated = true
          end

          # Don't bother with this row if a room number doesn't exist
          if csv_room_number != ""
            # Parse Rooms
            results = Room.where(room_number: csv_room_number)
            # Found new room?
            if results.empty?
              room = Room.new
              room.room_number = csv_room_number
              room.save
            else
              room = results.first
            end

            # Ensure custom data has not already been set
    #        if room.name.blank?
    #          room.name = csv_room_name
    #          room.save
    #        end
            # Parse Department
            # Don't bother with department/person parsing, something is wrong with this row
            unless csv_organization.include?("Identity Purged")
              department = nil
              results = Department.where(title: csv_person_organization.downcase).first
              if results.blank?
                department = Department.new
                if csv_person_organization.present?
                  department.title = (csv_person_organization).downcase
                  department.save
                else
                  logger.info "entry was missing an organization"
                end
              else
                department = results
              end

              # Parsing Person
              results = Person.where(email: csv_email)

              # Found new person?
              if results.empty?
                person = Person.new

              # Found existing person?
              else
                person = results.first
              end
              # Ensure room is associated
              if room.present?
                if not person.rooms.include?(room)
                  person.rooms << room
                end
              end
              # Ensure department is associated
              # Currently assumes each person has one department, seems to be the case from the data
              if person.department.blank?
                if department.present?
                  person.department = department
                end
              end
              person.email = csv_email
              person.phone = csv_phone
              person.first = csv_first_name
              person.last = csv_last_name
              person.save
            end
          end
        end

        notice = "CSV was successfully parsed"
      rescue
        error = "CSV file contains invalid data"
      end
    else
      error = "Error uploading file"
    end # unless csv_path.blank?

    respond_to do |format|
      format.html {
        redirect_to action: "index",
        error: error,
        notice: notice
      }
    end
  end

  # POST
  # Upload an SVG map
  def map_upload

    unless params[:uploaded_map].blank?
      require 'fileutils'

      directory = "public/maps.tmp"
      # Create directory if does not exist
      FileUtils::mkdir_p directory

      params[:uploaded_map].each do |map|
        path = File.join(directory, "floor" + map[0].to_s + ".svg")
        File.open(path, "wb") { |f| f.write(map[1].read) }
      end

      # Modify the stats file to initialize the progress bar
      FileUtils::mkdir_p "public/dataStore"
      File.open("public/map_stats.json", "w+") do |f|
        f.write('{"progress": "0%"}')
      end

      # Run the buildCaches script
      load File.join(Rails.root, 'lib', 'tasks', 'build_caches.rake')
      Delayed::Job.enqueue(DelayedRake.new("caches:build"))

      notice = "Maps were successfully uploaded. Re-building caches ..."
    else
      error = "Error uploading SVG map"
    end # unless uploaded_map.blank?

    respond_to do |format|
      format.html {
        redirect_to action: "index",
        error: error,
        notice: notice
      }
    end
  end

  # POST/PUT
  # Create Directory Object
  def directory_object
    if params[:id].present?
      # Find existing object
      @object = DirectoryObject.find_or_create_by(id: params[:id])
    else
      case params[:type]
      when 'people'
        @object = Person.new
      when 'departments'
        @object = Department.new
      end
    end

    if @object.present?
      @object.first = params[:first] unless params[:first].blank?
      @object.last = params[:last] unless params[:last].blank?
      @object.email = params[:email] unless params[:email].blank?
      @object.phone = params[:phone] unless params[:phone].blank?
      @object.room_number = params[:room_number] unless params[:room_number].blank?
      @object.name = params[:name] unless params[:name].blank?
      @object.title = params[:title] unless params[:title].blank?
      @object.department = Department.find(params[:department]) unless params[:department].blank?
      if params[:type] == 'Person'
        @object.rooms = []
        params[:rooms].each do |room|
          @object.rooms << Room.find(room)
        end unless params[:rooms].blank?
      end
      if params[:type] == 'Department'
        @object.room = Room.find_by(room_number: params[:room].rjust(4,'0')) unless params[:room].blank?
      end

      @object.save
      respond_to do |format|
        format.json {
          render :json => @object
        }
      end

    else

      respond_to do |format|
        format.json {render json: { error: "Error finding directory object" }, status: 405 }
      end

    end
  end

  # DEL
  # Delete Directory Object
  def del_directory_object
    if params[:id].present?
      # Find existing object
      @object = DirectoryObject.find(params[:id])
    end
    if @object.present? and @object.type != 'Room'
      @object.destroy
      respond_to do |format|
        format.json {render json: { notice: "Object deleted successfully", id: @object.id }, status: 302 }
      end
    else
      respond_to do |format|
        format.json {render json: { error: "Error deleting directory object" }, status: 405 }
      end
    end
    
  end

end
