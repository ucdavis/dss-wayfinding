require "bundler/capistrano"
require "delayed_job_active_record"

# 'delayed_job' setup
require "delayed/recipes"

# Use 10 background workers (the same value should be set in config/schedule.rb)
set :delayed_job_args, "-n 1"

# 'whenever' setup
set :whenever_command, "bundle exec whenever"
require "whenever/capistrano"

before "deploy:restart", "delayed_job:stop"
after  "deploy:restart", "delayed_job:start"
after "deploy:stop",  "delayed_job:stop"
after "deploy:start", "delayed_job:start"

server "169.237.120.176", :web, :app, :db, primary: true

set :application, "dss-wayfinding"
set :url, "http://wayfinding.dss.ucdavis.edu/"
set :user, "deployer"
set :deploy_to, "/home/#{user}/apps/#{application}"
set :deploy_via, :remote_cache
set :use_sudo, false

set :scm, "git"
set :repository, "https://github.com/dssit/#{application}.git"
set :branch, "master"

set :test_log, "log/capistrano.test.log"

default_run_options[:pty] = true
ssh_options[:forward_agent] = true

after "deploy", "deploy:cleanup" # keep only the last 5 releases
#after "deploy", "deploy:migrations" # run any pending migrations
after "deploy:update_code", "deploy:migrate"

namespace :deploy do
  before 'deploy' do
    puts "--> Running tests, please wait ..."
    unless system "bundle exec rake > #{test_log} 2>&1" #' > /dev/null'
      puts "--> Tests failed. Run `cat #{test_log}` to see what went wrong."
      exit
    else
      puts "--> Tests passed"
      system "rm #{test_log}"
    end
  end

  desc "Restart Passenger server"
  task :restart, roles: :app, except: {no_release: true} do
    run "touch #{current_path}/tmp/restart.txt"
  end

  desc "First-time config setup"
  task :setup_config, roles: :app do
    run "mkdir -p #{shared_path}/config"
    run "mkdir -p #{shared_path}/maps"
    run "mkdir -p #{shared_path}/dataStore"
    put File.read("config/database.example.yml"), "#{shared_path}/config/database.yml"
    put File.read("config/auth_config.example.yml"), "#{shared_path}/config/auth_config.yml"
    put File.read("config/secret_token.example.yml"), "#{shared_path}/config/secret_token.yml"
    puts "Now edit the config files in #{shared_path}."
  end
  after "deploy:setup", "deploy:setup_config"

  desc "Symlink config from shared to the newly deployed copy"
  task :symlink_config, roles: :app do
    run "ln -nfs #{shared_path}/config/database.yml #{release_path}/config/database.yml"
    run "ln -nfs #{shared_path}/config/auth_config.yml #{release_path}/config/auth_config.yml"
    run "ln -nfs #{shared_path}/config/secret_token.yml #{release_path}/config/secret_token.yml"
    run "ln -nfs #{shared_path}/config/dss_rm.yml #{release_path}/config/dss_rm.yml"
    run "ln -nfs #{shared_path}/maps #{release_path}/public/maps"
    run "ln -nfs #{shared_path}/dataStore #{release_path}/public/dataStore"
    run "mkdir -p #{release_path}/tmp/sessions/"
  end
  after "deploy:finalize_update", "deploy:symlink_config"

  desc "Run npm install to rebuild node_modules"
  task :node_config, roles: :app do
    run "cd nodejs && npm install"
  end
  after "deploy:finalize_update", "deploy:node_config"

  desc "Make sure local git is in sync with remote."
  task :check_revision, roles: :web do
    unless `git rev-parse HEAD` == `git rev-parse origin/master`
      puts "WARNING: HEAD is not the same as origin/master"
      puts "Run `git push` to sync changes."
      exit
    end
  end
  before "deploy", "deploy:check_revision"
end
