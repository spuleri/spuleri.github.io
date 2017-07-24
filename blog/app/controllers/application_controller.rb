class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  include SessionsHelper

  def page_not_found
    respond_to do |format|
      format.html { render file: "#{Rails.root}/public/404", layout: true, status: :not_found }
      format.all  { render nothing: true, status: 404 }
    end
  end
end
