import { IconButton, TextField, Typography } from "@material-ui/core";
import axios from "axios";
import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/auth-provider";
import ReplyComment from "../ReplyComment/ReplyComment";
import SingleComment from "../SingleComment/SingleComment";
import SendIcon from "@material-ui/icons/Send";

function Comments(props) {
  const { user } = useContext(AuthContext);
  const [comment, setComment] = useState("");
  const userId = localStorage.getItem("userId");

  const handleChange = (e) => {
    setComment(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const variables = {
      content: comment,
      writer: userId,
      movieId: props.movieId,
    };

    axios
      .post(
        "https://webapp-movie.herokuapp.com/api/comment/saveComment",
        variables
      )
      .then((res) => {
        console.log(res.data);
        if (res.data.success) {
          setComment("");
          props.refreshFunction(res.data.result);
        } else {
          toast.error("Failed to comment!");
        }
      });
  };
  if (user) {
    return (
      <div className="comments">
        <br />
        <Typography
          variant="h6"
          style={{ color: "#191919", textAlign: "center" }}
        >
          Comments
        </Typography>
        <hr />

        {props.commentLists &&
          props.commentLists.map(
            (comment, index) =>
              !comment.responseTo && (
                <div key={comment._id}>
                  <SingleComment
                    comment={comment}
                    movieId={props.movieId}
                    refreshFunction={props.refreshFunction}
                  />
                  <ReplyComment
                    commentLists={props.commentLists}
                    movieId={props.movieId}
                    parentCommentId={comment._id}
                    refreshFunction={props.refreshFunction}
                  />
                </div>
              )
          )}

        <div style={{ display: "flex" }}>
          <TextField
            fullWidth
            onChange={handleChange}
            value={comment}
            placeholder="Comment Here"
          />
          <IconButton onClick={handleSubmit}>
            <SendIcon fontSize="large" color="primary" />
          </IconButton>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <Typography
          variant="h6"
          style={{ color: "#191919", textAlign: "center" }}
        >
          Comments
        </Typography>
        <Typography
          variant="h6"
          style={{ color: "#191919", textAlign: "center" }}
        >
          Login to comment!
        </Typography>
      </div>
    );
  }
}

export default Comments;
