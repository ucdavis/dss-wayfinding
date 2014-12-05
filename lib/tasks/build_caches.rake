require 'rake'
require 'fileutils'
require 'nokogiri'
require 'open-uri'

namespace :caches do
  desc 'Rebuilds map caches'
  task :build => :environment do
    Rails.logger.tagged("Task(caches:build)") {

      Rails.logger.info "Beginning task at #{Time.now}"

      # Run the nodejs script as a shell command
      node_output = `node #{Rails.root}/nodejs/buildCaches.js`

      Rails.logger.info "Node command output:"
      Rails.logger.info node_output

      # Populate rooms from new maps once the cache build is done

      # Get the contents of the '/public/maps' directory, ignoring hidden files and directories
      mapsDirContents = Dir.entries(File.join(Rails.root, "public", "maps")).delete_if {|f| f[0] == '.'}

      if mapsDirContents.length == 0
        Rails.logger.error "Cannot find a maps cache directory in #{File.join(Rails.root, "public", "maps")} or directory is empty."
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

      Rails.logger.info "Task finished at #{Time.now}"
    }

  end
end
