class User < ApplicationRecord
  # Attribtues
  attr_accessor :remember_token

  # Configurations
  before_save { self.email = email.downcase }
  validates :name,  presence: true, length: { maximum: 50 }

  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i
  validates :email, presence: true, length: { maximum: 255 },
    format: { with: VALID_EMAIL_REGEX },
    uniqueness: { case_sensitive: false }

  has_secure_password
  validates :password, presence: true, length: { minimum: 6 }


  # Remembers a user in the database for persistent sessions
  # updates the remember_digest column, with the hashed random token
  def remember
    self.remember_token = User.new_token
    update_attribute(:remember_digest, User.digest(remember_token))
  end

  # Forgets a user.
  # by setting the digest in the db as nil
  def forget
    update_attribute(:remember_digest, nil)
  end

  # Returns true if the given token matches the digest stored in the db
  def authenticated?(remember_token)
    return false if remember_digest.nil?
    BCrypt::Password.new(remember_digest).is_password?(remember_token)
  end

  # Class methods

  # Returns the hash digest of the given string.
  def User.digest(string)
    cost = ActiveModel::SecurePassword.min_cost ? BCrypt::Engine::MIN_COST :
      BCrypt::Engine.cost
    BCrypt::Password.create(string, cost: cost)
  end

  # Returns a random token. A random base64, len 22 string
  def User.new_token
    SecureRandom.urlsafe_base64
  end

end
