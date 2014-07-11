class Event < DirectoryObject
  validates :title, uniqueness: false, presence: true
  validates :time, uniqueness: false, presence: false
  validates :link, uniqueness: false, presence: false
  validates :room_id, uniqueness: false, presence: false
  validates :rss_feed, uniqueness: false, presence: true
  validates :department, uniqueness: false, presence: true
  
  belongs_to :room
  belongs_to :department
end
