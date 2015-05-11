require 'test_helper'

class DirectoryObjectsControllerTest < ActionController::TestCase
  test "guests cannot edit directory objects" do
   patch :update, {
     :format => 'json',
     :id => 1,
     :type => 'person', :first => 'A', :last => 'Person'
   }

   assert_response :unauthorized
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

    assert_response :unauthorized
  end

  test "guests can read directory objects" do
    # For id, refer directory_objects.yml and
    # http://stackoverflow.com/questions/763881/automatic-associations-in-ruby-on-rails-fixtures
    get :show, { :format => 'json', :type => 'Person', :id => 4 }
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

    assert_not_nil DirectoryObject.find_by_id(4)

    patch :update, {
      :type => 'Person',
      :format => 'json',
      :id => 4,
      :first => 'A', :last => 'Person', :room_ids => []
    }

    assert_response :success
  end

  test "admins can delete directory objects" do
    directoryadminify

    delete :destroy, { :type => 'Person', :format => 'json', :id => 4 }

    assert_response 302
  end

  test "admins can add directory objects" do
    directoryadminify

    post :create, { :type => 'Person',
      :format => 'json',
      :first => 'A', :last => 'Person', :room_ids => []
    }

    assert_response :success
  end

  test "admins can read directory objects" do
    directoryadminify

    get :show, { :format => 'json', :type => 'Person', :id => 4 }
    assert_response :success
  end
end
