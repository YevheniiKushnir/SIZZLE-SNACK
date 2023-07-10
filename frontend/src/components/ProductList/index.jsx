import React from "react";
import { LanguageContext } from "../../App";
import styles from "./productList.module.scss";
import Product from "../Product";
import Pagination from "../Pagination";
import Skeleton from "../Product/Skeleton";
import { useSelector, useDispatch } from "react-redux";
import {
  setCurrentItems,
  setActivePage,
} from "../../redux/slices/paginationSlice";
import { Alert } from "react-bootstrap";

function ProductList() {
  const { isLanguageUkr } = React.useContext(LanguageContext);
  const { filteredItems, isLoading, itemsPerPage, currentItems, itemOffset } =
    useSelector((store) => store.pagination);
  const preferred = useSelector((state) => state.user.preferred);
  const dispatch = useDispatch();

  const [showAlert, setShowAlert] = React.useState(false);

  React.useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  React.useEffect(() => {
    dispatch(
      setCurrentItems(
        filteredItems.slice(itemOffset, itemOffset + itemsPerPage)
      )
    );
  }, [itemOffset, filteredItems]);

  return (
    <>
      {showAlert && (
        <Alert variant="success" className={styles.alert}>
          <img src="/img/doneOrder.webp" alt="" />
          <p>{isLanguageUkr() ? "Товар додано" : "Item added"}</p>
        </Alert>
      )}
      <div className={styles.wrapperContent}>
        {isLoading
          ? [...new Array(currentItems.length || itemsPerPage)].map(
              (_, index) => {
                return <Skeleton key={index} />;
              }
            )
          : currentItems.map((obj) => {
              return (
                <Product
                  key={obj.id}
                  inPreferred={preferred?.some((item) => item.id === obj.id)}
                  setShowAlert={setShowAlert}
                  {...obj}
                />
              );
            })}
      </div>
      <Pagination />
    </>
  );
}

export default ProductList;
