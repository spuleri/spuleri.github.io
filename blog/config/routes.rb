Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  resources :posts
  get 'home/index'

  # Making this the root of our application
  root 'home#index'
end
