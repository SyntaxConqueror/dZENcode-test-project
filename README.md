# dZENcode Test Project
## _I suppose you will like this_



This app provides you an abillity to leave comments with other people.
You can answer them, and make some chat.

## Features

- Clear interface;
- Good adaptivity to any of devices (smartphones, laptop, computers);
- Backend part written with _Laravel(PHP)_ framework;
- Frontend part written with _ReactJS_ using _Bootstrap_;
- This app provides _caching_ on server part, so you can fastly going through it.
- App use _MySQL_ database;
- The application has a _loading animation_, the user will not watch the chat interface loading process;
- Validation on _each_ level;
- User can add to his comment some _html tags_;
- User can pin some _TXT or IMAGE file_ to comment;
- All files that will be pinned to comments go to _AWS S3 bucket_;
- App provides ability to _sort_ comments in some ways;

## Tech

This app uses a number of technologies:

- [Laravel](https://laravel.com/) - Server part of the app;
- [Vite](https://vitejs.dev/) - Client part of the app;
- [React](https://react.dev/) - Client part of the app;
- [Bootstrap](https://getbootstrap.com/) - great UI boilerplate for modern solutions in app;
- [Lightbox](https://lokeshdhakar.com/projects/lightbox2/) - animated viewing the images in comments;
- [Axios](https://axios-http.com/) - promise based HTTP client;
- [jQuery] - For bootstrap


## Installation

App requires [Node.js](https://nodejs.org/) v10+ and [Composer](https://getcomposer.org/) to run.

Install the dependencies and devDependencies and start the server.

```sh
git clone -b prod https://github.com/SyntaxConqueror/dZENcode-test-project.git

cd dZENcode-test-project/backend

composer install

npm i
```

Than you should form .env file:
- Create .env file
- Copy the .env.example to .env
- Than set DATABASE and AWS S3 bucket data to what you need

How it in .env file should be:
```sh
DB_CONNECTION=mysql
DB_HOST=YOUR_DB_HOST
DB_PORT=YOUR_DB_PORT
DB_DATABASE=YOUR_DATABASE_NAME
DB_USERNAME=YOUR_DB_USERNAME
DB_PASSWORD=YOUR_DB_PASSWORD
```

```sh
AWS_ACCESS_KEY_ID=YOUR_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY=YOUR_SECRET_ACCESS_KEY
AWS_DEFAULT_REGION=YOUR_AWS_REGION
AWS_BUCKET=YOUR_AWS_BUCKET_NAME
AWS_URL=YOUR_AWS_BUCKET_URL/files/
AWS_USE_PATH_STYLE_ENDPOINT=false
```
Than you should run:
```sh
php artisan migrate

php artisan db:seed --class=UsersCommentsSeeder

php artisan serve
```

And you are good with that!

## Docker

App is very easy to install and deploy in a Docker container.
First of all you need to clone the main branch to any folder that you want.
```sh
git clone -b main https://github.com/SyntaxConqueror/dZENcode-test-project.git

cd dZENcode-test-project/backend

composer install
```

Than you have to form .env file in _backend_ folder.
Copy the .env.example to .env file. Database should be like in .env.example.
Do not change anything that is connected with Database.

What you need to change is AWS S3 bucket data to yours:
```sh
AWS_ACCESS_KEY_ID=YOUR_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY=YOUR_SECRET_ACCESS_KEY
AWS_DEFAULT_REGION=YOUR_AWS_REGION
AWS_BUCKET=YOUR_AWS_BUCKET_NAME
AWS_URL=YOUR_AWS_BUCKET_URL/files/
AWS_USE_PATH_STYLE_ENDPOINT=false
```

Then return to terminal to a _dZENcode-test-project_ folder:
```sh
cd dZENcode-test-project
```
or
If you still in _backend_ folder:
```sh
cd ../
```

Then type this, it will build docker container:
```sh
docker-compose up -d
```

If you want to set up the database by migration and seeders, do this (after docker container set up):
```sh
docker exec -it laravel-app /bin/sh

php artisan migrate

php artisan db:seed --class=UsersCommentsSeeder
```

All this steps will certainly give you an ability to set up the docker container with app correctly!
To check the app you should type in adress bar in your browser: [http://localhost:3000](http://localhost:3000)

# Enjoy using it!
_Developed by Artem Shvets_
