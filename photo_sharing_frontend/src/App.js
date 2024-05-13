import React, { useState, useEffect } from "react";
import { Grid, Typography, Paper } from "@mui/material";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import Login from "./components/Login";
import Register from "./components/Register";
import PhotoUpload from "./components/PhotoUpload";
import { BASE_URL } from "./utils/constants";

const App = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setLoggedInUser(storedUser);
    }
  }, []);

  return (
    <Router>
      {console.log(JSON.parse(localStorage.getItem("user")))}
      <div>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TopBar
              loggedInUser={loggedInUser}
              setLoggedInUser={setLoggedInUser}
            />
          </Grid>
          <div className="main-topbar-buffer" />
          <Grid item sm={3}>
            <Paper className="main-grid-item">
              {loggedInUser && <UserList sideBar="true" />}
            </Paper>
          </Grid>
          <Grid item sm={9}>
            <Paper
              className="main-grid-item"
              style={{ overflowY: "auto", maxHeight: "calc(100vh - 80px)" }}
            >
              <Routes>
                {!loggedInUser && (
                  <Route path="*" element={<Navigate to="/login" />} />
                )}
                {!loggedInUser && (
                  <Route
                    path="/login"
                    element={<Login setLoggedInUser={setLoggedInUser} />}
                  />
                )}
                <Route path="/register" element={<Register />} />
                <Route
                  path="/users"
                  element={
                    loggedInUser ? (
                      <UserList inside={true} />
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                <Route path="/users/:userId" element={<UserDetail />} />
                <Route path="/photos/:userId" element={<UserPhotos />} />
                <Route path="/photo-upload/:userId" element={<PhotoUpload />} />
              </Routes>
            </Paper>
          </Grid>
        </Grid>
      </div>
    </Router>
  );
};

export default App;
