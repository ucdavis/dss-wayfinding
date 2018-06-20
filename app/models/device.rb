class Device < ApplicationRecord
  belongs_to :room
  has_many :visitors
end
