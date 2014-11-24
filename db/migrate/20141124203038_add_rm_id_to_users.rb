class AddRmIdToUsers < ActiveRecord::Migration
  def change
    add_column :users, :rm_id, :integer
  end
end
