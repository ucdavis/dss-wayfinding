class Department < DirectoryObject
  validates :title, uniqueness: true, presence: true
  validates :room_id, presence: false

  has_many :people
  has_many :events
  belongs_to :room

  def as_json(options={})
    {
      :room_number => room.present? ? room.room_number : '',
      :name => '',
      :department => title,
      :email => '',
      :phone => '',
      :type => type.pluralize.downcase
    }
  end
end
