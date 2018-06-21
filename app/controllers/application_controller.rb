class ApplicationController < ActionController::Base
  include Authentication
  before_action :authenticate

  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  def logout
    CASClient::Frameworks::Rails::Filter.logout(self)
  end

  private

  def require_login
    unless logged_in?
      flash[:error] = "You must be logged in to access this section"
      redirect_to root_url
    end
  end

  # The logged_in? method simply returns true if the user is logged
  # in and false otherwise. It does this by "booleanizing" the
  # current_user method we created previously using a double ! operator.
  # Note that this is not common in Ruby and is discouraged unless you
  # really mean to convert something into true or false.
  def logged_in?
    Authentication.current_user.present?
  end

  # Ensure an authenticated user has the proper role(s)
  def require_role
    unless logged_in? && (Authentication.current_user.role_symbols & [:superadmin, :directoryadmin]).present?
      flash[:error] = "You must be logged in and have the proper authorizations to access this section"
      redirect_to root_url
    end
  end
end
