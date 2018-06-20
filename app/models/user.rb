class User < ApplicationRecord
  validates :loginid, uniqueness: true, presence: true

  def role_symbols
    if Rails.env === "development"
      # Give full rights in development mode
      [:superadmin]
    else
      # In production mode, rely on Roles Management for permissions
      @role_symbols ||= RolesManagement.fetch_role_symbols_by_loginid(loginid)
    end
  end
end
