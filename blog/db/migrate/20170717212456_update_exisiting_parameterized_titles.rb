class UpdateExisitingParameterizedTitles < ActiveRecord::Migration[5.1]
  def self.up
    say_with_time "Updating Posts..." do
      Post.all.each do |p|
        p.update_attribute :parameterized_title, p.title.parameterize
      end
    end
  end
end
