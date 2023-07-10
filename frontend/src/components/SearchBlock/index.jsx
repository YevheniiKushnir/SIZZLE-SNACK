import { LanguageContext } from "../../App";
import { SearchContext } from "../../pages/Home";

import styles from "./searchBlock.module.scss";

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setSelectedSort,
  setSearchValue,
} from "../../redux/slices/filterSlice";

import debounce from "lodash.debounce";

function SearchBlock() {
  const [isOpen, setIsOpen] = React.useState(false);
  const { isLanguageUkr } = React.useContext(LanguageContext);
  const { sort, selectedSort, searchValue } = useSelector(
    (store) => store.filter
  );
  const dispatch = useDispatch();
  const inputRef = React.useRef();
  const [value, setValue] = React.useState("");

  const onChangeInput = (event) => {
    setValue(event.target.value);
    updateInput(event.target.value);
  };

  const updateInput = React.useCallback(
    debounce((str) => {
      dispatch(setSearchValue(str));
    }, 600),
    []
  );

  const sortRef = React.useRef();

  React.useEffect(() => {
    const clickOutsidePopup = (event) => {
      if (!event.composedPath().includes(sortRef.current)) {
        setIsOpen(false);
      }
    };
    document.body.addEventListener("click", clickOutsidePopup);

    return () => {
      document.body.removeEventListener("click", clickOutsidePopup);
    };
  }, []);

  return (
    <div className={styles.content}>
      <div className={styles.title}>
        <h3>{isLanguageUkr() ? "Сортувати за:" : "Sort by:"}</h3>
        <div className={styles.sort} ref={sortRef}>
          <h3 onClick={() => setIsOpen(!isOpen)}>
            {isLanguageUkr() ? selectedSort.nameUkr : selectedSort.name}
          </h3>
          {isOpen && (
            <ul>
              {sort.map((el, index) => (
                <li
                  key={index}
                  onClick={() => {
                    dispatch(setSelectedSort(el));
                    setIsOpen(!isOpen);
                  }}
                  className={
                    selectedSort.property === el.property ? styles.active : null
                  }>
                  {isLanguageUkr() ? el.nameUkr : el.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className={styles.search}>
        <img className={styles.search} src="/img/searchIcon.svg" alt="Search" />
        <input
          ref={inputRef}
          type="text"
          placeholder={isLanguageUkr() ? "Пошук..." : "Search..."}
          value={value}
          onChange={(event) => {
            onChangeInput(event);
          }}
        />
        {searchValue && (
          <img
            className={styles.clear}
            src="/img/clearSearch.svg"
            alt="clear Input"
            onClick={() => {
              dispatch(setSearchValue(""));
              setValue("");
              inputRef.current.focus();
            }}
          />
        )}
      </div>
    </div>
  );
}

export default SearchBlock;
