import styles from "./header.module.scss";
import { Link } from "react-router-dom";
import React from "react";
import LoginForm from "../LoginForm";
import { LanguageContext } from "../../App";
import { useSelector } from "react-redux";

function Header() {
  const [isOpenedLoginForm, setIsOpenedLoginForm] = React.useState(false);
  const { userData } = useSelector((store) => store.user);
  React.useEffect(() => {
    document.body.style.overflow = isOpenedLoginForm ? "hidden" : "unset";
  }, [isOpenedLoginForm]);

  const { isLanguageUkr, toggleLanguage } = React.useContext(LanguageContext);

  const { totalPrice } = useSelector((store) => store.cart);
  return (
    <>
      {isOpenedLoginForm && (
        <LoginForm setIsOpenedLoginForm={setIsOpenedLoginForm} />
      )}
      <header className={styles.header}>
        <div className={styles.wrappLogo}>
          <div className={styles.logo}>
            <img src="/img/Logo.svg" alt="Logo" />
          </div>
          <Link to="/">
            <div className={styles.wrappTitle}>
              <h1>SIZZLE SNACK</h1>
              <h3>
                {isLanguageUkr() ? "Швидко та смачно!" : "Quick and tasty!"}
              </h3>
            </div>
          </Link>
        </div>
        <div className={styles.avatar}>
          <img
            src="/img/avatar.svg"
            alt="Log In"
            className={styles.login}
            onClick={() => {
              setIsOpenedLoginForm(true);
            }}
            title={isLanguageUkr() ? "Увiйти" : "Log in"}
          />
          {!!userData && (
            <Link to="/likedItems">
              <img
                src="/img/fill-heart.svg"
                alt="Liked items"
                title={isLanguageUkr() ? "Улюбленнi страви" : "Favorite dishes"}
              />
            </Link>
          )}
          {!!userData && (
            <Link to="/orderHistory">
              <img
                className={styles.history}
                src="/img/history.svg"
                alt="Order history"
                title={isLanguageUkr() ? "Історія замовлень" : "Order history"}
              />
            </Link>
          )}
          <div className={styles.switch}>
            <input
              id="language-toggle"
              type="checkbox"
              className={`${styles["check-toggle"]} ${styles["check-toggle-round-flat"]}`}
              onClick={() => toggleLanguage()}
              title={
                isLanguageUkr()
                  ? "Переключити мову на Англ"
                  : "Switch language to Ukr"
              }
              checked={isLanguageUkr() ? "" : "checked"}
              onChange={() => toggleLanguage()}
            />
            <label htmlFor="language-toggle"></label>
            <span className={styles.on}>UK</span>
            <span className={styles.off}>EN</span>
          </div>
        </div>
        <Link to="/cart">
          <button className={styles.cart}>
            <p className={styles.price}>{totalPrice} &#8372;</p>
            <img src="/img/cartIcon.svg" alt="" />
          </button>
        </Link>
      </header>
    </>
  );
}

export default Header;
