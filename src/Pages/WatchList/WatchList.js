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
import Loader from "../../components/Loader/Loader";

function WatchList() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
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
    setIsLoading(true);
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
            setIsLoading(false);
          } else {
            toast.error("Failed to get watchlist");
            setIsLoading(false);
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
    setIsLoading(true);
    axios
      .post(
        "https://webapp-movie.herokuapp.com/api/favorite/removeFromFavorite",
        variables
      )
      .then((response) => {
        if (response.data.success) {
          fetchFavoredMovie();
          toast.success("Removed from watchlist!");
          setIsLoading(false);
        } else {
          toast.error("Failed to remove from Watchlist");
          setIsLoading(false);
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

  if (isLoading) {
    return (
      <Loader
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />
    );
  }

  if (favorites.length === 0) {
    return (
      <Typography
        variant="h5"
        mb={2}
        mt={2}
        style={{ color: "#191919", textAlign: "center" }}
      >
        Nothing in watch-list yet. May be add one?
      </Typography>
    );
  }

  return (
    <>
      <Typography
        variant="h6"
        mb={2}
        mt={2}
        style={{ color: "#191919", textAlign: "center" }}
      >
        Your Watchlist
      </Typography>

      {user ? (
        <>
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
