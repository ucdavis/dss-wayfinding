# DirectoryObject is polymorphic and can be a Person, Room, Event, or Department.
require 'rqrcode'
require 'fileutils'

class DirectoryObjectsController < ApplicationController
  before_action :set_origin, except: [:index]
  before_action :set_directory_object, only: [:test, :show, :update, :destroy]
  before_filter :require_login, except: [:index, :test, :show, :search, :unroutable]
  before_filter :authenticate, except: [:index, :test, :show, :search, :unroutable]

  protect_from_forgery :except => :unroutable

  filter_access_to :all

  # Accepts either a single room ID (Assumed to be an origin)
  #   or 2 Room IDs (assumed to be an origin destination pair)
  #   and will generate the view to display the corresponding qr code
  # Target URL is the URL the QR points to
  # qrLink links to the generateQR view which will render the actual QR PNG
  # converts room ID to room Number (This is what start method expects)
  def qr
    @qrLink = nil
    @targetURL = nil

    room = Room.find(params[:originID]).first
    if room == nil
      raise ActionController::RoutingError.new('Origin Room Not Found')
      #render :status => 404, :layout => false
    else
      originRoom = room.room_number

      unless params[:destinationID].blank? # Origin and destination supplied
        destinationRoom = Room.find(params[:destinationID]).room_number

        # Hardcoding this for now because it's weird
        @targetURL = root_url + "start/" + originRoom + "/end/" + destinationRoom

        @qrLink = generateQRLink(@targetURL)
      else
        @targetURL = url_for(action: 'start', controller: 'administration', origin: originRoom)
        @qrLink = generateQRLink(@targetURL)
      end

      render :layout => true
    end
  end

  # Generate a QR for URL passed in as a param and then render it
  # Intended route to be used in an <img> tag
  # Does not do any parsing or forming
  def generateQR
    qrcode = RQRCode::QRCode.new(params[:url])

    svg = qrcode.as_svg(offset: 0, color: '000',
                    shape_rendering: 'crispEdges',
                    module_size: 11
    )

    send_data svg, type: 'image/svg+xml', disposition: 'inline'
  end

  def placard
    @results = []

    obj = DirectoryObject.find(params[:id])

    if obj.type == "Person"
      person      = Person.find(params[:id])

      name       = person.first + ' ' + person.last
      email = person.email
      department = person.department.title
      title      = person.title
      office_hours = person.office_hours
      targetURL   = url_for(action: 'start', controller: 'administration', origin: person.rooms.first.room_number)
      qrLink     = generateQRLink(targetURL)

      hash = { name: name, email:email, department: department, title: title, targetURL: targetURL, qrLink: qrLink, office_hours: office_hours }

      @results.push( hash )
    else
      # Assume it's a department
      Person.where(department: params[:id]).each do |person|
        name       = person.first + ' ' + person.last
        email = person.email
	department = person.department.title
        title      = nil

        begin
          roomNumber = person.rooms.first.room_number
        rescue
          roomNumber = 0
          title = "please define a room number for this person"
        end

        targetURL   = url_for(action: 'start', controller: 'administration', origin: roomNumber)
        qrLink     = generateQRLink(targetURL)

        hash = { name: name, email:email, department: department, title: title, targetURL: targetURL, qrLink: qrLink }

        @results.push(hash)
      end
    end

    render :layout => false
  end

  # GET /directory_objects
  def index
    @type = params[:type]

    if params[:type] == "Person"
      @directory_objects = Person.all.order(:last)
      @scrubber_categories = ("A".."Z").to_a
    elsif params[:type] == "Department"
      @directory_objects = Department.all.order(:title)
      @scrubber_categories = ("A".."Z").to_a
    elsif params[:type] == "Event"
      @directory_objects = Event.all.order(:title)
      @scrubber_categories = []
    elsif params[:type] == "Room"
      @directory_objects = Room.all.order(:room_number)
      @scrubber_categories = ['L', 1, 2, 3, 4, 5]
    else
      # Unsupported behavior
      @directory_objects = []
      @scrubber_categories = []
    end

    @directory_objects = @directory_objects.uniq
  end

  def create
    @object = params_type_as_constant.new(directory_object_params)

    respond_to do |format|
      if @object.save
        logger.info Authorization.current_user.loginid.to_s + " created directory_object id: " + @object.id.to_s + " type: " + @object.type

        format.json { render json: @object }
      else
        format.json { render json: { message: @object.errors.full_messages }, status: 405 }
      end
    end
  end

  def update
    respond_to do |format|
      if @object.update(directory_object_params)
        logger.info Authorization.current_user.loginid.to_s + " updated directory_object id: " + @object.id.to_s + " type: " + @object.type

        format.json { render json: @object }
      else
        format.json { render json: { message: @object.errors.full_messages }, status: 405 }
      end
    end
  end

  def destroy
    if @object.present? and @object.type != 'Room'
      logger.info Authorization.current_user.loginid.to_s + " deleted directory_object id: " + @object.id.to_s + " type: " + params[:type].singularize.capitalize

      @object.destroy
      respond_to do |format|
        format.json {render json: { message: "Object deleted successfully", id: @object.id }, status: 302 }
      end
    else
      render json: { message: "Error destroying " + params[:type] + "." }, status: 405
    end
  end

  # POST /directory/search
  def search
    @query = params[:q]

    unless @query.blank?
      objects = DirectoryObject.arel_table

      query_objs = @query.split(/\s+/).map { |q|
        "%#{q}%"
      }
      query_objs.push("%#{params[:q]}%")

      query = query_objs.reduce("") { |qry,obj|
        if ! qry.is_a?(Arel::Nodes::Grouping)
            new_qry = objects[:first].matches(obj)
        else
            new_qry = qry.or(objects[:first].matches(obj))
        end

        new_qry.or(objects[:last].matches(obj))
           .or(objects[:title].matches(obj))
           .or(objects[:email].matches(obj))
           .or(objects[:name].matches(obj))
           .or(objects[:room_number].matches(obj))
      }

      @directory_objects = DirectoryObject.where(query)

      @directory_objects = @directory_objects.uniq

      # Remove special characters
      clean_query = params[:q].downcase.gsub(/[^0-9A-Za-z\s]/, '')

      terms_list = clean_query.strip.split(/\s+/)

      terms_list.each do |term|
        term_log = SearchTermLog.where(term: term).first_or_create
        term_log.count = term_log.count + 1
        term_log.save
      end

      # No results were found, log the query
      if @directory_objects.first == nil
        UnmatchedQueryLog.where(query: clean_query).first_or_create
      end

      respond_to do |format|
        format.json
        format.html
      end
    end
  end

  def unroutable
    unless params[:from] || params[:to]
      head 405, content_type: "text/html"
    end

    unroutable_route = UnroutableLog.where(from: params[:from], to: params[:to]).first_or_create

    if unroutable_route
      unroutable_route.hits ? unroutable_route.hits += 1 : unroutable_route.hits = 1
      unroutable_route.save
    end

    head :ok, content_type: "text/html"
  end

  # GET /directory_objects/1
  # GET /room/1
  # GET /start/R0070/end/R2169
  # GET /start/R0070/directory/1234
  def show
    respond_to do |format|
      format.html
      format.json { render json: @object }
    end
  end

  def test
  end

  private

    def params_type_as_constant
      if params and params[:type] and DirectoryObject::TYPES.include?(params[:type])
        case params[:type]
        when "Person"
          return Person
        when "Event"
          return Event
        when "Department"
          return Department
        when "Room"
          return Room
        else
          return DirectoryObject
        end
      else
        return DirectoryObject
      end
    end

    # Normalizes input for room numbers
    def normalize_room(number)
      return nil if number.nil?

      number.slice!(0) if number[0].upcase == "R"

      return number.to_s.rjust(4, '0').prepend("R")
    end

    def set_directory_object
      @object = DirectoryObject.where(room_number: params[:number]).first if params[:number]
      @object = params_type_as_constant.find_by(id: params[:id]) unless @object
    end

    # Used as before_action.
    # Sets @origin and @dest for views, if applicable.
    def set_origin
      # Prefer url-specified start locations over set ones when the URL is of
      # format /start/.../end/...
      @origin = normalize_room(params[:start_loc]) || normalize_room(session[:start]) ||
                cookies[:origin] || cookies[:start_location]
      @dest = normalize_room(params[:end_loc])

      if cookies[:origin].blank?
        cookies[:start_location] = @origin
      end

      unless @origin
        logger.error "An instance of Wayfinding had a page loaded without an origin set. IP: #{request.remote_ip}"
      end
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def directory_object_params
      case params[:type]
      when 'Person'
        params.permit(:title, :office_hours, :first, :last, :email, :phone, :department_id, :room_ids => [])
      when 'Room'
        params.permit(:name)
      when 'Department'
        params.permit(:title, :room_id)
      else
        params.permit()
      end
    end

    def generateQRLink(url)
      return url_for(action: 'generateQR', controller: 'directory_objects', url: url)
    end
end
