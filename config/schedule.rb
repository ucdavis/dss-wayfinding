#set :output, "/path/to/my/cron_log.log"

# Ensure the local events DB is up-to-date
every 15.minutes do
  rake "rss:fetch"
end

# Ensure dataCaches are up-to-date
every 4.hours do
  command "cd nodejs && `which node` buildCaches.js"
end
