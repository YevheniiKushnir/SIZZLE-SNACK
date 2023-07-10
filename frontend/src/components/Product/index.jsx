import styles from "./product.module.scss";
import React, { useState } from "react";

import OpenedCard from "../OpenedCard";
import { LanguageContext } from "../../App";
import { useSelector, useDispatch } from "react-redux";
import api from "../../utils/api";
import { setPreferred } from "../../redux/slices/userSlice";

function Product(props) {
  const {
    title,
    titleUkr,
    imageUrl,
    description,
    descriptionUkr,
    price,
    slug,
    inPreferred,
  } = props;
  const { openedItem } = useSelector((state) => state.filter);
  const [isPreferred, setIsPreferred] = useState(inPreferred);
  const preferred = useSelector((state) => state.user.preferred);
  const { currentItems } = useSelector((store) => store.pagination);
  const user = useSelector((state) => state.user.userData);
  const jwt = useSelector((state) => state.user.jwt);

  const dispatch = useDispatch();

  const [openItem, setOpenItem] = useState(openedItem === props.slug);
  const { isLanguageUkr } = React.useContext(LanguageContext);

  //Если будет скролл - будет дергаться при открытие фул информации
  React.useEffect(() => {
    document.body.style.overflow = openItem ? "hidden" : "unset";
  }, [openItem]);

  const handleAddToPreferred = () => {
    setIsPreferred(true);
    api.post(
      "/api/preferred",
      { slug: slug },
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    let selectedProduct = currentItems.find((item) => item.slug === slug);
    dispatch(setPreferred([selectedProduct, ...preferred]));
  };

  const handleRemoveFromPreferred = () => {
    setIsPreferred(false);
    api.delete("/api/preferred", {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      data: { slug: slug },
    });
    let preferredCopy = preferred.filter((item) => item.slug !== slug);
    dispatch(setPreferred([...preferredCopy]));
  };

  ///img/unLike.svg, а если лайкнутая /img/like.svg
  return (
    <>
      {openItem && <OpenedCard setOpenItem={setOpenItem} {...props} />}
      <div className={styles.wrapp}>
        {!!user &&
          (isPreferred ? (
            <img
              onClick={handleRemoveFromPreferred}
              className={styles.like}
              src={"/img/like.svg"}
              alt="like/like"
            />
          ) : (
            <img
              onClick={handleAddToPreferred}
              className={styles.like}
              src={"/img/unLike.svg"}
              alt="like/unlike"
            />
          ))}
        <img
          src={imageUrl}
          alt="Product image"
          onClick={() => {
            setOpenItem(true);
          }}
        />
        <h3>{isLanguageUkr() ? titleUkr : title}</h3>
        <h5>{isLanguageUkr() ? descriptionUkr : description}</h5>
        <div className={styles.addBlock}>
          <h3>
            {isLanguageUkr() ? "вiд" : "from"} {price} &#8372;
          </h3>
          <button
            className={styles.add}
            onClick={() => {
              setOpenItem(true);
            }}>
            {isLanguageUkr() ? "Купити" : "Buy"}
          </button>
        </div>
      </div>
    </>
  );
}

export default Product;
