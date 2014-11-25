class SiteController < ApplicationController
  skip_before_filter :authenticate, :only => :access_denied
  skip_before_filter :require_login, :only => :access_denied
  
  def access_denied
  end

end