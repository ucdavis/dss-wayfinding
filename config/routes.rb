Rails.application.routes.draw do
  root 'site#landing'

  get 'search', to: 'directory_objects#search'
  post 'search', to: 'directory_objects#search'
  get 'unroutable', to: 'directory_objects#unroutable'
  post 'unroutable', to: 'directory_objects#unroutable'
  get 'map', to: 'directory_objects#show'
  get 'about', to: 'site#about'
  get 'room/:number', to: 'directory_objects#show'
  get "/logout" => 'application#logout'

  get 'start/:location', to: redirect('/administration/start?location=%{location}')
  get 'start/:start_loc/end/:end_loc', to: 'directory_objects#show'
  get 'start/:start_loc/directory/:id', to: 'directory_objects#show'
  post 'logvisitor', to: 'administration#logvisitor'

  get '/access_denied' => 'site#access_denied'

  # QR prototype
  get '/directory_objects/qr/:originID', to: 'directory_objects#qr'
  get '/directory_objects/qr/:originID/end/:destinationID', to: 'directory_objects#qr'
  get '/administration/start/:origin', to: 'administration#start'
  get 'directory_objects/generateQR/', to: 'directory_objects#generateQR'
  get 'directory_objects/personPlacard/:id', to: 'directory_objects#personPlacard'
  

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
      get 'start'
      get 'unmatched'
      get 'unroutable'
      get 'search_terms'
      get 'analytics'

      resources :rss_feeds
    end
  end
end
