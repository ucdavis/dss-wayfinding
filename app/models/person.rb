class Person < DirectoryObject
  validates :first, uniqueness: false, presence: true
  validates :last, uniqueness: false, presence: true
  validates :email, uniqueness: true, :allow_blank => true, :allow_nil => true, format: { with: /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\z/i }
  validates :phone, uniqueness: false, presence: false, format: { with: /\A[)(\d\-x+ ]*\z/ }

  has_and_belongs_to_many :rooms, join_table: 'person_room_join_requirements'
  belongs_to :department

  def as_json(options={})
    {
      :id => id,
      :room_number => rooms.present? ? rooms.first.room_number : '',
      :name => first + ' ' + last,
      :first => first,
      :last => last,
      :department => department ? department.title : '',
      :email => email,
      :phone => phone,
      :type => type,
      :room_ids => rooms.present? ? rooms.map { |room| room.id } : [],
      :department_id => department ? department.id : ''
    }
  end
end
