# config valid only for current version of Capistrano
lock '3.7.2'

set :application, 'dss-wayfinding'
set :repo_url, 'https://github.com/dssit/dss-wayfinding.git'

# Default branch is :master
# ask :branch, proc { `git rev-parse --abbrev-ref HEAD`.chomp }.call

set :passenger_restart_with_touch, true

# Default deploy_to directory is /var/www/my_app_name
set :deploy_to, "/home/deployer/apps/#{fetch(:application)}"

# Default value for :format is :pretty
set :format, :pretty

# Default value for :log_level is :debug
set :log_level, :debug

# Default value for :pty is false
# set :pty, true

# Default value for :linked_files is []
set :linked_files, fetch(:linked_files, []).push('config/database.yml', 'config/auth_config.yml', 'config/secret_token.yml', 'config/dss_rm.yml')

# Default value for linked_dirs is []
set :linked_dirs, fetch(:linked_dirs, []).push('bin', 'log', 'tmp/pids', 'tmp/cache', 'tmp/sockets', 'vendor/bundle', 'public/system')

# Default value for default_env is {}
# set :default_env, { path: "/opt/ruby/bin:$PATH" }

# Default value for keep_releases is 5
set :keep_releases, 5

# Let NPM know where to install (default: not set)
#set :npm_target_path, -> { release_path.join('nodejs') }
#set :npm_flags, '--production --silent --no-progress'

# Use 1 background worker (the same value should be set in config/schedule.rb)
set :delayed_job_args, "-n 1 -p wayfinding"

# Restart delayed_job on every deploy
after 'deploy:publishing', 'deploy:restart'

namespace :deploy do

  after :restart, :clear_cache do
    on roles(:web), in: :groups, limit: 3, wait: 10 do
      # Here we can do anything such as:
      # within release_path do
      #   execute :rake, 'cache:clear'
      # end
    end
  end

  task :restart do
    invoke 'delayed_job:restart'
  end

end
