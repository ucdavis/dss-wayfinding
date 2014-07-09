class Room < DirectoryObject
  validates :name, uniqueness: true, presence: false
  validates :room_number, uniqueness: true, presence: true
  validates :is_bathroom, uniqueness: false, presence: false

  has_and_belongs_to_many :people
  has_many :events
end
