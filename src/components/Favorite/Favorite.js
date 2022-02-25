import { Button, IconButton } from "@material-ui/core";
import { img_300, unavailable } from "../../config/config";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/auth-provider";
import "./Favorite.css";
import { toast } from "react-toastify";

function Favorite(props) {
  const { user, userData } = useContext(AuthContext);
  const userFrom = localStorage.getItem("userId");
  const movieId = props.movieId;
  const movieTitle = props.movieTitle;
  const moviePost = props.moviePost;
  const movieRunTime = props.movieRunTime;

  const [FavoriteNumber, setFavoriteNumber] = useState(0);
  const [Favorited, setFavorited] = useState(false);

  const variables = {
    movieId: movieId,
    userFrom: userFrom,
    movieTitle: movieTitle,
    moviePost: moviePost,
    movieRunTime: movieRunTime,
  };
  const handleFavorite = () => {
    if (!user) {
      return toast.error("Please Login first");
    }

    if (Favorited) {
      axios
        .post("/api/favorite/removeFromFavorite", variables)
        .then((response) => {
          if (response.data.success) {
            setFavoriteNumber(FavoriteNumber - 1);
            setFavorited(!Favorited);
            toast.success("Removed from watchlist!");
          } else {
            toast.error("Failed!");
          }
        });
    } else {
      axios.post("/api/favorite/addToFavorite", variables).then((response) => {
        if (response.data.success) {
          setFavoriteNumber(FavoriteNumber + 1);
          setFavorited(!Favorited);
          toast.success("Added to watchlist!");
        } else {
          toast.error("Failed!");
        }
      });
    }
  };

  useEffect(() => {
    axios.post("/api/favorite/favoriteNumber", variables).then((response) => {
      if (response.data.success) {
        setFavoriteNumber(response.data.favoriteNumber);
      } else {
        alert("Failed to get Favorite Number");
      }
    });

    axios.post("/api/favorite/favorited", variables).then((response) => {
      if (response.data.success) {
        setFavorited(response.data.favorited);
      } else {
        alert("Failed to get Favorite Information");
      }
    });
  }, []);

  return (
    <div className="fav">
      <IconButton onClick={handleFavorite}>
        {!Favorited ? (
          <FavoriteBorderIcon fontSize="large" color="primary" />
        ) : (
          <FavoriteIcon fontSize="large" color="primary" />
        )}
      </IconButton>
      <span>{Favorited ? "Remove" : "Add"}</span>
    </div>

    // <Button variant="contained" color="secondary" onClick={handleFavorite}>
    //   {!Favorited ? "Add to Favorite" : "Not Favorite"} {FavoriteNumber}
    // </Button>
  );
}

export default Favorite;
