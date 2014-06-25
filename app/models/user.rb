class User < ActiveRecord::Base
  validates :loginid, uniqueness: true, presence: true
end
