class PostsController < ApplicationController

  # Called on only these methods before
  before_action :find_post_by_custom_params, only: [:show, :edit]
  before_action :find_post_by_id, only: [:update, :destroy]

  def index
    @posts = Post.all.order("created_at desc").paginate(page: params[:page], per_page: 5)
  end

  def new
    @post = Post.new
  end

  def create
    @post = Post.new(post_params)
    if @post.save
      redirect_to show_post_path(@post.to_param_custom), notice: "Post successfully saved."
    else
      render 'new', notice: "Unable to save your post"
    end
  end

  def show
  end

  def edit
  end

  def update
    if @post.update post_params
      redirect_to show_post_path(@post.to_param_custom), notice: "Post successfully saved."
    else
      render 'edit'
    end
  end

  def destroy
    @post.destroy
    redirect_to posts_path
  end

  ## Controller actions for posts by day, month, and year

  def day
    # Get specific day from params
    year = params[:year]
    month = params[:month]
    day = params[:day]
    @time = "#{year}/#{month}/#{day}".to_time.strftime('%A, %B %d %Y')

    # Find the posts created on this day
    dt = DateTime.parse("#{year}-#{month}-#{day}")
    start = dt.beginning_of_day
    finish = dt.end_of_day

    # Query and order
    @day_posts = Post
    .where("created_at >= ? and created_at <= ?", start, finish)
    .order("created_at desc")
  end

  def month
    # Get months from params
    year = params[:year]
    month = params[:month]
    @time = "#{year}/#{month}".to_time.strftime('%B %Y')

    # Find the posts in this time range
    dt = DateTime.parse("#{year}-#{month}-1")
    start = dt.beginning_of_month
    finish = dt.end_of_month

    # Query and order
    month_posts = Post
    .where("created_at >= ? and created_at <= ?", start, finish)
    .order("created_at desc")

    # Group by day in this month
    # — creates a hash of day time objects to arrays of posts
    @posts_by_day = month_posts.group_by { |post| post.created_at.beginning_of_day }
  end

  def year
    # Get year from params
    year = params[:year]
    @time = year

    # Find the posts in this time range
    dt = DateTime.new(year.to_i)
    start = dt.beginning_of_year
    finish = dt.end_of_year

    # Query and order
    year_posts = Post
      .where("created_at >= ? and created_at <= ?", start, finish)
      .order("created_at desc")

    # Group by month in this year
    # — creates a hash of month time objects to arrays of posts
    @posts_by_month = year_posts.group_by { |post| post.created_at.beginning_of_month }
  end

  private

  def post_params
    params.require(:post).permit(:title, :content)
  end

  def find_post_by_id
    @post = Post.find_by_id(params[:id])

    render file: "#{Rails.root}/public/404", layout: true, status: :not_found if @post.blank?
  end

  def find_post_by_custom_params
    # TODO: Make this better
    # Finds post by parameterized_title, if ever have 2 posts with same title, there will be issues.
    @post = Post.find_by(parameterized_title: params[:title])

    render file: "#{Rails.root}/public/404", layout: true, status: :not_found if @post.blank?
  end

end
