#! /bin/bash
set -e

export MONGODB_PASSWORD=password
export MONGODB_USERNAME=okteto
export MONGODB_DATABASE=okteto
export MONGODB_HOST=mongodb

npm ci
npm test
