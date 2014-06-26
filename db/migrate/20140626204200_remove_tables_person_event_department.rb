class RemoveTablesPersonEventDepartment < ActiveRecord::Migration
  def change
    drop_table :people
    drop_table :events
    drop_table :departments
  end
end
