class AddDepartmentIdAndRoomIdToEventAndRoom < ActiveRecord::Migration
  def change
    add_column :rooms, :department_id, :integer
    add_column :events, :department_id, :integer
    add_column :events, :room_id, :integer
  end
end
