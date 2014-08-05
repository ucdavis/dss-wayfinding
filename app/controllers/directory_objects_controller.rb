class DirectoryObjectsController < ApplicationController
  before_action :set_directory_object, only: [:show, :edit, :update, :destroy]
  before_action :set_origin

  # GET /directory_objects
  # GET /directory_objects.json
  def index
    if params[:search] && params[:search].length > 0
      # Put search query logic here, should search first, last, title, email, name, room_number, type
      results = Person.where("first LIKE ?", "%#{params[:search]}%")
      results = results + Person.where("last LIKE ?", "%#{params[:search]}%")
      results = results + Event.where("title LIKE ?", "%#{params[:search]}%")
      results = results + Person.where("email LIKE ?", "%#{params[:search]}%")
      results = results + Room.where("name LIKE ?", "%#{params[:search]}%")
      results = results + Room.where("room_number LIKE ?", "%#{params[:search]}%")
      results = results + DirectoryObject.where("type LIKE ?", "%#{params[:search]}%")

      department = Department.where("title LIKE ?", "%#{params[:search]}%")
      results = results + department

      people = Person.where(department: department)
      results = results + people

      events = Event.where(department: department)
      results = results + events

      @directory_objects = results

    elsif params[:type] == "Person"
      @directory_objects = DirectoryObject.people.all.order(:last)
    elsif params[:type] == "Department"
      @directory_objects = DirectoryObject.departments.all.order(:title)
    elsif params[:type] == "Event"
      @directory_objects = DirectoryObject.events.all.order(:title)
    elsif params[:type] == "Room"
      @directory_objects = DirectoryObject.rooms.all.order(:room_number)
    else
      @directory_objects = DirectoryObject.all
    end
      @directory_objects = @directory_objects.uniq
  end

  # GET /directory_objects/1
  def show
    # Object may not exist if they just want to see the map
    if @directory_object
      if @directory_object.type == "Room"
          @destination = 'R' + @directory_object.room_number unless @directory_object.room_number.blank?
      elsif @directory_object.type == "Person"
        p = Person.find(params[:id])
        @destination = 'R' + p.rooms.first.room_number if p.rooms.present?
      elsif @directory_object.type == "Department"
        d = Department.find(params[:id])
        @destination = 'R' + d.room.room_number if d.room.present?
      elsif @directory_object.type == "Event"
        e = Event.find(params[:id])
        @destination = 'R' + e.room.room_number if e.room.present?
      end
    end
    render "show"
  end

  def landing
    render :layout => "landing"
  end

  def about
  end

  def new
  end

  def create
  end

  def delete
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_directory_object
    @directory_object = DirectoryObject.find(params[:id]) if params[:id]
  end

  def set_origin
    @origin = cookies[:origin]

    unless @origin
      logger.error "An instance of Wayfinding had a page loaded without an origin set. IP: #{request.remote_ip}"
    end
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def directory_object_params
    params.require(:directory_object).permit(:title, :time, :link, :first, :last, :email, :phone, :name, :room_number, :is_bathroom, :rss_feed, :type, :room_id)
  end
end
