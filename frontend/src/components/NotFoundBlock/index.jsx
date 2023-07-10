import React from "react";
import styles from "./notFoundBlock.module.scss";
import { Link } from "react-router-dom";

export const NotFoundBlock = () => {
  return (
    <div className={styles.wrapp}>
      <img src="/img/pizzaMaster.jpg" alt="Not Found" />
      <h1>Упс! Ми не можемо знайти сторінку, яку ви шукаєте :(</h1>
      <div className={styles.error}>
        <Link to="/">
          {" "}
          <button className={styles.goBack}>
            <p className={styles.price}>Повернутися на головну</p>
            <img src="/img/cartIcon.svg" alt="" />
          </button>
        </Link>
        <img src="/img/404.jpg" alt="Not Found" />
      </div>
    </div>
  );
};
