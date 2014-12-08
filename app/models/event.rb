class Event < DirectoryObject
  validates :title, uniqueness: false, presence: true
  validates :time, uniqueness: false, presence: false
  validates :link, uniqueness: false, presence: false
  validates :room_id, uniqueness: false, presence: false
  validates :rss_feed, uniqueness: false, presence: true
  validates :department, uniqueness: false, presence: false

  belongs_to :room
  belongs_to :department

  def as_json(options={})
    {
      :room_number => room.present? ? room.room_number : '',
      :name => '',
      :department => department ? department.title : '',
      :email => '',
      :phone => '',
      :type => type.pluralize.downcase
    }
  end
end
