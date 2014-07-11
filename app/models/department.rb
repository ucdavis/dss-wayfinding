class Department < DirectoryObject
  validates :title, uniqueness: true, presence: true

  has_many :people
  has_many :events
end
