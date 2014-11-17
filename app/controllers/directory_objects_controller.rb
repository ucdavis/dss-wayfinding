class DirectoryObjectsController < ApplicationController
  before_action :set_origin

  # GET /directory_objects
  def index
    if params[:type] == "Person"
      @directory_objects = Person.all.order(:last)
    elsif params[:type] == "Department"
      @directory_objects = Department.all.order(:title)
    elsif params[:type] == "Event"
      @directory_objects = Event.all.order(:title)
    elsif params[:type] == "Room"
      @directory_objects = Room.all.order(:room_number)
    else
      @directory_objects = DirectoryObject.all
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

      render "index"
    end
  end

  # GET /directory_objects/1
  # 'show' is also used for the generic map in which case params[:id] is unset
  def show
    @directory_object = DirectoryObject.find(params[:id]) if params[:id]

    if @directory_object
      case @directory_object.type
      when "Room"
        @destination = 'R' + @directory_object.room_number unless @directory_object.room_number.blank?
      when "Person"
        p = Person.find(params[:id])

        @destination = 'R' + p.rooms.first.room_number if p.rooms.present?

        @directory_object.room_number = @destination
        @directory_object.name = @directory_object.first + ' ' + @directory_object.last
        @department = @directory_object.department.title
      when "Department"
        d = Department.find(params[:id])

        @destination = 'R' + d.room.room_number if d.room.present?
        @department = @directory_object.title
      when "Event"
        e = Event.find(params[:id])

        @destination = 'R' + e.room.room_number if e.room.present?
        @department = @directory_object.department.title
      end
    end
  end

  def landing
    #render :layout => "landing"
  end

  def about
  end

  def room
    @found = DirectoryObject.where(room_number: params[:number]).first
    if @found
      @room = {
          room_number: @found.room_number,
          name: @found.name
        }
    end

    respond_to do |format|
      format.json { render :json => @room }
    end
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
