module SessionsHelper
	# Logs in the given user.
	# About the default rails session:
	# https://www.railstutorial.org/book/_single-page#sec-a_working_log_in_method
	def log_in(user)
		session[:user_id] = user.id
	end

	# Logs out the current user.
	# Remove user_id from session hash and set to nil
	def log_out
		session.delete(:user_id)
		@current_user = nil
	end

	def current_user
		# make an instance variable for current user
		# assign it using ||= i.e. assign to itself OR
		# result of query if itself is nil
		@current_user ||= User.find_by(id: session[:user_id])
		# If current_user is nil, means the session has no one signed in
		# since the query couldn't find anyone
	end

	# Returns true if someone is logged in, false if not
	# by checking @current_user
	def logged_in?
		!current_user.nil?
	end
end
