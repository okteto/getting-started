# Movies app

This example shows how to leverage [Okteto](https://www.okteto.com/) to develop a Node.js + React Sample App directly in Kubernetes. The Node + React Sample App is deployed using a Helm Chart. It creates the following components:

- A *React* based frontend, using [Webpack](https://webpack.js.org) as bundler
- A very simple Node.js API using [Express](https://expressjs.com)
- A MongoDB database, with the official `mongo` image
- A job to initialize the MongoDB database

![Movies app final appearance](images/next-ui-movies.png)

This is a representation of the Movies app running in a Development Environment:

![Movies app architecture](images/deploy-movies-app.png)

Follow this guide to deploy the [Movies app to Okteto](https://www.okteto.com/docs/get-started/deploy-your-app/).

