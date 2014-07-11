class AddDepartmentIdToDirectoryObject < ActiveRecord::Migration
  def change
    add_column :directory_objects, :department_id, :integer
  end
end
