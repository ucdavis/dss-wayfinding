require 'rake'
require 'pp'

namespace :rss do
  desc 'Parses rss feeds and updates local sync.'
  task :fetch => :environment do
    # TODO- code handles one feed currently, needs to be expanded to handle multiple feeds

    # Set urls array here
    url = 'http://sociology.ucdavis.edu/events/aggregator/colloquia/RSS'
    # Fetching
    urls = %w[http://sociology.ucdavis.edu/events/aggregator/colloquia/RSS]
    feeds = Feedjira::Feed.fetch_and_parse urls # returns a Hash, with each url having a  Feedjira::Feed object

    # Verify we got a valid response from the server, if not stop everything
    if feeds
      # Blow away old data
      DirectoryObject.events.destroy_all(:rss_feed => url)

      # Begin Parsing
      department = Department.where(title: "sociology").first
      room = nil

      feed = feeds[url]

      feed.entries.each do |entry|
      event = Event.new
      event.rss_feed = url

      entry.each do |e|
        if e == "title"
            event.title = entry[e]
        end

        if e == "date"
          event.time = entry[e]
        end

        if e == "link"
          event.link = entry[e]
        end

        if e == "location"
          room = Room.where("room_number LIKE ?", e).first
        end
      end

      # event did not have a parsable location, use default department location
      if room
        event.room = room
      else
        event.room = department.room
      end

      event.department = department
      event.rss_feed = url
      event.save
    end
  end
end
end
