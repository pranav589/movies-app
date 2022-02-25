import { IconButton, Tooltip } from "@material-ui/core";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/auth-provider";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import ThumbUpAltOutlinedIcon from "@material-ui/icons/ThumbUpAltOutlined";
import ThumbDownAltOutlinedIcon from "@material-ui/icons/ThumbDownAltOutlined";
import "./LikeDislike.css";

function LikeDislike({ movie, commentId, movieId }) {
  const { user, userData } = useContext(AuthContext);
  const [likes, setLikes] = useState(0);
  const [disLikes, setDisLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(null);
  const [isDisLiked, setIsDisLiked] = useState(null);
  const userId = localStorage.getItem("userId");

  let variables = {};

  if (movie) {
    variables = { movieId: movieId, userId: userId };
  } else {
    variables = { commentId: commentId, userId: userId };
  }

  useEffect(() => {
    axios.post("/api/like/getLikes", variables).then((res) => {
      if (res.data.success) {
        //number of likes
        setLikes(res.data.likes.length);
        //if i already liked
        res.data.likes.map((like) => {
          if (like.userId === userId) {
            setIsLiked("liked");
          }
        });
      } else {
        toast.error("Failed to get likes.");
      }
    });
    axios.post("/api/like/getDisLikes", variables).then((res) => {
      if (res.data.success) {
        //number of dislikes
        setDisLikes(res.data.disLikes.length);
        //if i already disliked
        res.data.disLikes.map((disLike) => {
          if (disLike.userId === userId) {
            setIsDisLiked("disLiked");
          }
        });
      } else {
        toast.error("Failed to get disLikes.");
      }
    });
  }, []);

  const handleLike = () => {
    if (user) {
      if (isLiked === null) {
        axios.post("/api/like/increaseLike", variables).then((res) => {
          if (res.data.success) {
            setLikes(likes + 1);
            setIsLiked("liked");
            //if dislike button is already clicked
            if (isDisLiked !== null) {
              setIsDisLiked(null);
              setDisLikes(disLikes - 1);
            }
          } else {
            toast.error("Failed to make a like.");
          }
        });
      } else {
        axios.post("/api/like/decreaseLike", variables).then((res) => {
          if (res.data.success) {
            setLikes(likes - 1);
            setIsLiked(null);
          } else {
            toast.error("Failed to descrease like");
          }
        });
      }
    } else {
      toast.error("Please login to give a like");
    }
  };

  const handleDisLike = () => {
    if (user) {
      if (isDisLiked !== null) {
        axios.post("/api/like/decreaseDisLike", variables).then((res) => {
          if (res.data.success) {
            setDisLikes(disLikes - 1);
            setIsDisLiked(null);
          } else {
            toast.error("Failed to increase dislike");
          }
        });
      } else {
        axios.post("/api/like/increaseDisLike", variables).then((res) => {
          if (res.data.success) {
            setDisLikes(disLikes + 1);
            setIsDisLiked("disLiked");
            //if dislike button is already clicked
            if (isLiked !== null) {
              setIsLiked(null);
              setLikes(likes - 1);
            }
          } else {
            toast.error("Failed to decrease dislike");
          }
        });
      }
    } else {
      toast.error("Please login to give a dislike");
    }
  };

  return (
    <div>
      <div className="movie-likes">
        <Tooltip title="Likes">
          <div className="likes">
            <IconButton onClick={handleLike}>
              {isLiked === "liked" ? (
                <ThumbUpAltIcon fontSize="large" color="primary" />
              ) : (
                <ThumbUpAltOutlinedIcon fontSize="large" color="primary" />
              )}
            </IconButton>
            <span>{likes}</span>
          </div>
        </Tooltip>

        <Tooltip title="Dislikes">
          <div className="disLikes">
            <IconButton onClick={handleDisLike}>
              {isDisLiked === "disLiked" ? (
                <ThumbDownIcon fontSize="large" color="primary" />
              ) : (
                <ThumbDownAltOutlinedIcon fontSize="large" color="primary" />
              )}
            </IconButton>
            <span>{disLikes}</span>
          </div>
        </Tooltip>
      </div>
    </div>
  );
}

export default LikeDislike;
