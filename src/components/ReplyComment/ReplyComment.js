import React, { useState, useEffect } from "react";
import SingleComment from "../SingleComment/SingleComment";

function ReplyComment(props) {
  const [childCommentNumber, setChildCommentNumber] = useState(0);
  const [openReplyComments, setOpenReplyComments] = useState(false);
  useEffect(() => {
    let commentNumber = 0;
    props.commentLists.map((comment) => {
      // console.log(comment);
      if (comment.responseTo === props.parentCommentId) {
        commentNumber++;
      }
    });
    setChildCommentNumber(commentNumber);
  }, [props.commentLists, props.parentCommentId]);

  let renderReplyComment = (parentCommentId) =>
    props.commentLists.map((comment, index) => (
      <React.Fragment key={comment._id}>
        {comment.responseTo === parentCommentId && (
          <div style={{ width: "80%", marginLeft: "40px" }}>
            <SingleComment
              comment={comment}
              movieId={props.movieId}
              refreshFunction={props.refreshFunction}
            />
            <ReplyComment
              commentLists={props.commentLists}
              parentCommentId={comment._id}
              movieId={props.movieId}
              refreshFunction={props.refreshFunction}
            />
          </div>
        )}
      </React.Fragment>
    ));
  const handleChange = () => {
    setOpenReplyComments(!openReplyComments);
    console.log(openReplyComments);
  };
  return (
    <div>
      {childCommentNumber > 0 && (
        <p
          style={{
            fontSize: "14px",
            margin: 0,
            color: "gray",
            cursor: "pointer",
            marginBottom: 5,
          }}
          onClick={handleChange}
        >
          View {childCommentNumber} more comment(s)
        </p>
      )}

      {openReplyComments && renderReplyComment(props.parentCommentId)}
    </div>
  );
}

export default ReplyComment;
