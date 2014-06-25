class CreatePeople < ActiveRecord::Migration
  def change
    create_table :people do |t|
      t.string :phone
      t.string :first
      t.string :last
      t.string :email

      t.timestamps
    end
  end
end
