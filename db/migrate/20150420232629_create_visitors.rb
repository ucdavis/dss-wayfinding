class CreateVisitors < ActiveRecord::Migration
  def change
    create_table :visitors do |t|
      t.integer :device_id
      t.datetime :start
      t.datetime :end

      t.timestamps
    end
  end
end
