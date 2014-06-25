class Person < ActiveRecord::Base
  validates :first, uniqueness: false, presence: true
  validates :last, uniqueness: false, presence: true
  validates :email, uniqueness: true, presence: true
  validates :phone, uniqueness: true, presence: false
end
