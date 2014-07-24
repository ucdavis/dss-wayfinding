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
      @directory_objects = DirectoryObject.people.all
    elsif params[:type] == "Department"
      @directory_objects = DirectoryObject.departments.all
    elsif params[:type] == "Event"
      @directory_objects = DirectoryObject.events.all
    elsif params[:type] == "Room"
      @directory_objects = DirectoryObject.rooms.all
    else
      @directory_objects = DirectoryObject.all
    end
      @directory_objects = @directory_objects.uniq
  end

  # GET /directory_objects/1
  # GET /directory_objects/1.json
  def show
    @directory_object = DirectoryObject.find(params[:id])
    # Set the destination
    @destination = 'R' + @directory_object.room_number unless @directory_object.room_number.blank?
  end

  def landing
    render :layout => "landing"
  end

  def map
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
    @directory_object = DirectoryObject.find(params[:id])
  end

  def set_origin
    @origin = cookies[:origin]
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def directory_object_params
    params.require(:directory_object).permit(:title, :time, :link, :first, :last, :email, :phone, :name, :room_number, :is_bathroom, :rss_feed, :type, :room_id)
  end
end
