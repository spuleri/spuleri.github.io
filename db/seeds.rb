# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)


require "#{Rails.root}/db/seed_data.rb"

posts = Post.create([
  {
    title: 'Intro to Programming with Python',
    content: SeedData::POST_BODY
  },
  {
    title: 'Intro to Programming with Ruby',
    content: SeedData::POST_BODY
  },
  {
    title: 'Intro to Programming with Java',
    content: SeedData::POST_BODY
  },
  {
    title: 'Technical Interviewing Tips',
    content: SeedData::POST_BODY
  },
  {
    title: '5 College CS projects you don\'t wanna miss!',
    content: SeedData::POST_BODY
  },
  {
    title: 'RxSwift Primer: Part 5',
    content: SeedData::POST_BODY2
  },
  {
    title: 'Swift 3 Enums',
    content: SeedData::POST_BODY
  }
])

# Randomize the created at dates to some time 300 days in the past
Post.all.each do |p|
  p.update_attribute :created_at, (rand*300).days.ago
end
