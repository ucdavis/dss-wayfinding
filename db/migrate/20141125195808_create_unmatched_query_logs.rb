class CreateUnmatchedQueryLogs < ActiveRecord::Migration
  def change
    create_table :unmatched_query_logs do |t|
      t.string :query

      t.timestamps
    end
  end
end
