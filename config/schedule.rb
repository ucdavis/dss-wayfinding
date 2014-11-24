#set :output, "/path/to/my/cron_log.log"

# Ensure the local events DB is up-to-date
every 15.minutes do
  rake "rss:fetch"
end

# Ensure our background processor starts up on reboot
every :reboot do
  envcommand 'script/delayed_job -n 1 restart'
end
