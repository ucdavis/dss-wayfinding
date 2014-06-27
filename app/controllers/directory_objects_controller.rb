class DirectoryObjectsController < ApplicationController
  before_action :set_book, only: [:show, :edit, :update, :destroy]

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
    def set_book
      @book = DirectoryObject.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def book_params
      params.require(:book).permit(:title, :entry)
    end
end
