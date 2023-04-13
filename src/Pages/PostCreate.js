import React from "react";
import createStyles from "./create.module.css";
import { Typography } from "@mui/material";
import * as yup from "yup";
import { TextField } from "@mui/material";
import { Button } from "@mui/material";
import { useFormik } from "formik";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

const vaidationSchema = yup.object().shape({
  title: yup.string().min(1).max(30).required("Title is required"),
  body: yup.string().min(1).max(200).required("Body is required"),
});

function PostCreate() {
  const { authState } = useContext(AuthContext);
  let navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      title: "",
      body: "",
    },
    onSubmit: async (values) => {
      values["postText"] = values["body"];
      delete values["body"];
    

      axios
        .post("https://blogbackend-production-db2b.up.railway.app/posts", values, {
          headers: { accessToken: localStorage.getItem("token") },
        })
        .then((res) => {
          if (res.data.error) {
            alert("Credentials Error");
          } else {
            alert("Successfully created post");
            navigate("/");
          }
        });
    },
    validationSchema: vaidationSchema,
  });
  return (
    <div className={createStyles.container}>
      <form className={createStyles.createPost} onSubmit={formik.handleSubmit}>
        <Typography variant="h6">Create Post</Typography>
        <TextField
          id="title"
          name="title"
          label="title"
          value={formik.values.title}
          onChange={formik.handleChange}
          error={formik.touched.title && Boolean(formik.errors.title)} //if the textfield has been modified and there is an error, then show the error
          helperText={formik.touched.title && formik.errors.title}
        />
        <TextField
          id="body"
          name="body"
          label="body"
          value={formik.values.body}
          onChange={formik.handleChange}
          error={formik.touched.body && Boolean(formik.errors.body)} //if the textfield has been modified and there is an error, then show the error
          helperText={formik.touched.body && formik.errors.body}
          multiline
          rows={5}
          rowsMax={10}
        />
        <Typography variant="h6">User: {authState.username}</Typography>
        <Button type="submit" variant="contained">
          Create
        </Button>
      </form>
    </div>
  );
}

export default PostCreate;
