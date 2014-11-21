class AddUniqueIndexToRooms < ActiveRecord::Migration
  def change
    add_index :directory_objects, [:room_number], unique: true
  end
end
