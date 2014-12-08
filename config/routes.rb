Rails.application.routes.draw do
  root 'site#landing'

  get 'search', to: 'directory_objects#search'
  post 'search', to: 'directory_objects#search'
  get 'map', to: 'directory_objects#show'
  get 'about', to: 'site#about'
  get 'room/:number', to: 'directory_objects#show'
  get "/logout" => 'application#logout'

  get 'start/:location', to: redirect('/administration/start?location=%{location}')

  get '/access_denied' => 'site#access_denied'

  # General
  resources :directory_objects, :path => 'directory'
  resources :people, controller: 'directory_objects', type: 'Person'
  resources :departments, controller: 'directory_objects', type: 'Department'
  resources :events, controller: 'directory_objects', type: 'Event'
  resources :rooms, controller: 'directory_objects', type: 'Room'

  # Administration
  resources :administration do
    collection do
      post 'origin'
      post 'csv'
      post 'map_upload'
      post 'department_location'
      post 'directory_object'
      put 'directory_object'
      get 'start'

      resources :rss_feeds
    end
  end
end
