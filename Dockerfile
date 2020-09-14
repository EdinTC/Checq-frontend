FROM node:alpine AS builder

# This runs as a development build by default.
# To build for production run: docker build ./frontend --build-args app_env=production
ENV NPM_CONFIG_LOGLEVEL warn
ARG APP_ENV
ENV NODE_ENV $APP_ENV

RUN mkdir -p /frontend
WORKDIR /frontend
COPY ./ ./

RUN npm ci
RUN npm run build

FROM fholzer/nginx-brotli:v1.19.1

COPY --from=builder /frontend/public/ /var/www/checq
COPY ./.docker/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
EXPOSE 443
