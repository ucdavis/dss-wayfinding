class AddOfficeHoursToDirectoryObjects < ActiveRecord::Migration
  def change
    add_column :directory_objects, :office_hours, :string
  end
end
