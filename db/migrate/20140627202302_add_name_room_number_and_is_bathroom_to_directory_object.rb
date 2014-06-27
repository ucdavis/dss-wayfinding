class AddNameRoomNumberAndIsBathroomToDirectoryObject < ActiveRecord::Migration
  def change
    add_column :directory_objects, :name, :string
    add_column :directory_objects, :room_number, :string
    add_column :directory_objects, :is_bathroom, :boolean, :default => false
  end
end
