class DirectoryObject < ActiveRecord::Base
  scope :people, -> { where(type: 'Person') }
  scope :events, -> { where(type: 'Event') }
  scope :rooms, -> { where(type: 'Room') }
  scope :departments, -> { where(type: 'Department') }
  TYPES = %w( Person Event Department Room )
  validates :type, presence: true, :inclusion => { :in => TYPES }

end
