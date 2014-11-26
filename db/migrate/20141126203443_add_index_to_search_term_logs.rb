class AddIndexToSearchTermLogs < ActiveRecord::Migration
  def change
    add_index :search_term_logs, :term
  end
end
