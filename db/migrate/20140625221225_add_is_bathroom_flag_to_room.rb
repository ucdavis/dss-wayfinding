class AddIsBathroomFlagToRoom < ActiveRecord::Migration
  def change
    add_column :rooms, :is_bathroom, :boolean, default: false
  end
end
