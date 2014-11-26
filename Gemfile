source 'https://rubygems.org'

gem 'rails', '~> 4.1.8'

# Use SCSS for stylesheets
gem 'sass-rails', '~> 4.0.3'
# Use Uglifier as compressor for JavaScript assets
gem 'uglifier', '>= 1.3.0'
# Use CoffeeScript for .js.coffee assets and views
gem 'coffee-rails', '~> 4.0.0'
# See https://github.com/sstephenson/execjs#readme for more supported runtimes
gem 'therubyracer',  platforms: :ruby

gem 'turbolinks'

# RSS feed parser
gem 'feedjira'

# For scheduled tasks
gem 'whenever'

# Delayed job for running the buildCaches script
gem 'delayed_job_active_record'
gem 'daemons'

# Use jquery as the JavaScript library
gem 'jquery-rails'

# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
gem 'jbuilder', '~> 2.0'

# bundle exec rake doc:rails generates the API under doc/api.
gem 'sdoc', '~> 0.4.0',          group: :doc

# CAS Authentication
# Using git because the before method seems to be missing from the filter class.
# More: https://github.com/rubycas/rubycas-client/issues/78
gem 'rubycas-client', :git => 'git://github.com/rubycas/rubycas-client.git'

# Provides Authorization
gem 'declarative_authorization'

# Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
gem 'spring',        group: :development

# Use Capistrano for deployment
group :development do
  gem 'capistrano', '< 3.0.0'
  gem 'capistrano-npm'
end

# Use debugger
# gem 'debugger', group: [:development, :test]

group :test, :development do
  gem 'sqlite3'
end

group :production do
  gem 'pg'
  gem 'exception_notification'
end
