# ===== PHP 7.3 runtime =====
FROM php:7.3-cli

# OS deps (protoc included)
RUN apt-get update && apt-get install -y \
    git unzip curl wget libzip-dev protobuf-compiler ca-certificates tar \
    && docker-php-ext-install zip \
    && rm -rf /var/lib/apt/lists/*

# Protobuf PHP extension compatible with PHP 7.x
RUN pecl install protobuf-3.23.3 && docker-php-ext-enable protobuf

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Install RoadRunner v1.9.2 (works whether rr is at root or inside a folder)
RUN set -eux; \
    curl -L -o /tmp/rr.tgz \
    https://github.com/spiral/roadrunner/releases/download/v1.9.2/roadrunner-1.9.2-linux-amd64.tar.gz; \
    if tar -tzf /tmp/rr.tgz | grep -q '^rr$'; then \
    tar -xzf /tmp/rr.tgz -C /usr/local/bin rr; \
    else \
    tar -xzf /tmp/rr.tgz -C /usr/local/bin --wildcards --strip-components=1 '*/rr'; \
    fi; \
    chmod +x /usr/local/bin/rr; \
    rr --version

# Spiral protoc plugin v1.4.0 (required by the challenge)
RUN set -eux; \
    curl -L -o /tmp/pgg.tgz \
    https://github.com/spiral/php-grpc/releases/download/v1.4.0/protoc-gen-php-grpc-1.4.0-linux-amd64.tar.gz; \
    mkdir -p /tmp/pgg; tar -xzf /tmp/pgg.tgz -C /tmp/pgg; \
    install -m0755 $(find /tmp/pgg -type f -name 'protoc-gen-php-grpc*' | head -n1) /usr/local/bin/protoc-gen-php-grpc; \
    rm -rf /tmp/pgg.tgz /tmp/pgg

# Composer deps first (cache-friendly)
COPY backend/composer.json /app/backend/composer.json
RUN cd /app/backend && composer install --no-interaction --no-progress

# Copy app + proto
COPY backend /app/backend
COPY proto /app/proto

# Generate PHP stubs
#  Create generated folder with correct permissions
RUN mkdir -p /app/backend/generated && chmod 777 /app/backend/generated

# Generate PHP stubs into /app/backend/generated (bind-mounted to host)
RUN protoc \
    --proto_path=/app/proto \
    --php_out=/app/backend/generated \
    --php-grpc_out=/app/backend/generated \
    /app/proto/ping.proto && \
    echo "--- protoc output start ---" && \
    ls -R /app/backend/generated && \
    echo "--- protoc output end ---" && \
    cd /app/backend && composer dump-autoload -o


EXPOSE 8081
WORKDIR /app/backend
CMD ["rr", "serve", "-c", "/app/backend/.rr.yaml", "-d"]