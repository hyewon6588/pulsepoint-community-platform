const { ApolloServer, gql } = require("apollo-server-express");
const { buildFederatedSchema } = require("@apollo/federation");
const express = require("express");
const cors = require("cors");

const connectDB = require("../config/db");
const User = require("../models/User");
const {
  comparePassword,
  generateToken,
  hashPassword,
} = require("../utils/auth");

const app = express();
const port = 3003;
app.use(cors());

// Connect to MongoDB
connectDB();

// Define GraphQL schema
const typeDefs = gql`
  type User @key(fields: "id") {
    id: ID!
    username: String!
    email: String!
    role: String!
    createdAt: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    _dummy: String
  }

  type Mutation {
    login(email: String!, password: String!): AuthPayload
    signup(
      username: String!
      email: String!
      password: String!
      role: String!
    ): AuthPayload
  }
`;

// Define GraphQL resolvers
const resolvers = {
  Query: {
    _dummy: () => "This is a dummy query",
  },
  Mutation: {
    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error("User not found");
      }

      const isValid = await comparePassword(password, user.password);
      if (!isValid) {
        throw new Error("Invalid password");
      }

      const token = generateToken(user);
      return { token, user };
    },

    signup: async (_, { username, email, password, role }) => {
      const existingUser = await User.findOne({
        $or: [{ email }, { username }],
      });
      if (existingUser) {
        throw new Error("Username or email already in use");
      }

      const hashedPassword = await hashPassword(password);
      const user = await User.create({
        username,
        email,
        password: hashedPassword,
        role,
      });

      const token = generateToken(user);
      return { token, user };
    },
  },
  User: {
    __resolveReference: async (user) => {
      return await User.findById(user.id);
    },
  },
};

// Initialize and start Apollo Server
async function startServer() {
  const server = new ApolloServer({
    schema: buildFederatedSchema([{ typeDefs, resolvers }]),
  });

  await server.start();
  server.applyMiddleware({ app });

  app.listen(port, () => {
    console.log(
      `✅ Authentication microservice ready at http://localhost:${port}${server.graphqlPath}`
    );
  });
}

startServer();
