FROM node:26.13.1-trixie-slim AS build

WORKDIR /src

COPY package.json package-lock.json ./
RUN npm ci
COPY . .

RUN npm run build

FROM nginx:1.30.7-alpine
COPY --from=build /src/dist /usr/share/nginx/html
EXPOSE 80
