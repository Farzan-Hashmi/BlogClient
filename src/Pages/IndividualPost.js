import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import post from "./ip.module.css";
import { useState } from "react";
import axios from "axios";
import { Box, IconButton, Typography } from "@mui/material";
import * as yup from "yup";
import { useFormik } from "formik";
import { TextField } from "@mui/material";
import { Button } from "@mui/material";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link } from "react-router-dom";

const vaidationSchema = yup.object().shape({
  body: yup.string().min(2).max(200).required("Body is required"),
});

function IndividualPost() {
  const { authState } = useContext(AuthContext);
  const [postInfo, setPostInfo] = useState([]);
  const [postComments, setPostComments] = useState([]);
  const params = useParams();
  const postId = params.id;

  const formik = useFormik({
    initialValues: {
      body: "",
    },
    onSubmit: async (values) => {
      if (!authState.loggedIn) {
        alert("Credentials are Missing/Incorrect");
      }

      values["CommentBody"] = values["body"];
      delete values["body"];
      values["PostId"] = postId;

      let response = await axios.post(
        "https://blogbackend-production-db2b.up.railway.app/comments",
        values,
        { headers: { accessToken: localStorage.getItem("token") } }
      );
      if (response.error) {
        alert("Credentials are incorrect");
      } else {


        getComments();
      }
    },
    validationSchema: vaidationSchema,
  });

  const getComments = () => {
    axios.get(`https://blogbackend-production-db2b.up.railway.app/comments/${postId}`).then((res) => {

      setPostComments(res.data);
    });
  };

  async function deleteComment(id) {
    if (authState.loggedIn) {
      const res = await axios.delete(`https://blogbackend-production-db2b.up.railway.app/comments/${id}`, {
        headers: { accessToken: localStorage.getItem("token") },
      });

      getComments();
    } else {
      alert("Credentials are Missing/Incorrect");
    }
  }
  useEffect(() => {
    axios.get(`https://blogbackend-production-db2b.up.railway.app/posts/byId/${postId}`).then((res) => {
    
      setPostInfo(res.data);
    });
    getComments();
  }, []);

  return (
    <div className={post.container}>
      <div className={post.post}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Typography variant="h8">
            Title:
            <strong>{" " + postInfo.title + "  "}</strong>
          </Typography>

          <Typography
            sx={{ textDecoration: "none" }}
            variant="h8"
            component={Link}
            to={`/profile/${postInfo.UserId}`}
          >
            <strong>By: {postInfo.username}</strong>
          </Typography>
        </div>

        <div>{postInfo.postText}</div>
      </div>
      <form className={post.createComment} onSubmit={formik.handleSubmit}>
        <Typography variant="h6">Add Comment: {authState.username}</Typography>
        <TextField
          id="body"
          name="body"
          label="body"
          value={formik.values.body}
          onChange={formik.handleChange}
          error={formik.touched.body && Boolean(formik.errors.body)} //if the textfield has been modified and there is an error, then show the error
          helperText={formik.touched.body && formik.errors.body}
        />
        <Button type="submit" variant="outlined">
          Add
        </Button>
      </form>
      <div className={post.comments}>
        <Typography variant="h5">Comments:</Typography>

        {postComments.map((comment) => (
          <div>
            <strong>{comment.username + ":"}</strong>
            <Box sx={{ width: 10 }} />
            {comment.CommentBody}
            <Box sx={{ width: 10 }} />
            {authState.id === comment.UserId ? (
              <IconButton onClick={() => deleteComment(comment.id)}>
                <DeleteIcon />
              </IconButton>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

export default IndividualPost;
