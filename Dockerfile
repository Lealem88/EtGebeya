# 1. Use the official PHP image with Apache pre-installed
FROM php:8.2-apache

# 2. Install Python inside the same container
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

# 3. Enable Apache mod_rewrite so React's frontend routing works flawlessly
RUN a2enmod rewrite

# 4. Copy your compiled React static files, PHP code, and Python scripts
COPY . /var/www/html/

# 5. Install your Python AI dependencies if you have a requirements.txt file
RUN if [ -f /var/www/html/requirements.txt ]; then \
    pip3 install --no-cache-dir --break-system-packages -r /var/www/html/requirements.txt; \
    fi

# 6. Set correct permissions for Apache
RUN chown -R www-data:www-data /var/www/html

# 7. Expose port 80 for web traffic
EXPOSE 80