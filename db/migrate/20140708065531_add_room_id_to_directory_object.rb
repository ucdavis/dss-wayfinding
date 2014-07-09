class AddRoomIdToDirectoryObject < ActiveRecord::Migration
  def change
    add_column :directory_objects, :room_id, :integer
  end
end
