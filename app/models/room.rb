class Room < DirectoryObject
  validates :name, uniqueness: false, presence: false
  validates :room_number, uniqueness: true, presence: true
  validates :is_bathroom, uniqueness: false, presence: false

  has_and_belongs_to_many :people, join_table: 'person_room_join_requirements'

  has_many :events

  def as_json(options={})
    {
      :room_number => room_number,
      :name => people.count > 0 ? people[0].first + ' ' + people[0].last : '',
      :department => (people.count > 0) && people[0].department ? people[0].department.title : '',
      :email => people.count > 0 ? people[0].email : '',
      :phone => people.count > 0 ? people[0].phone : ''
    }
  end
end
