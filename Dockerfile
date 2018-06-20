FROM ruby:2.4-alpine

ENV PATH /root/.yarn/bin:$PATH

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh build-base nodejs tzdata mysql-dev

RUN apk update \
  && apk add curl bash binutils tar gnupg \
  && rm -rf /var/cache/apk/* \
  && /bin/bash \
  && touch ~/.bashrc \
  && curl -o- -L https://yarnpkg.com/install.sh | bash \
  && apk del curl tar binutils

# Installing your gems this way caches this step so you dont have to reintall your gems every time you rebuild your image.
# More info on this here: http://ilikestuffblog.com/2014/01/06/how-to-skip-bundle-install-when-deploying-a-rails-app-to-docker/
# Copy the Gemfile and Gemfile.lock into the image.
WORKDIR /usr/src/app/

# Copy the Gemfile as well as the Gemfile.lock and install
# the RubyGems. This is a separate step so the dependencies
# will be cached unless changes to one of those two files
# are made.
COPY Gemfile Gemfile.lock ./
RUN gem install bundler && bundle install -j "$(getconf _NPROCESSORS_ONLN)" --retry 5 --without development test

# Copy dependencies for Node.js and instance the packages.
# Again, being separate means this will cache.
COPY package.json yarn.lock ./
RUN yarn install
RUN npm rebuild node-sass --force

# Set Rails to run in production
ENV RAILS_ENV production 
ENV RACK_ENV production
ENV RAILS_ROOT /usr/src/app

# Use Rails for static files in public
ENV RAILS_SERVE_STATIC_FILES 0

# Set Rack::Timeout values
ENV RACK_TIMEOUT_SERVICE_TIMEOUT 120

# Log to STDOUT
ENV RAILS_LOG_TO_STDOUT 1

# You must pass environment variable SECRET_KEY_BASE
ARG SECRET_KEY_BASE
ENV SECRET_KEY_BASE $SECRET_KEY_BASE

ARG DB_NAME
ENV DB_NAME $DB_NAME
ARG DB_USER
ENV DB_USER $DB_USER
ARG DB_PASSWORD
ENV DB_PASSWORD $DB_PASSWORD
ARG DB_HOST
ENV DB_HOST $DB_HOST

ARG RAILS_MAX_THREADS=8
ENV RAILS_MAX_THREADS $RAILS_MAX_THREADS

# Configure nginx
COPY ./nginx.conf /etc/nginx/nginx.conf

# Copy the main application.
COPY . ./

# Precompile Rails assets (plus Webpack)
RUN bundle exec rake assets:precompile

EXPOSE 3000

# Start puma
CMD bundle exec puma -C config/puma.rb
