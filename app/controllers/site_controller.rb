class SiteController < ApplicationController
  skip_before_action :authenticate, only: :access_denied
  #skip_before_action :require_login, only: :access_denied

  # Main landing page
  def landing
  end

  # About SSH building
  def about
  end

  # Basic access denied page
  def access_denied
  end

  # Used to ping if wayfinder is online
  def status
  end
end
