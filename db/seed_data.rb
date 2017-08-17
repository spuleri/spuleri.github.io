module SeedData
  POST_BODY = %Q(
  ## This is a markdown post
  We can do all kinds of formatting and cool shit.

  Look, here is some ruby code

  ```ruby
  puts "hello world!"
  ```

  ## Lists
  Here is a list

  - item 1
  - item 2
  - item 3
  - wow

  ### Third level header, this should be an h3

  ```python
  print "hello world in python"
  ```

  ## Lorem Ipsum Junk
  Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sed porta arcu. Phasellus erat lectus, scelerisque ut erat eu, volutpat interdum turpis. Fusce dignissim dui non aliquet ullamcorper. Duis et elit eget purus venenatis eleifend. Proin luctus eget neque eget egestas. Maecenas eget turpis ipsum. Nullam vitae quam semper, iaculis eros sed, dictum turpis. Etiam commodo metus at viverra venenatis. Vivamus venenatis sodales nisi vel fermentum. Vivamus malesuada sapien sed tincidunt volutpat.

  Fusce nec eros justo. Aliquam urna ligula, malesuada ut sodales maximus, dapibus non ligula. Integer porta mattis sapien id bibendum. Praesent massa urna, porttitor quis tellus vitae, hendrerit bibendum augue. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Praesent dignissim vel dui ac lacinia. Vivamus non metus tortor. Fusce pellentesque sed felis et placerat. Cras elementum eget metus sit amet pharetra. Aenean commodo est eget velit aliquam, a luctus neque tincidunt. Quisque tempus elit sed ante pretium molestie. Maecenas ultrices augue ex, eu consectetur arcu luctus id.
  )

  POST_BODY2 = File.read("#{Rails.root}/db/seed_post_data.txt")

end
