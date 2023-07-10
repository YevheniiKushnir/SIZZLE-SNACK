import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LanguageContext } from "../../App";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import isObjectEmpty from "../../utils/isObjectEmpty";
import { clearItems } from "../../redux/slices/cartSlice";
import checkPhone from "../../utils/checkPhone";
import containsDigits from "../../utils/containsDigits";
import styles from "./deliveryAddress.module.scss";
import { Alert } from "react-bootstrap";
import { setUser } from "../../redux/slices/userSlice";

export const DeliveryAddress = ({ setOpenedModal }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isLanguageUkr } = useContext(LanguageContext);
  const { jwt, userData } = useSelector((store) => store.user);
  const { items } = useSelector((state) => state.cart);

  const [selectedAddress, setSelectedAddress] = useState({});
  const [anonUser, setAnonUser] = useState(userData || {});
  const [showAlert, setShowAlert] = useState(false);
  const [alertContent, setAlertContent] = useState("");

  const [checkedSaveAddress, setCheckedSaveAddress] = useState(false);
  const [checkedSaveInfoUser, setCheckedSaveInfoUser] = useState(false);

  useEffect(() => {
    if (
      userData === null ||
      userData.addresses === null ||
      userData.addresses.length === 0
    ) {
      setSelectedAddress({});
    } else {
      setSelectedAddress(userData.addresses[0]);
    }
  }, []);

  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 7000);

      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  const handlePayNowClick = () => {
    if (!selectedAddress.zipCode || selectedAddress.zipCode.length < 5) {
      setAlertContent(
        isLanguageUkr()
          ? "Перевірка коду міста не пройшла. Будь ласка, введіть значення довжиною 5 або більше символів."
          : "Zip code validation failed. Please enter a value with a length of 5 or more characters."
      );
      setShowAlert(true);
      return;
    }

    if (!selectedAddress.city) {
      setAlertContent(
        isLanguageUkr()
          ? "Перевірка міста не пройшла. Будь ласка, введіть значення міста."
          : "City validation failed. Please enter city values."
      );
      setShowAlert(true);
      return;
    }

    if (!selectedAddress.streetAddress) {
      setAlertContent(
        isLanguageUkr()
          ? "Перевірка адреси не пройшла. Будь ласка, введіть значення адреси."
          : "Street address validation failed. Please enter street address values."
      );
      setShowAlert(true);
      return;
    }

    if (!anonUser.firstName || containsDigits(anonUser.firstName)) {
      setAlertContent(
        isLanguageUkr()
          ? "Перевірка імені не пройшла. Будь ласка, введіть ваше ім'я."
          : "Name validation failed. Please enter your name."
      );
      setShowAlert(true);
      return;
    }
    if (!anonUser.lastName || containsDigits(anonUser.lastName)) {
      setAlertContent(
        isLanguageUkr()
          ? "Перевірка прізвища не пройшла. Будь ласка, введіть ваше прізвище."
          : "Last name validation failed. Please enter your last name."
      );
      setShowAlert(true);
      return;
    }
    if (
      !anonUser.phoneNumber ||
      (anonUser.phoneNumber && !checkPhone(anonUser.phoneNumber))
    ) {
      setAlertContent(
        isLanguageUkr()
          ? "Перевірка номера телефону не пройшла. Будь ласка, введіть дійсний номер телефону у форматі +380********* або *********."
          : "Phone validation failed. Please enter a valid phone number in the format +380********* or *********."
      );
      setShowAlert(true);
      return;
    }

    if (!!userData) {
      let newUserData = {};

      if (checkedSaveAddress) {
        newUserData.addresses = [
          ...anonUser?.addresses.filter(
            (address) => address.id !== selectedAddress.id
          ),
          selectedAddress,
        ];
      }

      if (
        checkedSaveInfoUser ||
        (!!!userData.firstName && !!!userData.lastName)
      ) {
        newUserData = {
          ...anonUser,
          addresses: [
            ...anonUser?.addresses.filter(
              (address) => address.id !== selectedAddress.id
            ),
            selectedAddress,
          ],
        };
      }

      if (!isObjectEmpty(newUserData)) {
        dispatch(setUser({ ...newUserData }));
        api
          .put(
            "/api/user-details",
            {
              ...newUserData,
            },
            {
              headers: {
                Authorization: `Bearer ${jwt}`,
                "Content-Type": "application/json",
              },
            }
          )
          .then((response) => {
            console.log(response);
          })
          .catch((err) => {
            setAlertContent(
              isLanguageUkr()
                ? "Помилка при оновленні даних користувача. Будь ласка, перевірте правильність заповнення полів."
                : "Error in updating user data. Please check the correctness of the fields."
            );
            setShowAlert(true);
          });
      }
    }

    let formattedData = {
      address: selectedAddress,
      products: items.map((item) => ({
        slug: item.product.slug,
        amount: item.amount,
        attributeValues: item.properties,
      })),
    };

    if (!!!userData) {
      formattedData.user = { ...anonUser };
    }

    if (
      !!jwt ||
      (!isObjectEmpty(formattedData.user) &&
        !isObjectEmpty(formattedData.address))
    ) {
      api
        .post(
          "/api/orders",
          formattedData,
          jwt
            ? {
                headers: {
                  Authorization: `Bearer ${jwt}`,
                },
              }
            : {}
        )
        .then((response) => {
          dispatch(clearItems());
          navigate("/");
          setShowAlert(false);
        });
    } else {
      setAlertContent(
        isLanguageUkr()
          ? "Помилка, замовлення не створено. Перевірте правильність заповнення полів."
          : "Error, the order was not created. Please check the correctness of the fields."
      );
      setShowAlert(true);
    }
  };

  const handleAddressClick = (address) => {
    setSelectedAddress(address);
  };

  const handleCityChange = (value) => {
    setSelectedAddress({ ...selectedAddress, city: value });
  };

  const handleStreetAddressChange = (value) => {
    setSelectedAddress({ ...selectedAddress, streetAddress: value });
  };

  const handleZipCodeChange = (value) => {
    setSelectedAddress({ ...selectedAddress, zipCode: value });
  };

  const handleFirstNameChange = (value) => {
    setAnonUser({ ...anonUser, firstName: value });
  };

  const handleLastNameChange = (value) => {
    setAnonUser({ ...anonUser, lastName: value });
  };

  const handlePhoneNumberChange = (value) => {
    setAnonUser({ ...anonUser, phoneNumber: value });
  };

  return (
    <div className={styles.wrap}>
      <div
        className={styles.background}
        onClick={() => {
          setOpenedModal(false);
        }}></div>
      {showAlert && (
        <Alert variant="success" className={styles.alert}>
          <img src="/img/errorAlert.svg" alt="error img" />
          <p>{alertContent}</p>
        </Alert>
      )}
      <div className={styles.contentWrapper}>
        <div className={styles.content}>
          <div className={userData ? styles.mainInfo : styles.main}>
            <div className={styles.left}>
              {userData ? (
                <>
                  {" "}
                  <h1>{isLanguageUkr() ? "Ваші адреси" : "Your addresses"}:</h1>
                  <div className={styles.addressBlock}>
                    {userData?.addresses?.map((address) => {
                      return (
                        <div
                          key={address.id}
                          onClick={() => handleAddressClick(address)}
                          className={styles.address}
                          style={
                            address.streetAddress ===
                              selectedAddress.streetAddress &&
                            address.zipCode === selectedAddress.zipCode
                              ? { opacity: 1, backgroundColor: "#f2b138" }
                              : {}
                          }>
                          <h3>{address.streetAddress}</h3>
                          <div className={styles.city}>
                            <p>{address.zipCode}</p>
                            <p>{address.city}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <>
                  <h1>{isLanguageUkr() ? "Доставити на" : "Deliver to"}:</h1>
                  <div className={styles.inputsBlock}>
                    <label className={styles.zip}>
                      {isLanguageUkr() ? "Код міста" : "City Code"}:
                      <input
                        value={selectedAddress.zipCode || ""}
                        type="number"
                        onChange={(event) => {
                          handleZipCodeChange(event.target.value);
                        }}
                      />
                    </label>
                    <label className={styles.city}>
                      {isLanguageUkr() ? "Місто" : "City"}:
                      <input
                        onChange={(event) =>
                          handleCityChange(event.target.value)
                        }
                        value={selectedAddress.city || ""}
                        type="text"
                      />
                    </label>
                    <label>
                      {isLanguageUkr()
                        ? "Адреса: вул., буд, кв."
                        : "Address: str., bldg., apt."}
                      :
                      <input
                        onChange={(event) =>
                          handleStreetAddressChange(event.target.value)
                        }
                        value={selectedAddress.streetAddress || ""}
                        type="text"
                      />
                    </label>
                  </div>
                </>
              )}
            </div>
            <div className={styles.right}>
              {userData ? (
                <>
                  <h1>{isLanguageUkr() ? "Доставити на" : "Deliver to"}:</h1>
                  <div className={styles.inputsBlock}>
                    <label className={styles.zip}>
                      {isLanguageUkr() ? "Код міста" : "City Code"}:
                      <input
                        value={selectedAddress.zipCode || ""}
                        type="number"
                        onChange={(event) => {
                          handleZipCodeChange(event.target.value);
                        }}
                      />
                    </label>
                    <label className={styles.city}>
                      {isLanguageUkr() ? "Місто" : "City"}:
                      <input
                        onChange={(event) =>
                          handleCityChange(event.target.value)
                        }
                        value={selectedAddress.city || ""}
                        type="text"
                      />
                    </label>
                    <label>
                      {isLanguageUkr()
                        ? "Адреса: вул., буд, кв."
                        : "Address: str., bldg., apt."}
                      :
                      <input
                        onChange={(event) =>
                          handleStreetAddressChange(event.target.value)
                        }
                        value={selectedAddress.streetAddress || ""}
                        type="text"
                      />
                    </label>
                  </div>
                  <h1>
                    {isLanguageUkr() ? "Доставити кому" : "Deliver to whom"}:
                  </h1>
                  <div className={styles.personInfo}>
                    <label>
                      {isLanguageUkr() ? "Ім'я" : "Name"}
                      <input
                        type="text"
                        value={anonUser?.firstName || ""}
                        onChange={(event) => {
                          handleFirstNameChange(event.target.value);
                        }}
                      />
                    </label>
                    <label>
                      {isLanguageUkr() ? "Прізвище" : "Surname"}
                      <input
                        type="text"
                        value={anonUser?.lastName || ""}
                        onChange={(event) => {
                          handleLastNameChange(event.target.value);
                        }}
                      />
                    </label>
                    <label className={styles.tel}>
                      {isLanguageUkr()
                        ? "Ваш номер телефону"
                        : "Your phone number"}
                      <input
                        type="tel"
                        value={anonUser?.phoneNumber || ""}
                        onChange={(event) => {
                          handlePhoneNumberChange(event.target.value);
                        }}
                      />
                    </label>
                  </div>

                  <div className={styles.checkbox}>
                    <label>
                      <input
                        type="checkbox"
                        checked={checkedSaveAddress}
                        onChange={(event) =>
                          setCheckedSaveAddress(event.target.checked)
                        }
                      />
                      {isLanguageUkr() ? "Оновити адресу" : "Update address"}
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={checkedSaveInfoUser}
                        onChange={(event) =>
                          setCheckedSaveInfoUser(event.target.checked)
                        }
                      />
                      {isLanguageUkr()
                        ? "Оновити контактну інформацію"
                        : "Update contact information"}
                    </label>
                  </div>
                </>
              ) : (
                <>
                  <h1>
                    {isLanguageUkr() ? "Доставити кому" : "Deliver to whom"}:
                  </h1>
                  <div className={styles.personInfo}>
                    <label>
                      {isLanguageUkr() ? "Ім'я" : "Name"}
                      <input
                        type="text"
                        value={anonUser?.firstName || ""}
                        onChange={(event) => {
                          handleFirstNameChange(event.target.value);
                        }}
                      />
                    </label>
                    <label>
                      {isLanguageUkr() ? "Прізвище" : "Surname"}
                      <input
                        type="text"
                        value={anonUser?.lastName || ""}
                        onChange={(event) => {
                          handleLastNameChange(event.target.value);
                        }}
                      />
                    </label>
                    <label className={styles.tel}>
                      {isLanguageUkr()
                        ? "Ваш номер телефону"
                        : "Your phone number"}
                      <input
                        type="tel"
                        value={anonUser?.phoneNumber || ""}
                        onChange={(event) => {
                          handlePhoneNumberChange(event.target.value);
                        }}
                      />
                    </label>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className={styles.btn}>
            <button onClick={handlePayNowClick}>
              {isLanguageUkr() ? "Оформити замовлення" : "Place an order"}
            </button>
          </div>
        </div>
        <img
          onClick={() => setOpenedModal(false)}
          src="/img/closeImg.svg"
          alt="Close"
          className={styles.close}
        />
      </div>
    </div>
  );
};
