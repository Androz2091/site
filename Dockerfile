FROM node:20.4.0-alpine AS build
RUN corepack enable
WORKDIR /usr/local/app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

FROM nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/local/app/dist /usr/share/nginx/html
