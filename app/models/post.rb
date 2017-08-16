class Post < ApplicationRecord
  # TODO: Look into these validations
  validates :title, presence: true,
                   length: { minimum: 5 }

  validates :parameterized_title, presence: true,
                                  uniqueness: { case_sensitive: false }


  before_validation :update_parameterized_title

  # Don't override `to_param`, that is necessary for resource defined routes
  # to work properly
  def to_param_custom
    year = created_at.year
    month = created_at.month
    day = created_at.day
    title = parameterized_title

    { :year => year, :month => month, :day => day, :title => title }
  end

 private

  # Updates the parameterized_title before saving to database
   def update_parameterized_title
     self.parameterized_title = self.title.parameterize
   end


end
