class CreateUnroutableLogs < ActiveRecord::Migration
  def change
    create_table :unroutable_logs do |t|
      t.string :from
      t.string :to
      t.integer :hits

      t.timestamps
    end
  end
end
