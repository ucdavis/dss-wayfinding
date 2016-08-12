class AddPersonTitleToDirectoryObjects < ActiveRecord::Migration
  def change
    add_column :directory_objects, :person_title, :string
  end
end
