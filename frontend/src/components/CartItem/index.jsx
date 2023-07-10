import styles from "./cartItem.module.scss";
import { LanguageContext } from "../../App";
import { useSelector, useDispatch } from "react-redux";

import React from "react";
import {
  addPoduct,
  removeProduct,
  deleteProduct,
} from "../../redux/slices/cartSlice";

function CartItem({ props }) {
  const { product, properties, amount, price } = props;
  const { isLanguageUkr } = React.useContext(LanguageContext);
  const dispatch = useDispatch();
  const propertyString = Object.values(properties)
    .map((property) => (isLanguageUkr() ? property.valueUkr : property.value))
    .join(", ");

  return (
    <div className={styles.wrap}>
      <img className={styles.itemPic} src={product.imageUrl} alt="" />
      <div className={styles.title}>
        <h2>{isLanguageUkr() ? product.titleUkr : product.title}</h2>
        <h3>{propertyString}</h3>
      </div>
      <div className={styles.count}>
        <img
          src="/img/minus.svg"
          alt="subtrahend"
          onClick={() => dispatch(removeProduct(props))}
        />
        <p>{amount}</p>
        <img
          src="/img/plus.svg"
          alt="added"
          onClick={() => dispatch(addPoduct(props))}
        />
      </div>
      <div className={styles.price}>{price * amount} &#8372;</div>
      <img
        src="/img/clearSearch.svg"
        alt="delete"
        onClick={() => dispatch(deleteProduct(props))}
      />
    </div>
  );
}

export default CartItem;
