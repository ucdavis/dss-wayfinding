class CreateDevices < ActiveRecord::Migration
  def change
    create_table :devices do |t|
      t.string :ip
      t.boolean :kiosk
      t.integer :room_id

      t.timestamps
    end
  end
end
