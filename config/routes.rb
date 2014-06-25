Rails.application.routes.draw do
  get 'room/index'

  get 'room/show'

  get 'people/index'

  get 'people/show'

  get 'department/index'

  get 'department/show'

  get 'map/index'

  get 'site/landing'
  get 'site/about'

  root 'site#landing'
end
