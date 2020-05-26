# Launching the app backend (Laravel)
Assume all steps, unless otherwise stated, start from the project root.

`cp www/.env.example www/.env`
Fill out the database information and other configs as you desire.  Check `docker-compose.yml` mysql section for default root config. Okay for local dev. Recommended to create a seperate user to more realistically approximate the permissions of the DB user when deployed to production.
`docker-compose up -d`

## First time running it?
Also run:
`docker exec app composer install`
`docker exec app php artisan key:generate`


# Environment Notes:
Docker setup built on and tested with Windows 10 (Windows insider slow ring) + Docker Desktop (windows) + WSL2 (preview) + VS Code.

# Quick and dirty dev environment access through console
This will get you into the docker conatiner that is running the php app and allow you to access composer and artisan as necessary:
`docker exec -it app bash`
You should be dropped into the the /var/www directory by default.  Permissions should already be set - modify them at your own risk


# Launching the app frontend (React)
Assume all steps are done from `<project root>/frontend/`,  unless otherwise stated.

## Requirements
node 10+

`npm install`
`npm start`

Browser should automatically popopen to `127.0.0.1:3000` to display the site.