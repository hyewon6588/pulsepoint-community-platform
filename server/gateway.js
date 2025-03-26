// server/gateway.js
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const { ApolloGateway } = require("@apollo/gateway");

// Initialize an Express application
const app = express();

// Configure the Apollo Gateway
const gateway = new ApolloGateway({
  serviceList: [
    { name: "auth", url: "http://localhost:3003/graphql" },
    { name: "community", url: "http://localhost:3004/graphql" },
    // Additional services can be listed here
  ],
});

// Initialize Apollo Server with the Apollo Gateway
const server = new ApolloServer({
  gateway,
  subscriptions: false,
});

server.start().then(() => {
  server.applyMiddleware({ app });
  app.listen({ port: 4000 }, () => {
    console.log(`🚀 Gateway ready at http://localhost:4000/graphql`);
  });
});
