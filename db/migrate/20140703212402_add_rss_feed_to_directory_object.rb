class AddRssFeedToDirectoryObject < ActiveRecord::Migration
  def change
    add_column :directory_objects, :rss_feed, :string
  end
end
