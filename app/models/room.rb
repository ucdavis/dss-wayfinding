class Room < DirectoryObject
  validates :name, uniqueness: false, presence: false
  validates :room_number, uniqueness: true, presence: true
  validates :is_bathroom, uniqueness: false, presence: false

  has_and_belongs_to_many :people, join_table: 'person_room_join_requirements'

  has_many :events

  def calculated_name
    return self.name if self.name.present?
    people.count > 0 ? people[0].first + ' ' + people[0].last : ''
  end

  def as_json(options={})
    {
      :id => id,
      :room_number => room_number,
      :name => self.calculated_name,
      :department => (people.count > 0) && people[0].department ? people[0].department.title : '',
      :email => people.count > 0 ? people[0].email : '',
      :phone => people.count > 0 ? people[0].phone : '',
      :type => type
    }
  end
end
