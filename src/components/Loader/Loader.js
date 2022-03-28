import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";

export default function Loader({ style }) {
  return (
    <div sx={{ display: "flex" }} style={style}>
      <CircularProgress />
    </div>
  );
}
