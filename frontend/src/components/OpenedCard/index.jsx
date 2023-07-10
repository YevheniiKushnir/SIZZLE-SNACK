import { LanguageContext } from "../../App";
import styles from "./openedCard.module.scss";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setOpenedItem } from "../../redux/slices/filterSlice";
import { addPoduct } from "../../redux/slices/cartSlice";

function OpenedCard({
  setOpenItem,
  title,
  titleUkr,
  imageUrl,
  description,
  descriptionUkr,
  price,
  category,
  slug,
  setShowAlert,
}) {
  const { isLanguageUkr } = React.useContext(LanguageContext);
  const dispatch = useDispatch();
  const { currentItems } = useSelector((store) => store.pagination);
  const [selectedProperties, setSelectedProperties] = React.useState({});

  const properties = Object.values(
    category.attributes.reduce((acc, item) => {
      if (!acc[item.title]) {
        acc[item.title] = {
          title: item.title,
          titleUkr: item.titleUkr,
          values: [],
        };
      }
      acc[item.title].values.push({
        value: item.value,
        valueUkr: item.valueUkr,
        priceAddition: item.priceAddition,
      });
      return acc;
    }, {})
  );

  React.useEffect(() => {
    if (Object.keys(selectedProperties).length === 0) {
      const newSelectedProperties = {};
      properties.forEach((property) => {
        newSelectedProperties[property.title] = {
          value: property.values[0].value,
          valueUkr: property.values[0].valueUkr,
          priceAddition: property.values[0].priceAddition,
        };
      });
      setSelectedProperties(newSelectedProperties);
    }
    dispatch(setOpenedItem(slug));
  }, []);

  function resultPrice() {
    const prices = Object.values(selectedProperties).map(
      (property) => property.priceAddition
    );
    const totalPrice = prices.reduce((acc, price) => acc + price, 0);

    return price + totalPrice;
  }

  function closeOpenedItem() {
    setOpenItem(false);
    dispatch(setOpenedItem(""));
  }

  function addItemToCart() {
    const item = {
      product: currentItems.find((item) => item.slug === slug),
      properties: selectedProperties,
      price: resultPrice(),
    };
    dispatch(addPoduct(item));
    dispatch(setOpenedItem(""));
    setShowAlert(true);
    setOpenItem(false);
  }

  return (
    <div className={styles.wrappOpened}>
      <div className={styles.background} onClick={closeOpenedItem}></div>
      <div className={styles.content}>
        <img
          onClick={closeOpenedItem}
          className={styles.close}
          src="/img/closeImg.svg"
          alt="Close"
        />
        <img src={imageUrl} alt="Product" />
        <div className={styles.info}>
          <div className={styles.mainProperties}>
            <h1>{isLanguageUkr() ? titleUkr : title}</h1>
            <h3>{isLanguageUkr() ? descriptionUkr : description}</h3>
          </div>
          {properties.map((property, propertyIndex) => {
            const selectedValue = selectedProperties[property.title]?.value;
            return (
              <div
                className={styles.anotherProperties}
                key={propertyIndex + property.titleUkr}>
                <p>
                  {isLanguageUkr()
                    ? property.titleUkr + ":"
                    : property.title + ":"}
                </p>
                <ul key={propertyIndex}>
                  {property.values.map((value, index) => {
                    const isSelected =
                      selectedValue && selectedValue === value.value;
                    return (
                      <li
                        key={index + value.value}
                        className={isSelected ? styles.active : ""}
                        onClick={() => {
                          setSelectedProperties((prevState) => ({
                            ...prevState,
                            [property.title]: value,
                          }));
                        }}>
                        {isLanguageUkr() ? value.valueUkr : value.value}
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
          <div className={styles.buy}>
            <h3>{isLanguageUkr() ? "Додати до кошику:" : "Add to cart:"}</h3>
            <button className={styles.add} onClick={addItemToCart}>
              <p className={styles.price}>{resultPrice()} &#8372;</p>
              <img src="/img/cartIcon.svg" alt="" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OpenedCard;
