class DirectoryObject < ActiveRecord::Base
    scope :people, -> { where(type: 'Person') }
    scope :events, -> { where(type: 'Event') }
    scope :rooms, -> { where(type: 'Room') }
    scope :departments, -> { where(type: 'Department') }

end
