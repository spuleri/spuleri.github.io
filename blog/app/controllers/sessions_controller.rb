class SessionsController < ApplicationController
  def new
  end

  def create
    # Find the current user and then attempt to authenticate them
    user = User.find_by(email: params[:session][:email].downcase)
	if user && user.authenticate(params[:session][:password])
		# Log the user in and redirect to the user's show page.
		# Creates the temp rails session
		flash.now[:success] = 'Successfully signed in'
		log_in user
		redirect_to root_url
	else
		flash.now[:danger] = 'Invalid email/password combination' # Not quite right!
        render 'new'
    end
  end

  def destroy
	log_out
	redirect_to root_url
  end

end
