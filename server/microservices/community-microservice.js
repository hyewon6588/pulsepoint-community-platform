const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
const { buildFederatedSchema } = require("@apollo/federation");
const mongoose = require("mongoose");
const cors = require("cors");

// Connect to MongoDB
const connectDB = require("../config/db");
connectDB();

// Import Mongoose models
const CommunityPost = require("../models/CommunityPost");
const HelpRequest = require("../models/HelpRequest");

const { processCommunityQuery } = require("../utils/aiAgent");

const app = express();
const port = 3004;
app.use(cors());

// Define GraphQL schema
const typeDefs = gql`
  extend type User @key(fields: "id") {
    id: ID! @external
    username: String! @external
    email: String! @external
    role: String! @external
    createdAt: String! @external
  }

  type CommunityPost {
    id: ID!
    author: User!
    title: String!
    content: String!
    category: String!
    aiSummary: String
    createdAt: String
    updatedAt: String
  }

  type HelpRequest {
    id: ID!
    author: ID!
    description: String!
    location: String
    isResolved: Boolean
    volunteers: [User]
    createdAt: String
    updatedAt: String
  }

  type AIResponse {
    text: String!
    suggestedQuestions: [String]!
    retrievedPosts: [CommunityPost]!
  }

  type Query {
    getPosts: [CommunityPost]
    getHelpRequests: [HelpRequest]
    communityAIQuery(input: String!): AIResponse!
  }

  type Mutation {
    createPost(
      author: ID!
      title: String!
      content: String!
      category: String!
    ): CommunityPost
    createHelpRequest(
      author: ID!
      description: String!
      location: String
    ): HelpRequest
    volunteerHelp(helpRequestId: ID!, userId: ID!): HelpRequest
    resolveHelp(helpRequestId: ID!): HelpRequest
  }
`;

// Define GraphQL resolvers
const resolvers = {
  Query: {
    // Get all community posts
    getPosts: async () => await CommunityPost.find(),

    // Get all help requests
    getHelpRequests: async () => await HelpRequest.find(),
    communityAIQuery: async (_, { input }) => {
      try {
        const response = await processCommunityQuery(input);
        return response;
      } catch (err) {
        console.error("AI Query Error:", err);
        throw new Error("Failed to process AI query.");
      }
    },
  },
  Mutation: {
    // Create a new community post
    createPost: async (_, { author, title, content, category }) => {
      return await CommunityPost.create({ author, title, content, category });
    },

    // Create a new help request
    createHelpRequest: async (_, { author, description, location }) => {
      return await HelpRequest.create({ author, description, location });
    },

    // Add a volunteer to a help request
    volunteerHelp: async (_, { helpRequestId, userId }) => {
      return await HelpRequest.findByIdAndUpdate(
        helpRequestId,
        { $addToSet: { volunteers: userId }, updatedAt: new Date() },
        { new: true }
      );
    },

    // Mark a help request as resolved
    resolveHelp: async (_, { helpRequestId }) => {
      return await HelpRequest.findByIdAndUpdate(
        helpRequestId,
        { isResolved: true, updatedAt: new Date() },
        { new: true }
      );
    },
  },
  CommunityPost: {
    author: (parent) => {
      return {
        __typename: "User",
        id: parent.author,
      };
    },
  },
  HelpRequest: {
    volunteers: async (parent) => {
      if (!parent.volunteers || parent.volunteers.length === 0) return [];
      // Federation will use __typename + id to resolve from auth subgraph
      return parent.volunteers.map((id, username) => ({
        __typename: "User",
        id,
        username,
      }));
    },
  },
};

// Create Apollo Server with federation schema
const server = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs, resolvers }]),
});

// Start the server
app.listen(process.env.PORT || port, async () => {
  await server.start();
  server.applyMiddleware({ app });
  console.log(
    `Community microservice ready at http://localhost:${port}${server.graphqlPath}`
  );
});
