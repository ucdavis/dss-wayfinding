Rails.application.routes.draw do
  root 'directory_objects#landing'

  resources :directory_objects, :path => 'directory'
  
  resources :people, controller: 'directory_objects', type: 'Person'
  resources :departments, controller: 'directory_objects', type: 'Department'
  resources :events, controller: 'directory_objects', type: 'Event'
  resources :rooms, controller: 'directory_objects', type: 'Room'
end
