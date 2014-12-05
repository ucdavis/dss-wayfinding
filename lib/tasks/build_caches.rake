require 'rake'
require 'fileutils'
require 'nokogiri'
require 'open-uri'

namespace :caches do
  desc 'Rebuilds map caches'
  task :build => :environment do
    # Run the nodejs script as a shell command
    `node nodejs/buildCaches.js >& /tmp/nodejs-buildCaches.log`

    # Populate rooms from new maps once the cache build is done

    # Get the contents of the '/public/maps' directory, ignoring hidden files and directories
    mapsDirContents = Dir.entries(File.join(Rails.root, "public", "maps")).delete_if {|f| f[0] == '.'}

    if mapsDirContents.length == 0
      puts "Cannot find a maps cache directory in #{File.join(Rails.root, "public", "maps")}."
      exit
    end

    # Loop over the <g> tags under the div with id "Rooms" and use their ids to create rooms
    mapsDirContents.each do |map|
      url = File.open('public/maps/' + map);
      doc = Nokogiri::HTML open(url)

      doc.xpath('//*[contains(@id,"Rooms")]').each do |r|
        r.xpath("//a").each do |a|
          if a[:id].present?
            room = (a[:id][0].upcase == "R") ? a[:id][1,a[:id].length] : a[:id] # Remove proceeding R if present
            Room.create(room_number: room)
          end
        end
      end
    end

  end
end
