require 'rake'

namespace :rss do
  desc 'Parses rss feeds and updates local sync.'
  task :fetch => :environment do
    urls = RssFeed.all.map{ |f| f.url }

    feeds = Feedjira::Feed.fetch_and_parse(urls)

    feeds.each do |url, data|
      # Remove existing events form this feed
      Event.destroy_all(:rss_feed => url)

      # Add each entry in feed as an 'Event'
      data.entries.each do |entry|
        event = Event.new
        event.rss_feed = url

        entry.each do |e|
          event.title = entry[e] if e == "title"
          event.time = entry[e] if e == "date"
          event.link = entry[e] if e == "link"
          event.room = Room.where("room_number LIKE ?", e).first if e == "location"
        end

        event.save!
      end
    end
  end
end
