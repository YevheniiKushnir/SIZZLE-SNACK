import React, { useState, useEffect } from "react";
import styles from "./styles/main.module.scss";

import { Cart } from "./pages/Cart";
import { Home } from "./pages/Home";
import { LikedItemsPage } from "./pages/LikedItemsPage";
import { History } from "./components/History";
import { NotFound } from "./pages/NotFound";
import { Routes, Route, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  setUser,
  setJWT,
  setUserNull,
  setPreferred,
} from "./redux/slices/userSlice";
import api from "./utils/api";

export const LanguageContext = React.createContext();

function App() {
  const [language, setLanguage] = useState("ukr");
  const user = useSelector((state) => state.user.userData);
  const dispatch = useDispatch();

  function isLanguageUkr() {
    return language === "ukr";
  }
  function toggleLanguage() {
    setLanguage(isLanguageUkr() ? "en" : "ukr");
  }

  const location = useLocation();

  useEffect(() => {
    let jwt = localStorage.getItem("accessToken");

    if (!!jwt && !!!user) {
      api
        .get("/api/user-details", {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        })
        .then((userDetailsResponse) => {
          let { preferred, ...userData } = userDetailsResponse.data;
          dispatch(setJWT(jwt));
          dispatch(setUser(userData));
          dispatch(setPreferred(preferred));
        })
        .catch(() => {
          localStorage.removeItem("accessToken");
          dispatch(setUserNull());
        });
    }

    if (!!!jwt) {
      dispatch(setUserNull());
    }
  }, [location.pathname]);

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, isLanguageUkr, toggleLanguage }}>
      <div className={styles.mainWrapp}>
        <div className={styles.wrapper}>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Home />
                </>
              }
            />
            <Route path="/cart" element={<Cart />} />
            <Route path="/likedItems" element={<LikedItemsPage />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/orderHistory" element={<History />} />
          </Routes>
        </div>
      </div>
    </LanguageContext.Provider>
  );
}

export default App;
