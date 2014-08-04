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
  end
end
