module SessionsHelper
  # Logs in the given user.
  # About the default rails session:
  # https://www.railstutorial.org/book/_single-page#sec-a_working_log_in_method
  def log_in(user)
    session[:user_id] = user.id
  end

  # Remembers a user in a persistent session
  def remember(user)
    # Stores a new remember_digest in the db upon login
    user.remember

    # Stores two permananet (20.years.from_now.utc), cookies
    cookies.permanent.signed[:user_id] = user.id
    cookies.permanent.signed[:remember_token] = user.remember_token
  end

  # Forgets a persistent session.
  def forget(user)
    user.forget
    cookies.delete(:user_id)
    cookies.delete(:remember_token)
  end

  # Logs out the current user.
  # Remove user_id from session hash and set to nil
  # also forget from persistent session
  def log_out
    forget(current_user)
    session.delete(:user_id)
    @current_user = nil
  end

  def current_user
    if (user_id = session[:user_id])
      @current_user ||= User.find_by(id: user_id)
    elsif (user_id = cookies.signed[:user_id])
      user = User.find_by(id: user_id)
      if user && user.authenticated?(cookies[:remember_token])
        log_in user
        @current_user = user
      end
    end
  end

  # Returns true if someone is logged in, false if not
  # by checking @current_user
  def logged_in?
    !current_user.nil?
  end

  # Redirects to stored location (or to the default).
  def redirect_back_or(default)
    redirect_to(session[:forwarding_url] || default)
    session.delete(:forwarding_url)
  end

  # Stores the URL trying to be accessed.
  # Called if authorization is required for a path
  def store_location
    session[:forwarding_url] = request.original_url if request.get?
  end

end
