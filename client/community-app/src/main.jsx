import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";

// Import Apollo Client dependencies
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

// Initialize Apollo Client with the GraphQL gateway URL
const client = new ApolloClient({
  uri: "http://localhost:4000/graphql", // Apollo Gateway endpoint
  cache: new InMemoryCache(),
});

// Render the React application and wrap it with ApolloProvider
ReactDOM.createRoot(document.getElementById("root")).render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
