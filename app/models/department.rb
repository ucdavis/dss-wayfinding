class Department < DirectoryObject
  validates :title, uniqueness: true, presence: true
  validates :room_id, presence: false
  
  has_many :people
  has_many :events
  belongs_to :room
end
