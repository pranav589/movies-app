import { Button, Typography } from "@material-ui/core";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import {
  img_500,
  unavailable,
  unavailableLandscape,
} from "../../config/config";
import { AuthContext } from "../../context/auth-provider";
import "./WatchList.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function WatchList() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  let variable = { userFrom: localStorage.getItem("userId") };
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();
  useEffect(() => {
    fetchFavoredMovie();

    return () => {
      source.cancel();
    };
  }, []);

  const fetchFavoredMovie = () => {
    setLoading(true);
    try {
      axios
        .post(
          "https://webapp-movie.herokuapp.com/api/favorite/getFavoredMovie",
          variable,
          {
            cancelToken: source.token,
          }
        )
        .then((response) => {
          if (response.data.success) {
            console.log(response.data.favorites);
            setFavorites(response.data.favorites);
            setLoading(false);
          } else {
            alert("Failed to get subscription videos");
          }
        });
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("cancelled");
      } else {
        throw error;
      }
    }
  };

  const onClickDelete = (movieId, userFrom) => {
    const variables = {
      movieId: movieId,
      userFrom: userFrom,
    };

    axios
      .post(
        "https://webapp-movie.herokuapp.com/api/favorite/removeFromFavorite",
        variables
      )
      .then((response) => {
        if (response.data.success) {
          fetchFavoredMovie();
          toast.success("Removed from watchlist!");
        } else {
          toast.error("Failed to remove from Watchlist");
        }
      });
  };

  let renderList = favorites.map((content, index) => (
    <div className="watchList" key={content.movieId}>
      <img
        src={
          content.moviePost ? `${img_500}/${content.moviePost}` : unavailable
        }
        alt={content.title}
        className="watchList__potrait"
      />
      <div className="watchList__detail">
        <Typography variant="h6">Name - {content.movieTitle}</Typography>
        <div>Runtime- {content.movieRunTime} mins</div>
        <div className="watchList__buttons">
          <Button
            variant="contained"
            color="primary"
            onClick={() => onClickDelete(content.movieId, content.userFrom)}
            className="watchList__remove"
          >
            Remove
          </Button>
        </div>
      </div>
    </div>
  ));

  return (
    <>
      {user ? (
        <>
          <Typography
            variant="h6"
            mb={2}
            mt={2}
            style={{ color: "#191919", textAlign: "center" }}
          >
            Your Watchlist
          </Typography>

          <div className="videos__container">{renderList}</div>
        </>
      ) : (
        <div style={{ textAlign: "center" }}>
          <Typography variant="h6" mb={2} mt={2} style={{ color: "#191919" }}>
            Please Login to see your watchlist!
          </Typography>
          <Link
            to="/login"
            style={{ textDecoration: "underline", color: "#191919" }}
          >
            Click here.
          </Link>
        </div>
      )}
    </>
  );
}

export default WatchList;
