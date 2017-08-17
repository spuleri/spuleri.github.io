class AddIndexToPosts < ActiveRecord::Migration[5.1]
  def change
    add_index :posts, :parameterized_title, unique: true
  end
end
