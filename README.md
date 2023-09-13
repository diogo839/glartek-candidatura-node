# My-wearher (backend application)

This project is a backend application for a weather application developed in Node.js for a
frontend application developed in React.js ( available [here](https://github.com/diogo839/glartek-candidatura-frontend.git)).
This backend application was developed using Express.js, MongoDB, jwt, and the OpenWeather
Api (available [here](https://openweathermap.org/)).

## Getting Started

To get started, you need to clone the repository and install the dependencies.

### Prerequisites

To run this project you need to have installed Node.js(version 20.6.1) and NPM.

### Installing

To install the dependencies, run the following command:

```
npm install
```

### Running

To run the project, run the following command:

```
npm run dev
```
### Environment variables

To run the project, you need to create a .env file in the root directory of the project with the following variables:

```
NODE_ENV=development
HOST=<your-host>
PORT=<your-port>
APIKEY=<your-openweathermap-api-key>
DATABASE=<mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>
PASSWORD_SECRET=<your-password-secret>
JWT_EXPIRES_IN=<your-jwt-expiration-time>
```
