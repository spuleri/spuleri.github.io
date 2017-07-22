Rails.application.routes.draw do

  # :show and :edit will use my own custom routing sceheme
  resources :posts, except: [:show, :edit]

  # Custom year/month/day/title path scheme
  path_scheme = '/:year/:month/:day/:title'

  options = { :year => nil, :month => nil, :day => nil }

  constraints = {
    year:       /\d{4}/,
    month:      /\d{1,2}/,
    day:        /\d{1,2}/,
    title:      /[^\s\/]+/ # https://stackoverflow.com/a/6125137
  }

  # show and edit routes
  get path_scheme => 'posts#show', :constraints => constraints, :as => :show_post, :action => :show
  get "#{path_scheme}/edit" => 'posts#edit', :constraints => constraints, :as => :edit_post, :action => :edit

  # View posts by time period routes
  get '/:year/:month/:day' => 'posts#day', :constraints => {
    year:       /\d{4}/,
    month:      /\d{1,2}/,
    day:        /\d{1,2}/
  }
  get '/:year/:month' => 'posts#month', :constraints => {
    year:       /\d{4}/,
    month:      /\d{1,2}/
  }
  get '/:year' => 'posts#year', :constraints => {
    year:       /\d{4}/
  }

  # Home route
  get 'home/index'
  root 'home#index'


  # All other bad paths render 404
  get '*path', :to => 'application#page_not_found'

  # if Rails.env.production?
  get '404', :to => 'application#page_not_found'
  # end

end
