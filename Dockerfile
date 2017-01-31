FROM ruby:2.3

# Update and install stuff your app needs to run
RUN apt-get update -qq && \
	apt-get install -yq nodejs nginx supervisor && \
	rm -rf /etc/nginx/sites-available/default

# Installing your gems this way caches this step so you dont have to reintall your gems every time you rebuild your image.
# More info on this here: http://ilikestuffblog.com/2014/01/06/how-to-skip-bundle-install-when-deploying-a-rails-app-to-docker/
# Copy the Gemfile and Gemfile.lock into the image.
WORKDIR /usr/src/app/
COPY ["Gemfile", "Gemfile.lock", "./"]
RUN bundle install && \
# This line to fix an incompatibility bug between rubygems and bundler: https://github.com/bundler/bundler/issues/4381
	gem install bundler --pre


# Configure nginx
COPY ./nginx.conf /etc/nginx/nginx.conf

# Copy our source files precompile assets
COPY . ./
RUN chown -R www-data:www-data .
RUN RAILS_ENV=production bundle exec rake assets:precompile

EXPOSE 443

# Start supervisor
CMD ["/usr/bin/supervisord"]
