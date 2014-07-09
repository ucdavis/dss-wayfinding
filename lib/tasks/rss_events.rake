require 'rake'
require 'pp'
namespace :rss_events do
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
      feed = feeds[url]
      event = Event.new
      feed.entries.each do |entry|
      event.rss_feed = url

      entry.each do |e|
        if e == "title"
            event.title = entry[e]
        end

        if e == "time"
          event.time = entry[e]
        end

        if e == "date"
          event.date = entry[e]
        end

        if e == "link"
          event.link = entry[e]
        end

        if e == "location"
          # try to parse string and find a room to associate to
        end
      end
      
      event.save
    end
  end
end
end
