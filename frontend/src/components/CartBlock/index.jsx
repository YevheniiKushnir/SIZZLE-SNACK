import React, { useState, useContext } from "react";
import styles from "./cartBlock.module.scss";
import { LanguageContext } from "../../App";
import CartItem from "../CartItem";
import { DeliveryAddress } from "../DeliveryAddress";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearItems } from "../../redux/slices/cartSlice";

function CartBlock() {
  const dispatch = useDispatch();
  const { items, totalAmount, totalPrice } = useSelector((state) => state.cart);
  const [openedModal, setOpenedModal] = useState(false);

  const { isLanguageUkr } = useContext(LanguageContext);

  return (
    <>
      {openedModal && <DeliveryAddress setOpenedModal={setOpenedModal} />}
      <div className={styles.wrapPage}>
        {items.length > 0 ? (
          <div className={styles.contentWrap}>
            <div className={styles.title}>
              <h1>
                <img src="/img/cart.svg" alt="decorPic" />
                {isLanguageUkr() ? "Кошик:" : "Cart:"}
              </h1>
              <h3 onClick={() => dispatch(clearItems())}>
                <img src="/img/delete.svg" alt="decorPic" />
                {isLanguageUkr() ? "Очистити кошик" : "Clear Cart"}
              </h3>
            </div>
            <div className={styles.wrap}>
              {items.map((item, index) => (
                <CartItem key={index} props={item} />
              ))}
            </div>

            <div className={styles.result}>
              <p>
                {isLanguageUkr() ? "Усього товару:" : "Total Items:"}{" "}
                <b>
                  {totalAmount} {isLanguageUkr() ? "шт." : "items"}
                </b>
              </p>
              <p>
                {isLanguageUkr() ? "Сума замовлення:" : "Order Total:"}{" "}
                <b>{totalPrice} &#8372;</b>
              </p>
            </div>
            <div className={styles.btnBlock}>
              <Link to="/">
                <button>&#9668;{isLanguageUkr() ? "Назад" : "Back"}</button>
              </Link>
              <button
                onClick={() => {
                  setOpenedModal(true);
                }}>
                {" "}
                {isLanguageUkr() ? "Замовити зараз" : "Order Now"}&#9658;
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.emptyBlock}>
            <h1>
              {isLanguageUkr()
                ? "На жаль, зараз у вас немає товару :("
                : "Unfortunately, you have no items at the moment :("}
            </h1>
            <div className={styles.linkBlock}>
              <Link to="/">
                <img src="/img/shopping.svg" alt="go Shopping" />
                <h3>
                  {isLanguageUkr() ? "Перейти до продукції" : "Go to Products"}
                </h3>
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default CartBlock;
