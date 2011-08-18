set :application, "capret"

set :scm, :git
set :repository,  "git@github.com:tatemae/capret.git"

set :deploy_to, "/home/ec2-user/#{application}"
set :git_enable_submodules, 1
set :deploy_via, :remote_cache
set :use_sudo, false
default_run_options[:pty] = true

ssh_options[:forward_agent] = true

set :user, "ec2-user"

server = "ec2-184-73-107-100.compute-1.amazonaws.com"

role :web, server                   # Your HTTP instance, Apache/etc
role :app, server                   # This may be the same as your `Web` instance
role :db,  server, :primary => true # This is where Rails migrations will run

set :keep_releases, 1 

namespace :deploy do
  task :start do ; end
  task :stop do ; end
  task :restart, :roles => :app, :except => { :no_release => true } do
    run "sudo stop hummingbird"
    run "sudo start hummingbird"
  end

  task :npm_install, :roles => :app do
    run "cd #{deploy_to}/current && npm install" 
  end
end

namespace :update do
  desc 'Creates symlinks for shared resources'
  task :symlink_shared do
    symlinks = { 'log' => 'log', 'config/app.json' => 'config/app.json', 'GeoLiteCity.dat' => 'GeoLiteCity.dat' }
    symlinks.each do |shared, current|
      run "rm -rf #{latest_release}/#{current}"
      run "ln -s #{shared_path}/#{shared} #{latest_release}/#{current}"
    end
  end
end

after 'deploy:update_code', 'update:symlink_shared'
after 'deploy:symlink', 'deploy:npm_install'
