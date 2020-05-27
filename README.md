
# Launching the app backend (Laravel) with Docker 

## Requirements
Docker installed in your environment

## Setup and configuration
Assume all steps, unless otherwise stated, start from the project root.

```
cp www/.env.example www/.env
docker-compose up -d
```

If nothing was modified default configs in .env will be fine for demonstration.  Check `docker-compose.yml` mysql section for default root config. This is okay for a quick local dev env. Recommended to create a separate user to more realistically approximate the permissions of the DB user when deployed to production.


## First time running it?
Also run:
```
docker exec app composer install
docker exec app php artisan key:generate
docker exec app php artisan jwt:secret
```

### Caveats
This current docker setup will not persist database data.  The 'First time running it?' section must be run overtime if the containers have been shut down.  This is due to a bug currently using Mysql 8 (latest) and docker.  There are work around, but I felt they were beyond the scope of this test/project.


## Environment Notes:
This Docker setup is built on, and tested with, Windows 10 (Windows insider slow ring) + Docker Desktop (windows) + WSL2 (preview) + VS Code.

## Dev environment access within the container
*access to composer and artisan commands*


This will get you into the docker container that is running the php app and allow you to access composer and artisan as necessary:
```
docker exec -it app bash
```

You should be dropped into the the `/var/www` directory by default.  File permissions should already be set - modify them at your own risk


# Launching the app from "regular" environment 
*Box with mysql8, php-fpm, and nginx pre-configured already*

- Copy the contents of `<project root>/www/*` to the web directory it will be served from (<serving dir>)
- `cp <serving dir>/.env.example <serving dir>/.env`
- Set database details in .env you just copied
- From `<serving dir>` run `composer install`
- From `<serving dir>` run `php artisan key:generate`
- From `<serving dir>` run `php artisan jwt:secret`

*nginx config file can be found `docker/nginx/conf.d/app.conf`*

# Launching the app frontend (React.js)

## Requirements
node 10+

### Notes
Assume all steps are done from `<project root>/frontend/`,  unless otherwise stated. The assumption is that host the frontend is running on is also on the same as the backend.  The backend is expected to be accessible from `127.0.0.1/`. The current setup is really only for a developer's machine. It's not difficult to add in the additional configs, it was just skipped to save time.


## Instructions
```
npm install
npm start
```

Browser should automatically popopen to `127.0.0.1:3000` to display the site. Please see the included videos for demonstration.


# App Demonstration
Please see `<project root>/vids/` directory to see demonstration videos of the application.
- One demonstrates the application from the frontend.
- The other demonstrates the logging of activity from the DB.


# OWASP Top 10 vulnerabilities analysis
1. laravel ORM protects against this injection by default.  When using direct SQL though you must manual prevent these injections. I only used the ORM for this project.
2. This app is simple, there isn't too much surface area for this attack.  But by forcing the key invalidation when a user does log out, it does prevent a 3rd party who may have acquired a key to have it for too long.  Plus, keys are only valid for explicit time periods.
3. No Sensitive data is exposed on the frontend.  The backend endpoints, are restricted endpoints protected by `api:auth` middleware.
4. N/A
5. Demonstrated by access to `/admin` being restricted to only logged in users
6. Current security config is *adequate* for the current app, but not good enough for a production app admittedly.
7. Stored data in this app goes through cleaning performed by laravel. Primarily, to prevent SQL Injection. This helps. Also, the way information is displayed back by virtue of REACT.js automatic variable escaping prevents XSS.  In this particular way this tiny app is written I did not have to take extra measures. There are cases when additional measures are required.
8. Potential issues here would be with json de-serialization. Post data sent to the backend. The primary form of mitigation in this case is keeping your packages up to date. As well as maintaining some form of input restriction.
9. Used the latest versions of laravel and REACT at the time of this.  Most known vulnerabilities are patched.
10. Logging was added per requirements.  In addition a tool like sumo logic using their new SEIM would be a great way to cover this aspect.

## Known issues:
- Speed: the current configuration I had for laravel was definitely not optimal.  I did not have any optimizations in place, even for local dev.
- SSL: This sample app uses HTTP not HTTPS.  For sake of simplicity and quickness of development.



---

## Information

* Set aside around 2-3 hours to complete this challenge.
* Fork this repo and build your project in your forked repo.
* Target PHP 7.4, MySQL 8.0 and any framework. Or go framework-less.

## Challenge

* Create a customer login form that checks `username` and `password` inputs against values stored in a database.
* Bare-bones UI is fine.
* Bonus points for mitigating two (or more) of OWASP's [Top 10](https://owasp.org/www-project-top-ten/) vulnerabilities.
* Log all attempts whether successful or not.
* Include the CREATE TABLE statements in a separate file.

## Tables

* customers
* login_activity


-----
Please see README-login_app.md for more information on running this submission.