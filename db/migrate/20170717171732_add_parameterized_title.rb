class AddParameterizedTitle < ActiveRecord::Migration[5.1]
  def change
    add_column :posts, :parameterized_title, :string
  end
end
