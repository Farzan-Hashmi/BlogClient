import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  CardActionArea,
  Box,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import posts from "./posts.module.css";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CardActions from "@mui/material/CardActions";
import axios from "axios";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import DeleteIcon from "@mui/icons-material/Delete";
import CommentIcon from "@mui/icons-material/Comment";

const cardStyle = {
  display: "block",
  height: "20vw",
  flexDirection: "column",
  display: "flex",
};

export function likeExistsforUser(id, array) {
  for (let i = 0; i < array.length; i++) {
    if (array[i].UserId === id) {
      return true;
    }
  }
}

function Posts() {
  const { authState } = useContext(AuthContext);
  const [postdata, setpostdata] = useState([]);

  function getPosts() {
    axios.get("https://black-white-blog.herokuapp.com/posts").then((res) => {

      setpostdata(res.data);
    });
  }

  async function likePost(id) {
    if (authState.loggedIn) {
      const res = await axios.post(
        "https://black-white-blog.herokuapp.com/like",
        { PostId: id },
        { headers: { accessToken: localStorage.getItem("token") } }
      );
   
      getPosts();
    } else {
      alert("You must be logged in to like a post");
    }
  }

  async function deletePost(id) {
    if (authState.loggedIn) {
      const res = await axios.delete(`https://black-white-blog.herokuapp.com/posts/${id}`, {
        headers: { accessToken: localStorage.getItem("token") },
      });

      getPosts();
    } else {
      alert("You must be logged in to delete a post");
    }
  }

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div style={{ height: "100vh" }} className={posts.container2}>
      {postdata.map((post) => (
        <>
          <Card className={posts.center2} style={cardStyle}>
            <CardActionArea component={Link} to={`/post/${post.id}`}>
              <CardHeader title={post.title} subheader={post.username} />
              <CardContent>
                <Typography variant="body1" color="text.secondary">
                  {post.postText.length > 475
                    ? post.postText.substring(0, 475) + "..."
                    : post.postText}
                </Typography>
              </CardContent>
            </CardActionArea>
            <Box sx={{ height: 100 }} />
            <CardActions
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              {likeExistsforUser(authState.id, post.Likes) ? (
                <IconButton onClick={() => likePost(post.id)}>
                  <FavoriteIcon color="error" />
                </IconButton>
              ) : (
                <IconButton onClick={() => likePost(post.id)}>
                  <FavoriteIcon color="none" />
                </IconButton>
              )}

              <Typography variant="body2" color="text.secondary">
                {post.Likes.length}
              </Typography>

              <Box sx={{ width: 400 }} />
              <CommentIcon />
              <Typography variant="body2" color="text.secondary">
                {post.Comments.length}
              </Typography>

              <Box
                sx={{
                  width: 450,
                  height: 1,
                }}
              />

              {post.UserId === authState.id ? (
                <IconButton onClick={() => deletePost(post.id)}>
                  <DeleteIcon />
                </IconButton>
              ) : (
                <IconButton />
              )}
            </CardActions>
          </Card>
          <Box
            sx={{
              width: 1,
              height: 400,
            }}
          />
        </>
      ))}
    </div>
  );
}

export default Posts;
