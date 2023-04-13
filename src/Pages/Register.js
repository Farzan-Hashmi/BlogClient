import React from "react";
import registerStyles from "./register.module.css";
import { Typography } from "@mui/material";
import * as yup from "yup";
import { TextField } from "@mui/material";
import { Button } from "@mui/material";
import { useFormik } from "formik";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const vaidationSchema = yup.object().shape({
  username: yup.string().min(5).max(18).required("Username is required"),
  password: yup.string().min(8).required("Password is required"),
});

function Register() {
  let navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    onSubmit: async (values) => {
      //values: {username: "", password: ""}
      try {
        let response = await axios.post("https://blogbackend-production-db2b.up.railway.app/auth", values);
        alert("Successfully registered");
        navigate("/login");
      } catch (err) {
        if (err.response) {
          alert(err.response.data.error);
        }
      }
    },
    validationSchema: vaidationSchema,
  });
  return (
    <div className={registerStyles.container}>
      <form className={registerStyles.form} onSubmit={formik.handleSubmit}>
        <Typography color="red" variant="h6">
          Register
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

export default Register;
