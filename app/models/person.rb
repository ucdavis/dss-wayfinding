class Person < DirectoryObject
  validates :first, uniqueness: false, presence: true
  validates :last, uniqueness: false, presence: true
  validates :email, uniqueness: true, presence: true
  validates :phone, uniqueness: false, presence: false

  has_and_belongs_to_many :rooms, join_table: 'person_room_join_requirements'
  belongs_to :department
end
