ENV['RAILS_ENV'] ||= 'test'
require File.expand_path('../../config/environment', __FILE__)
require 'rails/test_help'
require 'declarative_authorization/maintenance'

class ActiveSupport::TestCase
  include Authorization::TestHelper

  # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
  #
  # Note: You'll currently still have to declare fixtures explicitly in integration tests
  # -- they do not yet inherit this setting
  fixtures :all

  # Add more helper methods to be used by all tests here...

  # Monkey patches the User model module to return [ :superadmin ] when asked
  # for users' roles. Effect is limited to just a test..do..end block. Also
  # have to make sure to set appropriate session variables for authentication
  # (auth_via = 'cas' and user_id = a user id).
  #
  # Arguments: (none)
  #
  # Returns: (none)
  def superadminify
    without_access_control do
      User.module_eval do
        def role_symbols
          @role_symbols = [ :superadmin ]
        end
      end

      request.session[:auth_via] = 'cas'
      request.session[:user_id] = users(:one)
    end
  end


  # Same as superadminify, but modifies the User model for the directoryadmin
  # role. Takes no arguments and returns nothing.
  def directoryadminify
    without_access_control do
      User.module_eval do
        def role_symbols
          @role_symbols = [ :directoryadmin ]
        end
      end

      request.session[:auth_via] = 'cas'
      request.session[:user_id] = users(:one)
    end
  end
end
