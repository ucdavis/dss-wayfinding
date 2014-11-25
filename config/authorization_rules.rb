authorization do
  role :guest do
    has_permission_on :directory_objects, :to => :read
  end
  role :directoryadmin do
    includes :guest
    has_permission_on :directory_objects, :to => :manage
  end
  role :superadmin do
    includes :directoryadmin
    has_permission_on :rss_feeds, :to => :manage
    has_permission_on :administration, :to => :manage
  end
end

privileges do
  privilege :manage, :includes => [:create, :read, :update, :delete]
  privilege :read, :includes => [:index, :show]
  privilege :create, :includes => :new
  privilege :update, :includes => :edit
  privilege :delete, :includes => :destroy
end