authorization do
  role :guest do
    has_permission_on :directory_objects, :to => [:read, :search, :unroutable, :qr, :scan]
    has_permission_on :administration, :to => [:start, :logvisitor]
  end
  role :directoryadmin do
    includes :guest
    has_permission_on :directory_objects, :to => :manage
    has_permission_on :administration, :to => [:read, :administer_directory]
  end
  role :superadmin do
    includes :directoryadmin
    has_permission_on :rss_feeds, :to => :manage
    has_permission_on :administration, :to => [:manage, :administer]
  end
end

privileges do
  privilege :manage, :includes => [:create, :read, :update, :delete]
  privilege :read, :includes => [:index, :show]
  privilege :create, :includes => :new
  privilege :update, :includes => :edit
  privilege :delete, :includes => :destroy
  privilege :administer, :includes => [:origin, :start, :department_location, :map_upload, :csv, :search_terms, :unmatched, :unroutable, :analytics]
  privilege :administer_directory, :includes => [:directory_object, :del_directory_object]
end
