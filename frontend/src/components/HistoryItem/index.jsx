import React from "react";
import styles from "./historyItem.module.scss";
import { LanguageContext } from "../../App";
import getFormattedDate from "../../utils/getFormattedDate";

function HistoryItem({ order }) {
  const { isLanguageUkr } = React.useContext(LanguageContext);
  const [openedInfo, setOpenedInfo] = React.useState(false);

  return (
    <>
      {openedInfo ? (
        <div className={styles.openedInfo}>
          <div className={styles.mainInfo}>
            <h3 className={styles.data}>{getFormattedDate(order.createdAt)}</h3>
            <div className={styles.info}>
              <h4>
                {`${isLanguageUkr() ? "Номер замовлення:" : "Order number:"} ${
                  order.id
                }`}
              </h4>
              <h2>{`${
                order.isDelivered
                  ? isLanguageUkr()
                    ? "Доставлено"
                    : "Delivered"
                  : order.isDelivering
                  ? isLanguageUkr()
                    ? "У доставці"
                    : "Delivering"
                  : order.isAccepted
                  ? isLanguageUkr()
                    ? "Прийнятий"
                    : "Accepted"
                  : order.isProcessing
                  ? isLanguageUkr()
                    ? "В обробці"
                    : "Processing"
                  : isLanguageUkr()
                  ? "Очікується на обробку"
                  : "Awaits for processing"
              }`}</h2>
            </div>
            <div className={styles.address}>
              <h2>{`${
                isLanguageUkr() ? "Адреса отримувача" : "Recipient's address"
              }`}</h2>
              <h3>{`${order.address.city}, ${order.address.streetAddress}`}</h3>
            </div>
            <div className={styles.price}>
              <h2>
                {order.fullPrice} &#8372; |{" "}
                {`${order.amount} ${isLanguageUkr() ? "шт." : "pcs."}`}
              </h2>
            </div>
            <div className={styles.items}></div>
            <img
              src="/img/droplist1.svg"
              alt="dropdown list"
              className={styles.dropList}
              onClick={() => setOpenedInfo(!openedInfo)}
            />
          </div>
          <hr />
          <div className={styles.moreInfo}>
            {order.products.map((orderItem) => {
              const propertyString = orderItem.attributeValues
                .map((property) =>
                  isLanguageUkr() ? property.valueUkr : property.value
                )
                .join(", ");

              return (
                <div key={orderItem.product.id} className={styles.item}>
                  <img
                    className={styles.itemPic}
                    src={orderItem.product.imageUrl}
                    alt=""
                  />
                  <div className={styles.title}>
                    <h2>
                      {isLanguageUkr()
                        ? orderItem.product.titleUkr
                        : orderItem.product.title}
                    </h2>
                    <h3>{propertyString}</h3>
                  </div>
                  <div className={styles.amount}>
                    {`${orderItem.amount} ${
                      isLanguageUkr() ? "шт." : "pcs."
                    } | ${orderItem.amount * orderItem.pricePerUnit} `}
                    &#8372;
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className={styles.wrap}>
          <h3 className={styles.data}>{getFormattedDate(order.createdAt)}</h3>
          <div className={styles.info}>
            <h4>{`${isLanguageUkr() ? "Номер замовлення" : "Order number"} ${
              order.id
            }`}</h4>
            <h2>{`${
              order.isDelivered
                ? isLanguageUkr()
                  ? "Доставлено"
                  : "Delivered"
                : order.isDelivering
                ? isLanguageUkr()
                  ? "У доставці"
                  : "Delivering"
                : order.isAccepted
                ? isLanguageUkr()
                  ? "Прийнятий"
                  : "Accepted"
                : order.isProcessing
                ? isLanguageUkr()
                  ? "В обробці"
                  : "Processing"
                : isLanguageUkr()
                ? "Очікується на обробку"
                : "Awaits for processing"
            }`}</h2>
          </div>
          <div className={styles.price}>
            <h2>
              {order.fullPrice} &#8372; |{" "}
              {`${order.amount} ${isLanguageUkr() ? "шт." : "pcs."}`}
            </h2>
          </div>
          <div className={styles.items}>
            {order.products.map((orderItem) => {
              return (
                <img
                  key={orderItem.product.id}
                  className={styles.itemPic}
                  src={orderItem.product.imageUrl}
                  alt=""
                />
              );
            })}
          </div>
          <img
            src="/img/droplist1.svg"
            alt="dropdown list"
            className={styles.dropList}
            onClick={() => setOpenedInfo(!openedInfo)}
          />
        </div>
      )}
    </>
  );
}

export default HistoryItem;
