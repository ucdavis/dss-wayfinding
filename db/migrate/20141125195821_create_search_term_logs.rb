class CreateSearchTermLogs < ActiveRecord::Migration
  def change
    create_table :search_term_logs do |t|
      t.string :term
      t.integer :count

      t.timestamps
    end
  end
end
