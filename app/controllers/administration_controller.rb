class AdministrationController < ApplicationController
  http_basic_authenticate_with name: $AUTH_CONFIG_SETTINGS["USER"], password: $AUTH_CONFIG_SETTINGS["PASSWORD"]

  def index
    @origin = cookies[:origin]
  end

  # POST
  # Modifies the starting location. Useful for kiosks.
  def origin
    cookies.permanent[:origin] = params[:origin] unless params[:origin].blank?

    render :nothing => true
  end

  # POST
  # Import a CSV file
  def csv
    require 'csv'

    csv_path = params[:uploaded_csv]
    csv_path = csv_path.path

    CSV.foreach(csv_path, :headers => true) do |row|

      csv_building = row[1]
      csv_room_number = row[3]
      csv_room_name = row[4]
      csv_department = row[7]
      csv_person_name = row[9] #can be general purpose name like 'general graduate student'
      csv_last_name, csv_first_name = csv_person_name.split(',').map(&:strip)

      csv_person_department = row[11]
      csv_person_organization = row [12] # Use this for department, remove leading org code
      csv_phone = row[13]
      csv_email = row[14]

      if csv_room_number != ""

        # Found new room?
        results = Room.where(room_number: csv_room_number)
        if results
          room = Room.new
          if not csv_room_number.blank?
            room.room_number = csv_room_number
          else
            logger.error "csv_room is missing a room number"
            # TODO - should the loop for this row be broken out of if room number doesn't exist?, without a room, there is no location
          end
        else
          room = results.first
        end
        
        # Found existing room? update entry
        # Ensure custom data has not already been set
        if room.name.blank?      
          room.name = csv_room_name
        end
        room.save
      end

      # Found new department
      results = Department.where(title: csv_person_organization)
      if results.length == 0
        department = Department.new
        if not csv_person_organization.blank?
          department.title = csv_person_organization
        else
          logger.info "entry was missing an organization"
        end
      else
        department = results.first
        department.save
      end

      # People parsing need to account for multiple rooms associated to an individual, and multiple people with the same first/last name

      # Found new person?
#      results_first = Person.where(first: csv_first_name)
#      results_last = Person.where(last: csv_last_name)
#      results = (results_first + results_last).uniq
      # Found existing person? update entry

    end 
    render :nothing => true
  end
end
