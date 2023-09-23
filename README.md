- [1. Introduction](#introduction)
- [2. Getting Started](#getting-started)
  - [2.1. Requirements](#requirements)
  - [2.2. Directory structure](#directory-structure)
  - [2.3. Configuration](#configuration)
  - [2.4. Start the Application](#start-the-application)
- [3. End-to-end communication](#end-to-end-communication)
  - [3.1. User Registration](#user-registration)
  - [3.2. User Login](#user-login)
  - [3.3. Friend request](#friend-request)
  - [3.4. Chat](#chat)

## Introduction
This project represents a real-time chat application where registered users can send messages to their friends using end-to-end communication.

## Getting Started
### Requirements
You should have installed:
  - [Node](https://nodejs.org/it/download/)
  - [Yarn](https://yarnpkg.com/) (or [NPM](https://docs.npmjs.com/cli/))
  - [MongoDB](https://www.mongodb.com/)

### Directory structure
- `api` contains all of the API server's files directory;
  - `api/socketio-server` is the [Socket.io](https://socket.io/) server directory for real-time communication;
  - `api/src` contains all of the Server core files;
  - `api/.env.example` contains all of the NestJS Server's configuration supported variables.
- `client` Vue client application folder;
  - `client/src` contains all of the Vue client's core files;
  - `client/.env.example` stores all of the client's configuration supported variables.

### Configuration
If you have already installed Mongo and are running an instance of it, you can configure the API server enviroment variables in order to start it correctly.
Move inside `api` directory, copy the `.env.example` file, rename it `.env` and edit it with your custom values.
```sh
# JWT secret used from the server to sign generated tokens
JWT_SECRET=create a complex string without spaces
# Expiry time of the generated tokens
JWT_EXPIRY_IN_SECONDS=180
# Rounds to compute for every single generated BCrypt hash.
BCRYPT_SALT_ROUNDS=10
# Your Mongo connection string
MONGO_DB_URL=mongodb://localhost/<db_name>
```

### Start the application
Open 3 terminals:
```sh
# start the API server
# make sure you have Mongo running first
cd api

# or npm install
yarn

# or npm run start
yarn start



# start the socket.io server for real-time communication
cd api/socketio-server

# or npm install
yarn

# or npm run start
yarn start



# start vue client
cd client

# or npm install
yarn

# or npm run dev
yarn dev
```

## End-to-end communication
### User Registration
During registration, the user needs to create a strong password that will be used to encrypt a just generated [RSA](https://en.wikipedia.org/wiki/RSA_(cryptosystem)) [Private key](https://en.wikipedia.org/wiki/Public-key_cryptography) which, with the [Public](https://en.wikipedia.org/wiki/Public-key_cryptography) one and can chat togheter. one  will be stored with the user's information.

### User Login
When a user logs in, the client fetches from the server all the user's data including the encrypted Private key and uses the just insert password to decrypt the key and save it into the localStorage of the browser. It will be pivotal to decrypt all chat messages.

### Friend request
In order to message with a registered user, you need to send a friend request first. If the invited user accepts your request, you will both receive each other's [Public key](https://en.wikipedia.org/wiki/Public-key_cryptography) and can chat togheter.
> **Note:** The **Public key** will never be encrypted and can also be published because it only encrypts all the messages to send.

### Chat
You can chat with your friends because you know their **Public key**. When you want to send a message, the client prepares two messages to send to the server:
  - a message encrypted with *your* Public key;
  - a message encrypted with *your friend/receiver* Public key.

Therefore for each message sent, one copy can be read only by you and the other only by your friend.
