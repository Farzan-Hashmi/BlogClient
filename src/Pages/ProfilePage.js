import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  CardActionArea,
  Box,
} from "@mui/material";

import posts from "./posts.module.css";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CardActions from "@mui/material/CardActions";
import axios from "axios";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import DeleteIcon from "@mui/icons-material/Delete";
import { likeExistsforUser } from "./Posts";
import CommentIcon from "@mui/icons-material/Comment";

const cardStyle = {
  display: "block",
  height: "20vw",
  flexDirection: "column",
  display: "flex",
};

const commentCardStyle = {
  display: "block",
  height: "10vw",
  flexDirection: "column",
  display: "flex",
};

function ProfilePage() {
  const { authState } = useContext(AuthContext);
  const params = useParams();
  const userId = params.id;
  const [userPosts, setUserPosts] = useState([]);
  const [userComments, setUserComments] = useState([]);
  const [username, setUsername] = useState("");

  async function getPostsbyUser() {
    let res = await axios.get(`http://localhost:3001/posts/user/${userId}`);
    console.log(res.data);
    setUserPosts(res.data);
    setUsername(res.data[0].username);
  }

  async function getCommentsbyUser() {
    let res = await axios.get(`http://localhost:3001/comments/user/${userId}`);
    console.log(res.data);
    setUserComments(res.data);
  }

  async function likePost(id) {
    if (authState.loggedIn) {
      const res = await axios.post(
        "http://localhost:3001/like",
        { PostId: id },
        { headers: { accessToken: localStorage.getItem("token") } }
      );
      console.log(res.data);
      getPostsbyUser();
    } else {
      alert("You must be logged in to like a post");
    }
  }

  async function deletePost(id) {
    if (authState.loggedIn) {
      const res = await axios.delete(`http://localhost:3001/posts/${id}`, {
        headers: { accessToken: localStorage.getItem("token") },
      });
      console.log(res.data);
      getPostsbyUser();
    } else {
      alert("You must be logged in to delete a post");
    }
  }

  async function deleteComment(id) {
    if (authState.loggedIn) {
      let res = await axios.delete(`http://localhost:3001/comments/${id}`, {
        headers: { accessToken: localStorage.getItem("token") },
      });
      console.log(res.data);
      getCommentsbyUser();
    } else {
      alert("You must be logged in to delete a comment");
    }
  }

  useEffect(() => {
    console.log(userId);
    getPostsbyUser();
    getCommentsbyUser();
  }, []);

  return (
    <div style={{ height: "100vh" }} className={posts.container2}>
      <div className={posts.center2}>
        {userId == authState.id ? (
          <Typography variant="h4">My Profile</Typography>
        ) : (
          <Typography variant="h4">{username}'s Profile</Typography>
        )}
        <Box sx={{ height: 30 }}></Box>
        <Typography variant="h6"> Posts: </Typography>
        <Box sx={{ height: 10 }}></Box>
      </div>
      {userPosts.map((post) => (
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
              style={{ display: "flex", justifyContent: "space-around" }}
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
      <div className={posts.center2}>
        <Typography variant="h6"> Comments: </Typography>
        <Box sx={{ height: 10 }}></Box>
        {userComments.map((comment) => (
          <>
            <Card className={posts.center2} style={commentCardStyle}>
              <CardActionArea component={Link} to={`/post/${comment.PostId}`}>
                <CardContent>
                  <Typography variant="body1" color="text.secondary">
                    {comment.CommentBody.length > 475
                      ? comment.CommentBody.substring(0, 475) + "..."
                      : comment.CommentBody}
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions
                style={{ display: "flex", justifyContent: "space-around" }}
              >
                {comment.UserId === authState.id ? (
                  <IconButton onClick={() => deleteComment(comment.id)}>
                    <DeleteIcon />
                  </IconButton>
                ) : (
                  <IconButton />
                )}
              </CardActions>
            </Card>
          </>
        ))}
      </div>
    </div>
  );
}

export default ProfilePage;
