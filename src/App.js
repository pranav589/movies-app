import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/Header/Header";

import Movies from "./Pages/Movies/Movies";
import Series from "./Pages/Series/Series";
import Trending from "./Pages/Trending/Trending";
import Search from "./Pages/Search/Search";
import { Container } from "@material-ui/core";
import MovieDetail from "./Pages/MoviedDetail/MovieDetail";
import Login from "./Pages/Login/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Register from "./Pages/Register/Register";
import { useContext } from "react";
import { AuthContext } from "./context/auth-provider";
import WatchList from "./Pages/WatchList/WatchList";
import PrivateRoute from "./PrivateRoute";

function App() {
  const { user } = useContext(AuthContext);
  return (
    <>
      <Header />
      <div className="app">
        <Container>
          <Routes>
            <Route index element={<Trending />} />
            <Route path="/detail/:id" element={<MovieDetail />} />
            <Route path="/login" element={!user ? <Login /> : <Trending />} />
            <Route
              path="/register"
              element={!user ? <Register /> : <Trending />}
            />

            <Route path="/movies" element={<Movies />} />
            <Route path="/series" element={<Series />} />
            <Route path="/search" element={<Search />} />
            <Route
              path="/watchlist"
              element={
                <PrivateRoute>
                  <WatchList />
                </PrivateRoute>
              }
            />
          </Routes>
        </Container>
      </div>
      <ToastContainer />
    </>
  );
}

export default App;
