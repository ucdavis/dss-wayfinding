class ApplicationController < ActionController::Base
  include Authentication
  before_action :track_devices

  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  def logout
    CASClient::Frameworks::Rails::Filter.logout(self)
  end

  def permission_denied
    if request.format.to_s.include? 'json'
      # JSON request
      render :json => "Permission denied.", :status => 403
    elsif session[:auth_via] == 'cas'
      # Non-JSON, human-facing error
      flash[:error] = "Sorry, you are not allowed to access that page."
      redirect_to access_denied_path
    else
      # Non-JSON, machine-facing error
      render :text => "Permission denied.", :status => 403
    end
  end

  private

  # 
  # track_devices
  #
  #   Helps track active sessions/devices based on IP address, whether or not
  #   the device is being used in kiosk mode, and the origin/start location.
  #   Does so by updating the updated_at column for existing devices whenever a
  #   request is received and by creating new records for new devices.
  #
  #   Potential issues: New devices might not have room numbers, so two records
  #   might be created for a new device: One without a start location and one
  #   with.
  #

  def track_devices
    # The device's location, as reported by its permanent cookies
    location = cookies["origin"] || cookies["start_location"] || ''
    location = location[1..-1]  if !location[0].blank? && location[0].upcase == "R"

    data = {
      :ip => (IPAddr.new request.remote_ip).to_s,
      :kiosk => !!cookies["origin"], # Kiosks have origin cookies
      :room => Room.find_by_room_number(location)
    }

    @device = Device.where(data).first
    (@device.touch  if @device) or @device = Device.new(data)

    @device.save

    # Possibilities for current device's visitor state:
    # 1. The kiosk is waiting for a new visitor. Neither start nor end are set.
    # See #3.
    # 2. The kiosk is currently being used by a visitor. Start is set, but not
    # end. Don't need to do anything.
    # 3. The kiosk just finished being used by a visitor. End is set (start is,
    # too). Create a new visitor. Start will be set when someone clicks on
    # something (i.e., there was no request for logvisitor recently)

    @visitor = Visitor.where(:device_id => @device.id).order(updated_at: :desc).first
    if @visitor.nil? || ! @visitor.end.blank?
      @visitor = Visitor.new(:device_id => @device.id)
    elsif @visitor.start.blank?
      @visitor.start = DateTime.current
    end
    @visitor.save
  end

  def require_login
    unless logged_in?
      flash[:error] = "You must be logged in to access this section"
    end
  end

  # The logged_in? method simply returns true if the user is logged
  # in and false otherwise. It does this by "booleanizing" the
  # current_user method we created previously using a double ! operator.
  # Note that this is not common in Ruby and is discouraged unless you
  # really mean to convert something into true or false.
  def logged_in?
    !!current_user
  end
end
