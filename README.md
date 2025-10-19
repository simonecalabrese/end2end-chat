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
- [4. Future Improvements](#future-improvements)

## Introduction
A real-time chat application that allows registered users to send messages to their friends with end-to-end encryption.

> **Note:** This project was originally developed in 2021 and is no longer maintained.

## Getting Started
### Requirements
You should have installed:
  - [Node](https://nodejs.org/it/download/)
  - [Yarn](https://yarnpkg.com/) (or [NPM](https://docs.npmjs.com/cli/))
  - [MongoDB](https://www.mongodb.com/)

### Directory structure
- `api` contains all of the API server's files directory;
  - `api/socketio-server` is the [Socket.io](https://socket.io/) server directory for real-time communication;
  - `api/src` contains all server core's files;
  - `api/.env.example` NestJS Server's configuration enviroment variables.
- `client` Vue client application folder;

### Configuration
If you have already installed and started MongoDB, you can configure the API server enviroment variables in order to start it correctly.
Move inside `api` directory, copy the `.env.example` file, rename it `.env` and edit it with your custom values.
```sh
# JWT secret used from the server to sign generated tokens
JWT_SECRET=create a complex string without spaces
# Expiry time of the generated tokens
JWT_EXPIRY_IN_SECONDS=180
# Rounds to apply for generating BCrypt hash.
BCRYPT_SALT_ROUNDS=10
# Your Mongo connection string
MONGO_DB_URL=mongodb://localhost/<db_name>
```

### Start the application
Open 3 terminals:
```sh
# start the API server
# make sure you have an instance of Mongo running first
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
During registration, the user needs to create a strong password that will be used to encrypt a just generated [RSA](https://en.wikipedia.org/wiki/RSA_(cryptosystem)) [Private key](https://en.wikipedia.org/wiki/Public-key_cryptography) which, with the [Public](https://en.wikipedia.org/wiki/Public-key_cryptography) one can chat togheter. one  will be stored with the user's information.

### User Login
When a user logs in, the client fetches from the server all the user's data including the encrypted Private key and uses the just insert password to decrypt the key and save it into the localStorage of the browser. It will be fundamental to decrypt all chat messages.

### Friend request
In order to message with a registered user, you need to send a friend request first. If the invited user accepts your request, you will both receive each other's [Public key](https://en.wikipedia.org/wiki/Public-key_cryptography) and can chat togheter.
> [!NOTE]  
> The **Public key** will never be encrypted and can also be published because it only encrypts all the messages to send.

### Chat
You can chat with your friends because you know their **Public key**. When you want to send a message, the client prepares two messages to send to the server:
  - a message encrypted with *your* Public key;
  - a message encrypted with *your friend/receiver* Public key.

Therefore for each message sent, one copy can be read only by you and the other only by your friend.

## Future Improvements
- Create a **secret key** shared between sender and receiver for each conversation to save **50%** of the space when storing messages and eliminate the need to save two copies for each message.
