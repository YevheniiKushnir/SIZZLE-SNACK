import React, { useEffect } from "react";
import Header from "../Header";
import styles from "./history.module.scss";
import HistoryItem from "../HistoryItem";
import api from "../../utils/api";
import { useDispatch, useSelector } from "react-redux";
import { clearOrders, setOrders } from "../../redux/slices/orderSlice";

export const History = () => {
  const dispatch = useDispatch();
  const jwt = useSelector((state) => state.user.jwt);
  const orders = useSelector((state) => state.order.orders);

  useEffect(() => {
    if (!!jwt) {
      api
        .get("/api/orders", {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        })
        .then((response) => {
          dispatch(setOrders(response.data));
        })
        .catch(() => {
          dispatch(clearOrders());
        });
    }
  }, [jwt]);

  return (
    <>
      <Header />
      <div className={styles.wrap}>
        {orders?.map((order) => {
          return <HistoryItem key={order.id} order={order} />;
        })}
      </div>
    </>
  );
};
