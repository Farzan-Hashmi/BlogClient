import {
  Stack,
  AppBar,
  Toolbar,
  Typography,
  Button,
  ThemeProvider,
  createTheme,
  IconButton,
  CssBaseline,
} from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";

import "@fontsource/roboto/300.css";
import { React, useEffect, useState } from "react";
import Posts from "./Pages/Posts";
import Login from "./Pages/Login";
import IndividualPost from "./Pages/IndividualPost";
import Register from "./Pages/Register";
import PostCreate from "./Pages/PostCreate";
import axios from "axios";

import { AuthContext } from "./context/AuthContext";
import ProfilePage from "./Pages/ProfilePage";

function App() {
  const [mode, setMode] = useState(false);
  const [authState, setAuthState] = useState({
    username: "",
    id: 0,
    loggedIn: false,
  });

  const theme = createTheme({
    palette: {
      mode: mode ? "light" : "dark",
    },
  });

  useEffect(() => {
    console.log(localStorage.getItem("token"));
    axios
      .get("http://localhost:3001/auth/verify", {
        headers: {
          accessToken: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        console.log(res.data);
        if (res.data.error) {
          setAuthState({ ...authState, loggedIn: false });
        } else {
          setAuthState({
            username: res.data.username,
            id: res.data.id,
            loggedIn: true,
          });
        }
      });
  }, []);

  return (
    <AuthContext.Provider value={{ authState, setAuthState }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <AppBar color="common" sx={{ boxShadow: 1 }}>
            <Toolbar>
              <Stack direction="row" sx={{ flexGrow: 1 }} spacing={4}>
                <Typography variant="h6" component="div">
                  <strong> Not So Good Blog </strong>
                </Typography>
                <Button component={Link} to="/">
                  View Posts
                </Button>
              </Stack>
              <Stack direction="row" spacing={4}>
                {!authState.loggedIn ? (
                  <>
                    <Button component={Link} to="/register">
                      Register
                    </Button>
                    <Button component={Link} to="/login">
                      Login
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outlined" component={Link} to="/create">
                      Create Post
                    </Button>
                    <Button component={Link} to={`/profile/${authState.id}`}>
                      {authState.username}
                    </Button>
                    <Button
                      onClick={() => {
                        localStorage.removeItem("token");
                        setAuthState({ username: "", id: "", loggedIn: false });
                        window.location.pathname = "/";
                      }}
                    >
                      Logout
                    </Button>
                  </>
                )}

                {mode ? (
                  <IconButton onClick={() => setMode(!mode)}>
                    <Brightness4Icon />
                  </IconButton>
                ) : (
                  <IconButton onClick={() => setMode(!mode)}>
                    <Brightness7Icon />
                  </IconButton>
                )}
              </Stack>
            </Toolbar>
          </AppBar>
          <Routes>
            <Route path="/" element={<Posts />} />
            <Route path="/login" element={<Login />} />
            <Route path="/post/:id" element={<IndividualPost />} />
            <Route path="/register" element={<Register />} />
            <Route path="/create" element={<PostCreate />} />
            <Route path="/profile/:id" element={<ProfilePage />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthContext.Provider>
  );
}

export default App;
