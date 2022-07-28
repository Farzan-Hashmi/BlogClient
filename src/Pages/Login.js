import React from "react";
import registerStyles from "./register.module.css";
import { Typography } from "@mui/material";
import { TextField } from "@mui/material";
import { Button } from "@mui/material";
import { useFormik } from "formik";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const { setAuthState } = useContext(AuthContext);
  let navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    onSubmit: async (values) => {
      //values: {username: "", password: ""}
      try {
        let response = await axios.post(
          "https://black-white-blog.herokuapp.com/auth/login",
          values
        );
        localStorage.setItem("token", response.data.token);
        navigate("/");
        setAuthState({
          username: response.data.username,
          id: response.data.id,
          loggedIn: true,
        });
      } catch (err) {
        if (err.response) {
          alert(err.response.data.error);
        }
      }
    },
  });
  return (
    <div className={registerStyles.container}>
      <form className={registerStyles.form} onSubmit={formik.handleSubmit}>
        <Typography color="green" variant="h6">
          Login
        </Typography>
        <TextField
          id="username"
          name="username"
          label="Username"
          value={formik.values.username}
          onChange={formik.handleChange}
          error={formik.touched.username && Boolean(formik.errors.username)} //if the textfield has been modified and there is an error, then show the error
          helperText={formik.touched.username && formik.errors.username}
        />
        <TextField
          id="password"
          name="password"
          label="Password"
          type="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          error={formik.touched.password && Boolean(formik.errors.password)} //if the textfield has been modified and there is an error, then show the error
          helperText={formik.touched.password && formik.errors.password}
        />
        <Button type="submit" variant="contained">
          Submit
        </Button>
      </form>
    </div>
  );
}

export default Login;
