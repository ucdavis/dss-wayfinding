class CreateDirectoryObjects < ActiveRecord::Migration
  def change
    create_table :directory_objects do |t|

      t.timestamps
    end
  end
end
