class DirectoryObjectsController < ApplicationController
  before_action :set_directory_object, only: [:show, :edit, :update, :destroy]

  # GET /directory_objects
  # GET /directory_objects.json
  def index
    @directory_objects = DirectoryObject.all
  end

  # GET /directory_objects/1
  # GET /directory_objects/1.json
  def show
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_directory_object
    @directory_object = DirectoryObject.find(params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  #def directory_object_params
  #  params.require(:directory_object).permit(:title, :entry)
  #end
end
