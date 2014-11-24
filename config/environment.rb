# Load the Rails application.
require File.expand_path('../application', __FILE__)

require "delayed_rake"

# Initialize the Rails application.
Rails.application.initialize!

# Configure the CAS server
CASClient::Frameworks::Rails::Filter.configure(
  :cas_base_url => "https://cas.ucdavis.edu/cas/"
)
