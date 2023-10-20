FROM php:8.1-fpm

WORKDIR /var/www/html

COPY ./backend /var/www/html

RUN apt-get update && apt-get install -y \
    nginx \
    git \
    && rm -rf /var/lib/apt/lists/*

RUN docker-php-ext-install pdo pdo_mysql

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

COPY ./backend/composer.json ./backend/composer.lock /var/www/html/
RUN composer install

EXPOSE 8000

CMD ["php-fpm"]
