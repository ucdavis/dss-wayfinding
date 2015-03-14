class DirectoryObjectsController < ApplicationController
  before_action :set_origin
  skip_before_filter :require_login
  skip_before_filter :authenticate

  respond_to :html, :json

  # GET /directory_objects
  def index
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
      @scrubber_categories = ['L',1,2,3,4,5]
      @scrubber_categories = []
    else
      # Unsupported behavior
      @directory_objects = []
      @scrubber_categories = []
    end

    @directory_objects = @directory_objects.uniq
  end

  def create
    type = params[:type].singularize.capitalize

    case type
    when 'Person'
      @object = Person.new
    when 'Department'
      @object = Department.new
    end

    if !@object.present?
      respond_to do |format|
        format.json {render json: { message: "Error identifying type of object" }, status: 405 }
      end
    end

    if type == 'Person' && (params[:first].blank? || params[:last].blank?)
        respond_to do |format|
            format.json {render json: { message: "Error: both first and last names must be supplied" }, status: 405}
        end
    end

    @object.first = params[:first] unless params[:first].blank?
    @object.last = params[:last] unless params[:last].blank?
    @object.email = params[:email] unless params[:email].blank?
    @object.phone = params[:phone] unless params[:phone].blank?
    @object.room_number = params[:room_number] unless params[:room_number].blank?
    @object.name = params[:name] unless params[:name].blank?
    @object.title = params[:title] unless params[:title].blank?
    @object.department = Department.find(params[:department]) unless params[:department].blank?

    if type == 'Person'
      @object.rooms = []
      params[:rooms].each do |room|
        @object.rooms << Room.find(room)
      end unless params[:rooms].blank?
    end
    if type == 'Department'
      @object.room = Room.find_by(room_number: params[:room].rjust(4,'0')) unless params[:room].blank?
    end

    if @object.save
      respond_to do |format|
        format.json { render json: @object }
      end
    else
      respond_to do |format|
        format.json {render json: { message: "Error Creating " + type + ".. Duplicate?" }, status: 405 }
      end
    end
  end

  def update
    # Find existing object
    @object = DirectoryObject.find_by(id: params[:id])
    type = params[:type].singularize.capitalize

    if @object.present?
      @object.first = params[:first] unless params[:first].blank?
      @object.last = params[:last] unless params[:last].blank?
      @object.email = params[:email] unless params[:email].blank?
      @object.phone = params[:phone] unless params[:phone].blank?
      @object.room_number = params[:room_number] unless params[:room_number].blank?
      @object.name = params[:name] unless params[:name].blank?
      @object.title = params[:title] unless params[:title].blank?
      @object.department = Department.find(params[:department]) unless params[:department].blank?
      if type == 'Person'
        @object.rooms = []
        params[:rooms].each do |room|
          @object.rooms << Room.find(room)
        end unless params[:rooms].blank?
      end
      if type == 'Department'
        @object.room = Room.find_by(room_number: params[:room].rjust(4,'0')) unless params[:room].blank?
      end

      if @object.save
          respond_to do |format|
            format.json { render :json => @object }
          end
      else
          respond_to do |format|
              format.json { render json: { message: "Error updating " + type + "." }, status: 405 }
          end
      end 

    else

      respond_to do |format|
        format.json {render json: { message: "Error finding directory object" }, status: 405 }
      end

    end
  end

  def destroy
    if params[:id].present?
      # Find existing object
      @object = DirectoryObject.find(params[:id])
    end
    if @object.present? and @object.type != 'Room'
      @object.destroy
      respond_to do |format|
        format.json {render json: { message: "Object deleted successfully", id: @object.id }, status: 302 }
      end
    else
      respond_to do |format|
        format.json {render json: { message: "Error deleting directory object" }, status: 405 }
      end
    end
  end

  # POST /directory/search
  def search
    if params[:q] && params[:q].length > 0
      @query = params[:q]
      objects = DirectoryObject.arel_table
      query = "%#{params[:q]}%"

      @directory_objects = DirectoryObject.where(objects[:first].matches(query)
                                             .or(objects[:last].matches(query))
                                             .or(objects[:title].matches(query))
                                             .or(objects[:email].matches(query))
                                             .or(objects[:name].matches(query))
                                             .or(objects[:room_number].matches(query)))

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

  # GET /directory_objects/1
  # GET /room/1
  def show
    @directory_object = DirectoryObject.where(room_number: params[:number]).first if params[:number]
    @directory_object = DirectoryObject.find(params[:id]) if params[:id] && @directory_object.nil?

    respond_with @directory_object
  end

  private

  def set_origin
    @origin = cookies[:origin] || cookies[:start_location]

    unless @origin
      logger.error "An instance of Wayfinding had a page loaded without an origin set. IP: #{request.remote_ip}"
    end
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def directory_object_params
    params.require(:directory_object).permit(:title, :time, :link, :first, :last, :email, :phone, :name, :room_number, :is_bathroom, :rss_feed, :type, :room_id)
  end
end
