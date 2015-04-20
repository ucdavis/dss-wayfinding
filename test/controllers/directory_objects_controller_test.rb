require 'test_helper'

class DirectoryObjectsControllerTest < ActionController::TestCase
  # test "the truth" do
  #   assert true
  # end
  
  test "guests cannot edit directory objects" do
   patch :update, {
     :format => 'json',
     :id => 1,
     :type => 'person', :first => 'A', :last => 'Person'
   }
   
   # Unauthorized
   assert_response 401
  end

  test "guests cannot delete directory objects" do
   delete :destroy, { :format => 'json', :id => 1 }
   assert_response 401
  end

  test "guests cannot add directory objects" do
    post :create, {
      :format => 'json',
      :id => 1,
      :type => 'Person',
      :first => 'A',
      :last => 'Person'
    }

    assert_response 401
  end

  test "guests can read directory objects" do
    # For id, refer directory_objects.yml and
    # http://stackoverflow.com/questions/763881/automatic-associations-in-ruby-on-rails-fixtures
    get :show, { :format => 'json', :type => 'Person', :id => 298486374 }
    assert_response :success
  end

  test "guests can see rooms" do
    get :show, { :format => 'json', :type => 'Room', :number => 110 }
    assert_response :success
  end

  test "guests can search" do
    get :search, { :format => 'json', :q => 'abc' }

    assert_response :success
  end

  test "admins can edit directory objects" do
    directoryadminify

    patch :update, {
      :type => 'Person',
      :format => 'json',
      :id => 298486374,
      :first => 'A', :last => 'Person', :department_id => '', :room_ids => []
    }, { :auth_via => 'cas', :user_id => 980190962, :cas_user => 'casuser' }

    assert_response :success
  end

  test "admins can delete directory objects" do
    directoryadminify

    delete :destroy, { :type => 'Person', :format => 'json', :id => 298486374 },
        { :auth_via => 'cas', :user_id => 980190962, :cas_user => 'casuser' }

    assert_response 302
  end

  test "admins can add directory objects" do
    directoryadminify

    post :create, { :type => 'Person',
      :format => 'json',
      :id => 298486374,
      :first => 'A', :last => 'Person', :department_id => '', :room_ids => []
    }, { :auth_via => 'cas', :user_id => 980190962, :cas_user => 'casuser' }

    assert_response :success
  end

  test "admins can read directory objects" do
    directoryadminify

    get :show, { :format => 'json', :type => 'Person', :id => 298486374 }
    assert_response :success
  end

end
