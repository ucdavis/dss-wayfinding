module Authentication
  # Returns the current_user, which may be 'false' if impersonation is active
  def current_user
    if impersonating?
      return Authorization.current_user
    else
      return Authorization.current_user
    end
  end

  # Returns the 'actual' user - usually this matches current_user but when
  # impersonating, it will return the human doing the impersonating, not the
  # account they are pretending to be. Useful for determining if actions like
  # 'un-impersonate' should be made available.
  def actual_user
    User.find_by_id(session[:user_id])
  end

  def authenticate
    if session[:user_id]
      logger.debug "Auth is via CAS"
      if impersonating?
        logger.debug "User is impersonating"
        Authorization.current_user = User.find_by_id(session[:impersonation_id])
      else
        logger.debug "User set to CAS user #{session[:user_id]}"
        Authorization.current_user = User.find_by_id(session[:user_id])
      end

      logger.info "User authentication passed due to existing session: #{session[:user_id]}, #{Authorization.current_user}"
      return
    end

    # It's important we do this before checking session[:cas_user] as it
    # sets that variable. Note that the way before_filters work, this call
    # will render or redirect but this function will still finish before
    # the redirect is actually made.
    CASClient::Frameworks::Rails::Filter.filter(self)

    if session[:cas_user]
      if Rails.env === "development"
        # If we're in development, avoid using Roles Management
        Authorization.ignore_access_control(true)

        @user = User.find_or_create_by(loginid: session[:cas_user])

        # Valid user found through CAS.
        session[:user_id] = @user.id
        Authorization.current_user = @user

        @user.save!

        Authorization.ignore_access_control(false)

        logger.info "Valid CAS user. Passes authentication due to development mode."
      else
        # If we're in production, the user must exist in RM
        if RolesManagement.user_exists?(session[:cas_user])
          Authorization.ignore_access_control(true)

          @user = User.find_or_create_by(loginid: session[:cas_user])

          # Valid user found through CAS.
          session[:user_id] = @user.id
          Authorization.current_user = @user

          @user.save!

          Authorization.ignore_access_control(false)

          logger.info "Valid CAS user. Passes authentication."
        end
      end
    end
  end

  # Returns true if we're currently impersonating another user
  def impersonating?
    session[:impersonation_id] ? true : false
  end
end
