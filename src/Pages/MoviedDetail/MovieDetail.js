import React, { useEffect, useState } from "react";
import "./MovieDetail.css";
import { Button, Typography } from "@material-ui/core";
import YouTubeIcon from "@material-ui/icons/YouTube";
import { makeStyles } from "@material-ui/core/styles";
import {
  img_500,
  unavailable,
  unavailableLandscape,
} from "../../config/config";
import axios from "axios";
import { useLocation, useParams } from "react-router-dom";
import Carousel from "../../components/Carousel/Carousel";
import LikeDislike from "../../components/LikeDislike/LikeDislike";
import Favorite from "../../components/Favorite/Favorite";
import Comments from "../../components/Comments/Comments";
import Loader from "../../components/Loader/Loader";

function MovieDetail() {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState();
  const [video, setVideo] = useState();
  const [commentLists, setCommentLists] = useState([]);

  const movieVariable = {
    movieId: location.state.id,
  };

  const fetchData = async () => {
    setIsLoading(true);
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/${location.state.media_type}/${location.state.id}?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
    );
    setContent(data);
    setIsLoading(false);
  };

  const fetchVideo = async () => {
    setIsLoading(true);
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/${location.state.media_type}/${location.state.id}/videos?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
    );
    setVideo(data.results[0]?.key);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
    fetchVideo();
    // eslint-disable-next-line

    axios
      .post(
        "https://webapp-movie.herokuapp.com/api/comment/getComments",
        movieVariable
      )
      .then((response) => {
        if (response.data.success) {
          setCommentLists(response.data.comments);
        } else {
          console.log("Failed to get comments Info");
        }
      });
  }, []);

  const updateComment = (newComment) => {
    setCommentLists(commentLists.concat(newComment));
  };

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

  if (content) {
    return (
      <div className="movieDetail">
        <img
          src={
            content.poster_path
              ? `${img_500}/${content.poster_path}`
              : unavailable
          }
          alt={content.name || content.title}
          className="movieDetail__potrait"
        />
        <img
          src={
            content.backdrop_path
              ? `${img_500}/${content.backdrop_path}`
              : unavailableLandscape
          }
          alt={content.name || content.title}
          className="movieDetail__landscape"
        />
        <div className="movieDetail__about">
          <div className="movieDetail__abt">
            <span className="movieDetail__title">
              {content.name || content.title}
            </span>
            <span className="movieDetail__tagline">{content.tagline}</span>
          </div>
          <div className="movieDetail__likeDislike">
            <LikeDislike movie movieId={location.state.id} />
            <Favorite
              movieId={location.state.id}
              movieTitle={content.name || content.title}
              movieRunTime={content.runtime}
              moviePost={content.poster_path}
            />
          </div>

          <div className="movieDetail__desc">
            <Typography variant="h6" style={{ color: "#191919" }}>
              Overview
            </Typography>
            <span>{content.overview}</span>
          </div>

          <div className="movieDetail__details">
            <div>
              <Typography
                variant="h6"
                style={{ color: "#191919", marginLeft: 9 }}
              >
                Movie Details-
              </Typography>
              <div className="movieDetail__stats">
                <p>Release Date - {content.release_date}</p>
                <p>Runtime - {content.runtime} mins</p>
                <p>Ratings - {content.vote_average}</p>
              </div>
            </div>
            <div></div>
          </div>

          <div>
            <Typography
              variant="h6"
              style={{ color: "#191919", marginLeft: 9 }}
            >
              Celebrities-
            </Typography>
            <Carousel
              id={location.state.id}
              media_type={location.state.media_type}
            />
          </div>
          <div className="movieDetail__buttons">
            <Button
              variant="contained"
              startIcon={<YouTubeIcon />}
              color="secondary"
              target="__blank"
              href={`https://www.youtube.com/watch?v=${video}`}
              className="movieDetail__button"
            >
              Watch the Trailer
            </Button>
            <Button
              variant="contained"
              color="secondary"
              target="__blank"
              href={`${content?.homepage}`}
            >
              Watch the Movie
            </Button>
          </div>
          <Comments
            movieTitle={content.name}
            commentLists={commentLists}
            movieId={location.state.id}
            refreshFunction={updateComment}
          />
        </div>
      </div>
    );
  } else {
    return null;
  }
}

export default MovieDetail;
