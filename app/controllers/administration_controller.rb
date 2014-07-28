class AdministrationController < ApplicationController
  http_basic_authenticate_with name: $AUTH_CONFIG_SETTINGS["USER"], password: $AUTH_CONFIG_SETTINGS["PASSWORD"]

  def index
    @origin = cookies[:origin]
    @departments = Department.all
  end

  # POST
  # Modifies the starting location. Useful for kiosks.
  def origin
    cookies.permanent[:origin] = params[:origin] unless params[:origin].blank?

    render :nothing => true
  end
  
  def department_location
    room_number = params[:department_room_number]
    id = params[:department_id]

    room = Room.where(room_number: room_number).first_or_create
    department = Department.find(id)
    department.room = room
    department.save
    render :nothing => true
  end

  # POST
  # Import a CSV file
  def csv
    require 'csv'

    csv_path = params[:uploaded_csv]
    csv_path = csv_path.path
    # Wipe database on csv load, will need to be modified when event RSS feeds are fixed
    Person.destroy_all
    Department.destroy_all
    DirectoryObject.where(type: "Room").delete_all
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
          results = Department.where(title: csv_person_organization)
          department = nil
          if results.empty?
            logger.info "creating new department"
            department = Department.new
            if csv_person_organization.present?
              department.title = csv_person_organization
              department.save
              logger.info "saving new department"
            else
              logger.info "entry was missing an organization"
            end
          else
            logger.info "department already exists"
            department = results.first
          end

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
              logger.info "associating department"
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
    render :nothing => true
  end
end
