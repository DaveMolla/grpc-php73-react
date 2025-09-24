FROM php:7.3-cli

# OS deps (include protoc + tar)
RUN apt-get update && apt-get install -y \
    git unzip curl wget libzip-dev protobuf-compiler tar ca-certificates \
    && docker-php-ext-install zip \
    && rm -rf /var/lib/apt/lists/*

# Protobuf PHP extension compatible with PHP 7.x
RUN pecl install protobuf-3.23.3 && docker-php-ext-enable protobuf

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# RoadRunner binary v2 (works fine with Spiral gRPC 1.x)
RUN curl -L -o /usr/local/bin/rr \
    https://github.com/roadrunner-server/roadrunner/releases/download/v2.13.1/rr \
    && chmod +x /usr/local/bin/rr

# Install Spiral protoc plugin (the one the challenge requires)
# v1.4.0 from the provided link
RUN set -eux; \
    curl -L -o /tmp/pgg.tgz \
    https://github.com/spiral/php-grpc/releases/download/v1.4.0/protoc-gen-php-grpc-1.4.0-linux-amd64.tar.gz; \
    mkdir -p /tmp/pgg; \
    tar -xzf /tmp/pgg.tgz -C /tmp/pgg; \
    BIN="$(find /tmp/pgg -type f -name 'protoc-gen-php-grpc*' | head -n1)"; \
    test -n "$BIN"; \
    install -m 0755 "$BIN" /usr/local/bin/protoc-gen-php-grpc; \
    rm -rf /tmp/pgg.tgz /tmp/pgg

WORKDIR /app

# Composer deps first (cache-friendly)
COPY backend/composer.json /app/backend/composer.json
RUN cd /app/backend && composer install --no-interaction --no-progress

# Copy app + proto
COPY backend /app/backend
COPY proto /app/proto

# Generate PHP stubs
RUN mkdir -p /app/backend/generated && \
    protoc -I /app/proto \
    --php_out=/app/backend/generated \
    --php-grpc_out=/app/backend/generated \
    /app/proto/ping.proto && \
    cd /app/backend && composer dump-autoload -o

EXPOSE 9001
CMD ["rr", "serve", "-c", "/app/backend/.rr.yaml", "-d", "-o"]