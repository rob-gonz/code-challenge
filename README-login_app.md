# Caveats I know of.
- sample app uses HTTP not HTTPS.  For sake of simplicity and quickness of development.


# Launching the app backend (Laravel) with Docker 

## Requirements
Docker installed in your environment

# Setup and configuration
Assume all steps, unless otherwise stated, start from the project root.

`cp www/.env.example www/.env`
Fill out the database information and other configs as you desire.  Check `docker-compose.yml` mysql section for default root config. Okay for local dev. Recommended to create a seperate user to more realistically approximate the permissions of the DB user when deployed to production.
`docker-compose up -d`

### Caveats
This current docker setup will not persist database data.  The 'First time running it?' section must be run everytime if the containers have been shut down.  This is due to a bug currently using Mysql 8 (latest) and docker.  There are work arounds, but I felt they were beyond the scope of this test/project.

## First time running it?
Also run:
`docker exec app composer install`
`docker exec app php artisan key:generate`
`docker exec app php artisan jwt:secret`


# Environment Notes:
Docker setup built on and tested with Windows 10 (Windows insider slow ring) + Docker Desktop (windows) + WSL2 (preview) + VS Code.

# Environment access through console (access to composer and artisan commands)
This will get you into the docker conatiner that is running the php app and allow you to access composer and artisan as necessary:
`docker exec -it app bash`
You should be dropped into the the /var/www directory by default.  File permissions should already be set - modify them at your own risk


# Launching the app from an environment that has mysql8, php-fpm, and nginx pre-configured.
- Copy the contents of `<project root>/www/*` to the web directory it will be served from (<serving dir>)
- `cp <serving dir>/.env.example <serving dir>/.env`
- Set database details in .env you just copied
- From `<serving dir>` run `composer install`
- From `<serving dir>` run `php artisan key:generate`
- From `<serving dir>` run `php artisan jwt:secret`

# Launching the app frontend (React)
Assume all steps are done from `<project root>/frontend/`,  unless otherwise stated. The assumption is that host the frontend is running on is also on the same as the backend.  The backend is expected to be accessable from `127.0.0.1/`.

## Requirements
node 10+

`npm install`
`npm start`

Browser should automatically popopen to `127.0.0.1:3000` to display the site. Please see the included videos for demonstration.



# App demonstration
Please see `vids/` directory to see demonstration videos of the application.



# OWASP Top 10 vulnerabilities 
- 1. laravel ORM protects agains this.  When using direct SQL though you must manual prevent these injectsions
- 2. Broken Authentication: This app is simple, so hard to really test.  But by forcing the key invalidation when a user does log out, it does prevent a 3rd party who acquired a key to have it for too long.  Plus, keys are only valid for explicit time periods.
- 3. No Sensitive data is exposed on the frontend.  The backend api, has restricted endpoints protected by api:auth middleware.
- 4. N/A
- 5. Demonstrated by access to /admin being restrited to only logged in users
- 6. Current security config good enough for the current app, but not good enough for a production app.
- 7. Stored data in this app goes through cleaning performed by laravel, and the way information is displayed back by virtue of REACT prevents XSS.  In this particular way the app is written I did not have to take extra measures as you should on a production app
- 8. Potential issues here would be with json de-serializtion.  You can mitigate this only by keeping your packages up to date.
- 9. Used the latest versions of larvel and REACT at the time of this.  Most known vulnerabilites are patched.
- 10. Logging was added per requirements.  In addition a tool like sumo logic using their new SEIM would be a great way to cover this.