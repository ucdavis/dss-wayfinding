class AddTypeToDirectoryObject < ActiveRecord::Migration
  def change
      add_column :directory_objects, :type, :string
  end
end
