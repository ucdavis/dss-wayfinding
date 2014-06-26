class Department < DirectoryObject
  validates :title, uniqueness: true, presence: true
end
