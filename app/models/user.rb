class User < ActiveRecord::Base
  using_access_control

  validates :loginid, uniqueness: true, presence: true
  validates :rm_id, uniqueness: true, presence: true

  def role_symbols
    @role_symbols ||= RolesManagement.fetch_role_symbols_by_loginid(loginid)
  end

end
