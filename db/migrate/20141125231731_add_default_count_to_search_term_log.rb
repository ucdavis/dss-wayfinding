class AddDefaultCountToSearchTermLog < ActiveRecord::Migration
  def change
    change_column :search_term_logs, :count, :integer, default: 0
  end
end
