require 'rake'
require 'fileutils'
require 'nokogiri'
require 'open-uri'

namespace :caches do
  desc 'Rebuilds map caches'
  task :build => :environment do
    Rails.logger.tagged("Task(caches:build)") do
      Rails.logger.info "Beginning task at #{Time.now}"

      # Check whether public/dataStore and public/maps directories exist
      if File.directory?("#{Rails.root}/public/dataStore") == false
        Rails.logger.error "#{Rails.root}/public/dataStore does not exist. Cannot build map caches."
        Rails.logger.error "Capistrano should have symlinked the directory from shared/."
      end

      if File.directory?("#{Rails.root}/public/maps") == false
        Rails.logger.error "#{Rails.root}/public/maps does not exist. Cannot build map caches."
        Rails.logger.error "Capistrano should have symlinked the directory from shared/."
      end

      # Clear out /public/dataStore.tmp (in case it already exists)
      FileUtils.rm_rf("#{Rails.root}/public/dataStore.tmp")
      FileUtils.mkdir("#{Rails.root}/public/dataStore.tmp", :mode => 0755)

      # Run the nodejs script as a shell command
      node_output = `node #{Rails.root}/nodejs/buildCaches.js`

      Rails.logger.info "Node command output:"
      Rails.logger.info node_output

      # Move caches to proper location (removing old caches)
      FileUtils.rm_rf(Dir.glob("#{Rails.root}/public/dataStore/*"))
      FileUtils.mv Dir.glob("#{Rails.root}/public/dataStore.tmp/*"), "#{Rails.root}/public/dataStore/"

      # Move uploaded map files (removing old maps)
      FileUtils.rm_rf(Dir.glob("#{Rails.root}/public/maps/*"))
      FileUtils.mv Dir.glob("#{Rails.root}/public/maps.tmp/*"), "#{Rails.root}/public/maps/"

      # Remove temp directories
      FileUtils.rm_rf("#{Rails.root}/public/dataStore.tmp")
      FileUtils.rm_rf("#{Rails.root}/public/maps.tmp")

      # Populate rooms from new maps once the cache build is done

      # Get the SVG contents of '/public/maps'
      mapsDirContents = Dir.glob("#{Rails.root}/public/maps/*.svg")

      if mapsDirContents.length == 0
        Rails.logger.error "No SVG files found in #{File.join(Rails.root, "public", "maps")}."
        exit
      end

      # Loop over the <g> tags under the div with id "Rooms" and use their ids to create rooms
      mapsDirContents.each do |map|
        url = File.open(map);
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
    end
  end
end
