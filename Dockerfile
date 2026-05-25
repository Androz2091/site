FROM node:20-alpine AS build
# Pin pnpm so the build doesn't pull a newer pnpm that requires Node 22+
# and blocks dependency build scripts. pnpm 9 reads the v9.0 lockfile and
# runs build scripts (esbuild, sharp) by default.
RUN corepack enable && corepack prepare pnpm@9.15.9 --activate
WORKDIR /usr/local/app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

FROM nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/local/app/dist /usr/share/nginx/html
