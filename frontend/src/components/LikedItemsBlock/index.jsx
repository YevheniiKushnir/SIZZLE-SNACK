import styles from "./likedItemsBlock.module.scss";
import { useSelector, useDispatch } from "react-redux";
import Product from "../Product";
import { useEffect, useState } from "react";

function LikedItems() {
  const preferred = useSelector((state) => state.user.preferred);
  const [preferredProducts, setPreferredProducts] = useState([]);

  useEffect(() => {
    setPreferredProducts(preferred);
  }, [preferred]);

  return (
    <div className={styles.wrap}>
      {preferredProducts.map((obj) => {
        return <Product key={obj.id} inPreferred={true} {...obj} />;
      })}
    </div>
  );
}

export default LikedItems;
