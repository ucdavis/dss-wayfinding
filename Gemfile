source 'https://rubygems.org'

gem 'rails', '~> 4.2.7.1'

# Use SCSS for stylesheets
gem 'sass-rails', '~> 5.0'
# Use Uglifier as compressor for JavaScript assets
gem 'uglifier', '>= 1.3.0'
# Use CoffeeScript for .js.coffee assets and views
gem 'coffee-rails', '~> 4.1.0'
# See https://github.com/sstephenson/execjs#readme for more supported runtimes
gem 'therubyracer',  platforms: :ruby

gem 'unicorn'

# RSS feed parser
gem 'feedjira'

# QR code generator
gem 'rqrcode'

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
gem 'rubycas-client', :git => 'https://github.com/rubycas/rubycas-client.git'

# Provides Authorization
gem 'declarative_authorization'

# Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
gem 'spring',        group: :development

# Use Capistrano for deployment
group :development do
  gem 'capistrano', '= 3.7.2', require: false
  gem 'capistrano-rails',   '~> 1.1', require: false
  gem 'capistrano-bundler', '~> 1.1', require: false
  gem 'capistrano-passenger', require: false
  gem 'capistrano-npm', require: false
  gem 'web-console', '~> 2.0'
end

group :test, :development do
  gem 'sqlite3'
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem 'byebug'
end

group :production do
  gem 'pg'
  gem 'exception_notification'
end
