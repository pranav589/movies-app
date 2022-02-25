import {
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  SwipeableDrawer,
} from "@material-ui/core";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MenuIcon from "@material-ui/icons/Menu";
import MovieIcon from "@material-ui/icons/Movie";
import HomeIcon from "@material-ui/icons/Home";
import TrendingUpIcon from "@material-ui/icons/TrendingUp";
import MovieFilterIcon from "@material-ui/icons/MovieFilter";
import LocalMoviesIcon from "@material-ui/icons/LocalMovies";
import "./SideNav.css";
import { Search } from "@material-ui/icons";

export default function SideNav() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const onClose = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="sideNav">
      <IconButton
        edge="start"
        color="inherit"
        aria-label="open drawer"
        onClick={() => setIsOpen(true)}
      >
        <MenuIcon />
      </IconButton>
      <SwipeableDrawer
        anchor="left"
        open={isOpen}
        onClose={onClose}
        onOpen={() => setIsOpen(true)}
      >
        <div className="drawer">
          <Box
            textAlign="center"
            p={2}
            fontSize={24}
            className="drawer__heading"
          >
            <MovieIcon className="drawer__icon" /> Movies App
          </Box>
          <Divider />
          <List>
            <ListItem button onClick={() => navigate("/")}>
              <ListItemIcon>
                <HomeIcon color="primary" fontSize="large" />
              </ListItemIcon>
              <ListItemText primary={"Trending"} />
            </ListItem>
          </List>
          <List>
            <ListItem button onClick={() => navigate("/movies")}>
              <ListItemIcon>
                <MovieFilterIcon color="primary" fontSize="large" />
              </ListItemIcon>
              <ListItemText primary={"Movies"} />
            </ListItem>
          </List>
          <List>
            <ListItem button onClick={() => navigate("/series")}>
              <ListItemIcon>
                <LocalMoviesIcon color="primary" fontSize="large" />
              </ListItemIcon>
              <ListItemText primary={"Series"} />
            </ListItem>
          </List>
          <List>
            <ListItem button onClick={() => navigate("/search")}>
              <ListItemIcon>
                <Search color="primary" fontSize="large" />
              </ListItemIcon>
              <ListItemText primary={"Search"} />
            </ListItem>
          </List>
        </div>
      </SwipeableDrawer>
    </div>
  );
}
