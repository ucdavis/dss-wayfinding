class CreateRssFeeds < ActiveRecord::Migration
  def change
    create_table :rss_feeds do |t|

      t.string :url

      t.timestamps
    end
  end
end
