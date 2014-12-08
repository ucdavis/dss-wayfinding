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

  # POST /directory/search
  def search
    if params[:q] && params[:q].length > 0
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
