FROM node:20

WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn install

RUN yarn install-browsers

COPY . .
CMD ["yarn", "test"]
