FROM php:7.3-apache

RUN apt-get update

# 1. development packages
RUN apt-get install -y \
	vim \
    g++ 
    

# 2. apache configs + document root
RUN echo "ServerName laravel" >> /etc/apache2/apache2.conf


RUN adduser -D admin apache -h /var/www/laravel/public
WORKDIR /var/www/laravel

COPY ./dist /var/www/laravel/
RUN ls
#RUN mkdir /var/www/laravel/storage/framework/sessions
#RUN mkdir /var/www/laravel/storage/framework/views
#RUN mv gac-key.json /var/www/

ENV APACHE_DOCUMENT_ROOT=/var/www/laravel
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

ADD 000-default.conf /etc/apache2/sites-available/000-default.conf


# 3. mod_rewrite for URL rewrite and mod_headers for .htaccess extra headers like Access-Control-Allow-Origin-
RUN a2enmod rewrite headers

# 4. start with base php config, then add extensions
#RUN mv "/var/www/laravel/php.ini-production" "$PHP_INI_DIR/php.ini"
RUN mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"

RUN docker-php-ext-install \
    pdo_mysql \
    mysqli
    
#gd library installation   
RUN apt-get update && apt-get install -y libpng-dev 
RUN apt-get install -y \
    libwebp-dev \
    libjpeg62-turbo-dev \
    libpng-dev libxpm-dev \
    libfreetype6-dev

RUN docker-php-ext-configure gd \
    --with-gd \
    --with-webp-dir \
    --with-jpeg-dir \
    --with-png-dir \
    --with-zlib-dir \
    --with-xpm-dir \
    --with-freetype-dir 

RUN docker-php-ext-install gd
RUN docker-php-ext-install bcmath

# Add user for laravel application
RUN groupadd -g 1000 www
RUN useradd -u 1000 -ms /bin/bash -g www www


# Copy existing application directory permissions
COPY --chown=www:www . /var/www

RUN  chmod -R 777 /var/www/laravel
#RUN chmod -R 777 /var/www/laravel/storage


# 5. composer
#COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 6. we need a user with the same UID/GID with host user
# so when we execute CLI commands, all the host file's permissions and ownership remains intact
# otherwise command from inside container will create root-owned files and directories
#ARG uid
#EXPOSE 8080 443
