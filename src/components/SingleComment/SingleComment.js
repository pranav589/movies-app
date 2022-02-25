import { Avatar, IconButton, TextField, Typography } from "@material-ui/core";
import axios from "axios";
import React, { useState } from "react";
import { useContext } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/auth-provider";
import LikeDislike from "../LikeDislike/LikeDislike";
import ReplyIcon from "@material-ui/icons/Reply";
import SendIcon from "@material-ui/icons/Send";
import "./SingleComment.css";

function SingleComment(props) {
  const { user, userData } = useContext(AuthContext);
  const [commentValue, setCommentValue] = useState("");
  const [openReply, setOpenReply] = useState(false);
  const userId = localStorage.getItem("userId");

  const handleChange = (e) => {
    setCommentValue(e.currentTarget.value);
  };

  const onReply = () => {
    setOpenReply(!openReply);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const variables = {
      writer: userId,
      movieId: props.movieId,
      responseTo: props.comment._id,
      content: commentValue,
    };

    axios.post("/api/comment/saveComment", variables).then((res) => {
      console.log(res.data);
      if (res.data.success) {
        setCommentValue("");
        setOpenReply(!openReply);
        props.refreshFunction(res.data.result);
      } else {
        toast.error("Failed to comment!");
      }
    });
  };

  return (
    <div>
      <div className="singleComment__user">
        <div className="singleComment__username">
          <Avatar src={props?.writer?.image}></Avatar>
          <Typography variant="subtitle2" className="writerName">
            {props?.comment?.writer?.name}
          </Typography>
        </div>
        <p>{props.comment.content}</p>
        <div className="singleComment__userInteract">
          <LikeDislike comment commentId={props.comment._id} userId={userId} />
          <div className="replyTo">
            <IconButton onClick={onReply}>
              <ReplyIcon fontSize="large" color="primary" />
            </IconButton>
            <span
              key="comment-basic-reply-to"
              style={{ cursor: "pointer", color: "#191919" }}
            >
              Reply To{" "}
            </span>
          </div>
        </div>
      </div>
      {openReply && (
        <div style={{ display: "flex" }}>
          <TextField
            fullWidth
            onChange={handleChange}
            value={commentValue}
            placeholder="Post you comment"
            style={{ marginTop: 5, marginBottom: 5 }}
          />
          <br />
          <IconButton onClick={handleSubmit}>
            <SendIcon fontSize="large" color="primary" />
          </IconButton>
        </div>
      )}
    </div>
  );
}

export default SingleComment;
