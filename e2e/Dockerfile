FROM node:20

WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn install

RUN yarn prepare

COPY . .
CMD ["yarn", "test"]
