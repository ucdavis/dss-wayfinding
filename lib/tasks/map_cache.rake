require 'rake'
require 'fileutils'

namespace :map_cache do
  desc 'Ensures cache in Rails /public is up-to-date with NodeJS script output.'
  task :update => :environment do
    # Get the contents of the '/nodejs/maps' directory
    mapsDirContents = Dir.entries(File.join(Rails.root, "nodejs", "maps")).delete_if {|f| f == '.' || f == '..'}

    # Sort by file modification time so that the latest directory is the first in the array
    mapsDirContents = mapsDirContents.sort_by {|f| File.mtime(File.join(Rails.root, "nodejs", "maps", f))}.reverse

    # Delete all but the latest directory (first in the array)
    mapsDirContents.drop(1).each do |f|
      f = File.join(Rails.root, "nodejs", "maps", f)
      FileUtils.rm_rf(f)
    end

    # Copy latest contents to #{Rails.root}/public so asset_path() can find them
    FileUtils.cp_r(Dir[File.join(Rails.root, "nodejs", "maps", mapsDirContents[0], "*")], File.join(Rails.root, "public"))

    # Remove any caches from #{Rails.root}/public that aren't from the latest copy
    # This is done after /public is updated so at no point will a needed cache be missing
    publicDirContents = Dir.entries(File.join(Rails.root, "public"))
    latestCacheDirContents = Dir.entries(File.join(Rails.root, "nodejs", "maps", mapsDirContents[0]))

    publicDirContents.each do |f|
      # Only worry about directory contents which are data stores
      if f.include?("dataStore-")
        if latestCacheDirContents.include?(f) == false
          # Found a dataStore file which is not from the latest cache. Delete it.
          File.delete(File.join(Rails.root, "public", f))
        end
      end
    end
  end
end
