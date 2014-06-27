Rails.application.routes.draw do
  root 'directory_objects#index'

  resources :directory_objects, :path => 'directory'
end
