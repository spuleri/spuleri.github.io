class SessionsController < ApplicationController
  def new
  end

  def create
    # Find the current user and then attempt to authenticate them
    user = User.find_by(email: params[:session][:email].downcase)

	# Log the user in and redirect to the user's show page.
	# uses the authenticate method on ActiveModel::SecurePassword
	if user && user.authenticate(params[:session][:password])
		# Creates the temp rails session
		flash.now[:success] = 'Successfully signed in'
		log_in user
		params[:session][:remember_me] == '1' ? remember(user) : forget(user)
		redirect_to root_url
	else
		flash.now[:danger] = 'Invalid email/password combination' # Not quite right!
        render 'new'
    end
  end

  def destroy
	log_out if logged_in?
	redirect_to root_url
  end

end
