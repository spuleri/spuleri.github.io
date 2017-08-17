# Basic config
server '67.207.87.58', roles: [:web, :app, :db], primary: true

set :repo_url,        'git@github.com:spuleri/spuleri.github.io.git'
set :application,     'sergiopuleri.com'
set :user,            'blog'
set :puma_threads,    [4, 16]
set :puma_workers,    0

# Don't change these unless you know what you're doing
set :pty,             true
set :use_sudo,        false
set :stage,           :production
set :deploy_via,      :remote_cache
set :deploy_to,       "/var/www/#{fetch(:application)}"
set :puma_bind,       "unix://#{shared_path}/tmp/sockets/#{fetch(:application)}-puma.sock"
set :puma_state,      "#{shared_path}/tmp/pids/puma.state"
set :puma_pid,        "#{shared_path}/tmp/pids/puma.pid"
set :puma_access_log, "#{release_path}/log/puma.error.log"
set :puma_error_log,  "#{release_path}/log/puma.access.log"
#`set :ssh_options,     { forward_agent: true, user: fetch(:user), keys: %w(~/.ssh/id_rsa.pub) }
set :puma_preload_app, true
set :puma_worker_timeout, nil
set :puma_init_active_record, true  # Change to true if using ActiveRecord

## Defaults:
# set :scm,           :git
# set :branch,        :master
# TODO: DELETE/COMMENT OUT BELOW LINE. ONLY FOR TESTING.
set :branch,        :develop
# set :format,        :pretty
# set :log_level,     :debug
set :keep_releases, 7

## Linked Files & Directories:
# These survive re-deploys and are symlinked into the application
append :linked_files, "config/database.yml", "config/secrets.yml", "config/app_environment_variables.rb"
append :linked_dirs, "log", "tmp/pids", "tmp/cache", "tmp/sockets", "vendor/bundle", "public/system"


namespace :puma do
  desc 'Create Directories for Puma Pids and Socket'
  task :make_dirs do
    on roles(:app) do
      execute "mkdir #{shared_path}/tmp/sockets -p"
      execute "mkdir #{shared_path}/tmp/pids -p"
    end
  end

  before :start, :make_dirs
end

namespace :deploy do
  desc "Make sure local git is in sync with remote."
  task :check_revision do
    on roles(:app) do
      unless `git rev-parse HEAD` == `git rev-parse origin/master`
        puts "WARNING: HEAD is not the same as origin/master"
        puts "Run `git push` to sync changes."
        exit
      end
    end
  end

  desc 'Initial Deploy'
  task :initial do
    on roles(:app) do
      before 'deploy:restart', 'puma:start'
      invoke 'deploy'
    end
  end

  desc 'Restart application'
  task :restart do
    on roles(:app), in: :sequence, wait: 5 do
      invoke 'puma:restart'
    end
  end

 desc "Copy shared files to server"
 task :copy_shared_files do
    on roles(:app) do |host|
       fetch(:linked_files).each do |f|
          upload! f , "#{shared_path}/" + f
       end
    end
 end

  before :starting,     :check_revision
  after  :starting,      :copy_shared_files
  after  :finishing,    :compile_assets
  after  :finishing,    :cleanup
end

# ps aux | grep puma    # Get puma pid
# kill -s SIGUSR2 pid   # Restart puma
# kill -s SIGTERM pid   # Stop puma
