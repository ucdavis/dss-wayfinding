Rails.application.routes.draw do
  root 'directory_objects#landing'

  resources :directory_objects, :path => 'directory'
end
