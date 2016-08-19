class RemovePersonTitleColumnFromDirectoryObjects < ActiveRecord::Migration
  def change
    remove_column :directory_objects, :person_title, :string
  end
end
