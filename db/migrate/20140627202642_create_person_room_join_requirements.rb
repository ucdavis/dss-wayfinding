class CreatePersonRoomJoinRequirements < ActiveRecord::Migration
  def change
    create_table :person_room_join_requirements do |t|
      t.belongs_to :person
      t.belongs_to :room
    end
  end
end
