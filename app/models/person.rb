class Person < DirectoryObject
  validates :first, uniqueness: false, presence: true
  validates :last, uniqueness: false, presence: true
  validates :email, uniqueness: true, :allow_blank => true, :allow_nil => true, format: { with: /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\z/i }
  #validates :phone, uniqueness: false, presence: false, format: { with: /\A[)(\d\-x+ ]*\z/ }
  validate :phone_must_be_valid

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
      :department_id => department ? department.id : '',
      :room_id => rooms.first ? rooms.first.id : nil
    }
  end

  private

  # Tests whether or not a phone number is a valid five-, seven-, or
  # ten-digit phone number. Compares given number to a version that strips
  # everything but valid non-numeric characters. Blank or nil values are
  # considered valid.
  def phone_must_be_valid
    return if phone.blank?

    phone.strip!
    trimmed = phone.gsub(/[^\dx]/, "").gsub(/x\d*/, "")

    unless [5, 7, 10, 11].include?(trimmed.length)
      errors.add(:phone, "incorrect length")
    end

    return if phone.gsub(/[^\d\+x)( \-]/, "") == phone

    errors.add(:phone, "unknown issue")
  end
end
