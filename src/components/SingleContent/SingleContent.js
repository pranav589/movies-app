import { img_300, unavailable } from "../../config/config";
import "./SingleContent.css";
import ContentModal from "../ContentModal/ContentModal";
import { useNavigate, Link } from "react-router-dom";

const SingleContent = ({ id, poster, title, date, media_type }) => {
  const navigate = useNavigate();
  const handleDetail = () => {
    navigate(`/detail/${id}`, {
      state: { id, poster, title, date, media_type },
    });
  };
  // console.log(navigate);
  return (
    <div className="singleContent" onClick={handleDetail}>
      <img
        className="poster"
        src={poster ? `${img_300}${poster}` : unavailable}
        alt={title}
      />
      <b className="title">{title}</b>
      <span className="subTitle">
        {media_type === "tv" ? "TV Series" : "Movie"}
        <span className="subTitle">{date}</span>
      </span>
    </div>
  );
};

export default SingleContent;
