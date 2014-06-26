class Event < DirectoryObject
  validates :title, uniqueness: false, presence: true
  validates :time, uniqueness: false, presence: true
  validates :link, uniqueness: false, presence: true
end
