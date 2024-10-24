FROM node:20-alpine AS builder

WORKDIR /app

ARG VITE_BACKEND_URL
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

ARG VITE_WEBRTC_URL
ENV VITE_WEBRTC_URL=$VITE_WEBRTC_URL

COPY package.json .
COPY pnpm-lock.yaml .

RUN npm install -g pnpm

RUN pnpm ci

ENV NODE_ENV=production

COPY . .
RUN npx nx reset
RUN npx nx build client

FROM nginxinc/nginx-unprivileged:alpine3.18
ENV NODE_ENV=production

RUN rm -rf /etc/nginx/html/*
COPY --from=builder --chown=nginx:nginx /app/dist/apps/* /etc/nginx/html
COPY --chown=nginx:nginx nginx.conf /etc/nginx/nginx.conf

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
