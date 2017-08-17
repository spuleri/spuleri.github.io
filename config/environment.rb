# Load the Rails application.
require_relative 'application'

# Load the app's custom environment variables here, so that they are loaded before environments/*.rb
# As the comment above says, by doing this you will be loading your environment variables
# before environments/*.rb, which means that you will be able to refer to your variables
# inside those files (e.g. environments/production.rb)
app_environment_variables = File.join(Rails.root, 'config', 'app_environment_variables.rb')
load(app_environment_variables) if File.exists?(app_environment_variables)

# Initialize the Rails application.
Rails.application.initialize!
