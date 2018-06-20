# Load the Rails application.
require_relative 'application'

# Initialize the Rails application.
Rails.application.initialize!

# Configure the CAS server
CASClient::Frameworks::Rails::Filter.configure(
  cas_base_url: ENV['CAS_URL']
)
