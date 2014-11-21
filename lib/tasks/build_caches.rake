require 'rake'

namespace :caches do
  desc 'Rebuilds map caches'
  task :build => :environment do
    `node nodejs/buildCaches.js &`
  end
end
