class Room < ActiveRecord::Base
  validates :name, uniqueness: true, presence: false
  validates :room_number, uniqueness: true, presence: true
  validates :is_bathroom, uniqueness: false, presence: false
end
