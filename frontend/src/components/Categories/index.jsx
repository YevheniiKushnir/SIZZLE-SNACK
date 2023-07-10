import { LanguageContext } from "../../App";
import styles from "./categories.module.scss";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedCategory } from "../../redux/slices/filterSlice";

function Categories() {
  const { categories, selectedCategory } = useSelector((store) => store.filter);
  const dispatch = useDispatch();

  const { isLanguageUkr } = React.useContext(LanguageContext);

  return (
    <nav className={styles.nav}>
      <ul className={styles.list}>
        {categories &&
          categories.map((el, index) => (
            <li
              key={index}
              onClick={() => dispatch(setSelectedCategory(el))}
              className={
                selectedCategory && selectedCategory.title === el.title
                  ? styles.active
                  : null
              }>
              {isLanguageUkr() ? el.titleUkr : el.title}
            </li>
          ))}
      </ul>
    </nav>
  );
}

export default Categories;
