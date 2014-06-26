class AddTypeToEventsAndPeopleAndDepartments < ActiveRecord::Migration
  def change
    add_column :people, :type, :string
    add_column :events, :type, :string
    add_column :departments, :type, :string
  end
end
