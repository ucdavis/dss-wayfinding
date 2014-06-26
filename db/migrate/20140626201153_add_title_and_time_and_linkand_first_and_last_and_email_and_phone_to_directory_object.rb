class AddTitleAndTimeAndLinkandFirstAndLastAndEmailAndPhoneToDirectoryObject < ActiveRecord::Migration
  def change
    add_column :directory_objects, :title, :string
    add_column :directory_objects, :time, :datetime
    add_column :directory_objects, :link, :string
    add_column :directory_objects, :first, :string
    add_column :directory_objects, :last, :string
    add_column :directory_objects, :email, :string
    add_column :directory_objects, :phone, :string
  end
end
