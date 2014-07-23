Rails.application.routes.draw do
  root 'directory_objects#landing'

  get 'search', to: 'directory_objects#search'
  get 'map', to: 'directory_objects#map'
  get 'admin', to: 'directory_objects#admin'
  post 'admin/origin', to: 'directory_objects#modify_origin'
  post 'admin/csv', to: 'directory_objects#import_csv'

  resources :directory_objects, :path => 'directory'
  resources :people, controller: 'directory_objects', type: 'Person'
  resources :departments, controller: 'directory_objects', type: 'Department'
  resources :events, controller: 'directory_objects', type: 'Event'
  resources :rooms, controller: 'directory_objects', type: 'Room'
end
