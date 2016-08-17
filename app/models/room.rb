class Room < DirectoryObject
  validates :name, uniqueness: false, presence: false
  validates :room_number, uniqueness: true, presence: true
  validates :is_bathroom, uniqueness: false, presence: false

  has_and_belongs_to_many :people, join_table: 'person_room_join_requirements'

  has_many :events
  has_many :devices

  def calculated_name
    return self.name if self.name.present?
    people.size > 0 ? people[0].first + ' ' + people[0].last : ''
  end

  def as_json(options={})
    {
      :id => id,
      :room_number => room_number,
      :type => type,
      :people =>

      people.map do |person|
        {
          :name => self.calculated_name,
          :department => person.department ? person.department.title : '',
          :email => person.email,
          :phone => person.phone
        }
      end
    }
  end
end
