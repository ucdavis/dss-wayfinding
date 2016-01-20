class DropRmIdFromUser < ActiveRecord::Migration
  def change
    remove_column :users, :rm_id
  end
end
