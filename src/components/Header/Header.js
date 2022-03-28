import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import SideNav from "../SideNav/SideNav";
import "./Header.css";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import "./Header.css";
import { AuthContext } from "../../context/auth-provider";
import axios from "axios";
import { toast } from "react-toastify";

const useStyles = makeStyles((theme) => ({
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    cursor: "pointer",
  },
}));

const Header = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  const [inputSearch, setInputSearch] = useState("");

  const onClose = () => {
    setVisible(false);
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    const res = await axios.get(
      "https://webapp-movie.herokuapp.com/api/users/logout"
    );
    if (res.status === 200) {
      navigate("/");
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      setUser(false);
      toast.success("Logout success!");
    } else {
      toast.error("Operation Failed");
    }
  };

  const classes = useStyles();

  return (
    <div className="header">
      <AppBar position="static">
        <Toolbar>
          <SideNav
            visible={visible}
            setVisible={setVisible}
            onClose={onClose}
          />
          <Typography
            variant="h6"
            className={classes.title}
            onClick={() => navigate("/")}
          >
            Movies App
          </Typography>
          {!user ? (
            <div>
              <Button color="inherit" onClick={() => navigate("/login")}>
                Login
              </Button>
              <Button color="inherit" onClick={() => navigate("/register")}>
                Register
              </Button>
            </div>
          ) : (
            <div>
              <Button color="inherit" onClick={() => navigate("/watchlist")}>
                WatchList
              </Button>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Header;
