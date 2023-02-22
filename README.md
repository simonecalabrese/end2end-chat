Simple end2end chat application made In October 2021


## Requirements
You should have installed:
  - [Node](https://nodejs.org/it/download/)
  - [Yarn](https://yarnpkg.com/) (or [NPM](https://docs.npmjs.com/cli/))
  - [MongoDB](https://www.mongodb.com/)

## Start the application
Open 3 terminals:
```sh
# starting api
# make sure you have started mongo first
cd api
yarn
yarn start

# starting socket.io server (real-time communication)
cd api/socketio-server
yarn
yarn start

#starting vue client
cd client
yarn
yarn dev
```
