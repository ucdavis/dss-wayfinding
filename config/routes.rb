Rails.application.routes.draw do
  root 'directory_objects#landing'

  get 'search', to: 'directory_objects#search'
  get 'map', to: 'directory_objects#map'
  get 'about', to: 'directory_objects#about'

  # General
  resources :directory_objects, :path => 'directory'
  resources :people, controller: 'directory_objects', type: 'Person'
  resources :departments, controller: 'directory_objects', type: 'Department'
  resources :events, controller: 'directory_objects', type: 'Event'
  resources :rooms, controller: 'directory_objects', type: 'Room'

  # Administration
  resources :administration do
    collection do
      post 'origin' #, to: 'directory_objects#modify_origin'
      post 'csv' #, to: 'directory_objects#import_csv'
      post 'department_location'
    end
  end
end
