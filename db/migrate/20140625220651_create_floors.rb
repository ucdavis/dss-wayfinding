class CreateFloors < ActiveRecord::Migration
  def change
    create_table :floors do |t|
      t.string :title
      t.integer :floor_number

      t.timestamps
    end
  end
end
