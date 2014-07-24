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
      building = row[1]
      room = row[3]
      room_name = row[4]
      department = row[7]
      person_name = row[9] #can be general purpose name like 'general graduate student'
      person_department = row[11]
      person_organization = row [12]
      phone = row[13]
      email = row[14]

      # Found new room?

      # Found existing room? update entry

      # Found new department

      # Found new person?

      # Found existing person? update entry
    end

    render :nothing => true
  end
end
