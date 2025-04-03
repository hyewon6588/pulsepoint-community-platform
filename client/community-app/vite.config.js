import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "communityApp",
      filename: "remoteEntry.js",
      exposes: {
        "./PostList": "./src/components/PostList",
        "./CreatePost": "./src/components/CreatePost",
        "./CreateHelpRequest": "./src/components/CreateHelpRequest",
        "./HelpRequestList": "./src/components/HelpRequestList",
        "./AIChatbot": "./src/components/AIChatbot",
      },
      shared: [
        "react",
        "react-dom",
        "react-router-dom",
        "@apollo/client",
        "graphql",
      ],
    }),
  ],
  build: {
    modulePreload: false,
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },
});
