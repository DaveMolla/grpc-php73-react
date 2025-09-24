# Build stage
FROM node:18-bullseye AS build
RUN apt-get update && apt-get install -y protobuf-compiler curl && rm -rf /var/lib/apt/lists/*
RUN curl -L -o /usr/local/bin/protoc-gen-grpc-web \
    https://github.com/grpc/grpc-web/releases/download/1.5.0/protoc-gen-grpc-web-1.5.0-linux-x86_64 \
    && chmod +x /usr/local/bin/protoc-gen-grpc-web

WORKDIR /app
COPY frontend/package.json /app/package.json
# If you have a lockfile, also copy it and use npm ci instead
RUN npm install

COPY frontend /app
COPY proto /app/proto

# Generate JS (CommonJS) messages + JS client into one folder, then build
RUN rm -rf src/grpc && mkdir -p src/grpc \
    && protoc -I /app/proto /app/proto/ping.proto \
    --js_out=import_style=commonjs,binary:src/grpc \
    --grpc-web_out=import_style=commonjs,mode=grpcwebtext:src/grpc \
    && echo "=== Generated files ===" && ls -la src/grpc \
    && npm run build

# Serve stage
FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80