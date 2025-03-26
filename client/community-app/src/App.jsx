// App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PostList from "./components/PostList";
import CreatePost from "./components/CreatePost";
import CreateHelpRequest from "./components/CreateHelpRequest";
import HelpRequestList from "./components/HelpRequestList";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PostList showTitle={true} />} />
        <Route path="/create-post" element={<CreatePost showTitle={true} />} />
        <Route
          path="/create-help"
          element={<CreateHelpRequest showTitle={true} />}
        />
        <Route
          path="/help-requests"
          element={<HelpRequestList showTitle={true} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
