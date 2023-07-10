import React, { useState, useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setJWT, setPreferred } from "../../redux/slices/userSlice";
import { setUser, setUserNull } from "../../redux/slices/userSlice";
import styles from "./loginForm.module.scss";
import { LanguageContext } from "../../App";
import api from "../../utils/api";
import checkPhone from "../../utils/checkPhone";
import checkEmail from "../../utils/checkEmail";
import { Alert } from "react-bootstrap";

const PASSWORDLENGTH = 8;

function LoginForm({ setIsOpenedLoginForm }) {
  const dispatch = useDispatch();

  const [activePart, setActivePart] = useState(0);
  const [isChecked, setIsChecked] = useState(false);
  const [editProfile, setEditProfile] = useState(false);
  const [userNameValue, setUserNameValue] = useState("");
  const [password, setPassword] = useState("");

  const { jwt, userData } = useSelector((store) => store.user);
  const { firstName, lastName, email, phoneNumber } = userData || {};
  const [addresses, setAddresses] = useState(userData?.addresses);
  const [emailValue, setEmailValue] = useState(email);
  const [firstN, setFirstName] = useState(firstName);
  const [lastN, setLastName] = useState(lastName);
  const [phoneValue, setPhoneValue] = useState(phoneNumber);
  const [newPassword, setNewPassword] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertContent, setAlertContent] = useState("");
  const { isLanguageUkr } = useContext(LanguageContext);

  useEffect(() => {
    if (
      alertContent === "Інформація змінена" ||
      alertContent === "Information updated"
    ) {
      if (showAlert) {
        const timer = setTimeout(() => {
          setShowAlert(false);
        }, 2000);

        return () => clearTimeout(timer);
      }
    } else {
      if (showAlert) {
        const timer = setTimeout(() => {
          setShowAlert(false);
        }, 7000);

        return () => clearTimeout(timer);
      }
    }
  }, [showAlert]);

  const handleLoginClick = (event) => {
    event.preventDefault();
    let userCred = {};
    if (checkPhone(userNameValue)) {
      userCred["phoneNumber"] = userNameValue;
    } else {
      if (checkEmail(userNameValue)) {
        userCred["email"] = userNameValue;
      } else {
        setAlertContent(
          isLanguageUkr()
            ? "Будь ласка, введіть правильний логiн: або номер телефону у форматі +380********* або вашу електронну адресу."
            : "Please enter a valid login: either a phone number in the format +380********* or your email address."
        );
        setShowAlert(true);
        return;
      }
    }

    if (password.length < PASSWORDLENGTH) {
      setAlertContent(
        isLanguageUkr()
          ? `Пароль занадто короткий. Мінімальна довжина - ${PASSWORDLENGTH} символів.`
          : `Password is too short. Minimum length is ${PASSWORDLENGTH} characters.`
      );
      setShowAlert(true);
      return;
    }

    api
      .post("/api/login", {
        ...userCred,
        password: password,
      })
      .then((response) => {
        let jwt = response.data.accessToken;
        localStorage.setItem("accessToken", jwt);
        dispatch(setJWT(jwt));

        api
          .get("/api/user-details", {
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          })
          .then((userDetailsResponse) => {
            let { preferred, ...userData } = userDetailsResponse.data;
            dispatch(setUser(userData));
            dispatch(setPreferred(preferred));
            setIsOpenedLoginForm(false);
          });
      })
      .catch((err) => {
        setAlertContent(
          isLanguageUkr()
            ? "Помилка авторизації. Невірні облікові дані."
            : "Authorization error. Incorrect credentials."
        );
        setShowAlert(true);
      });
  };

  const handleRegisterClick = (event) => {
    event.preventDefault();
    let userCred = {};
    if (checkPhone(userNameValue)) {
      userCred["phoneNumber"] = userNameValue;
    } else {
      if (checkEmail(userNameValue)) {
        userCred["email"] = userNameValue;
      } else {
        setAlertContent(
          isLanguageUkr()
            ? "Будь ласка, введіть правильний логiн: або номер телефону у форматі +380********* або вашу електронну адресу."
            : "Please enter a valid login: either a phone number in the format +380********* or your email address."
        );
        setShowAlert(true);
        return;
      }
    }

    if (password.length < PASSWORDLENGTH) {
      setAlertContent(
        isLanguageUkr()
          ? `Пароль занадто короткий. Мінімальна довжина - ${PASSWORDLENGTH} символів.`
          : `Password is too short. Minimum length is ${PASSWORDLENGTH} characters.`
      );
      setShowAlert(true);
      return;
    }

    api
      .post("/api/register", {
        ...userCred,
        password: password,
      })
      .then((response) => {
        let jwt = response.data.accessToken;
        localStorage.setItem("accessToken", jwt);
        dispatch(setJWT(jwt));

        api
          .get("/api/user-details", {
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          })
          .then((userDetailsResponse) => {
            let { preferred, ...userData } = userDetailsResponse.data;
            dispatch(setUser(userData));
            dispatch(setPreferred(preferred));
            setIsOpenedLoginForm(false);
          });
      })
      .catch((err) => {
        setAlertContent(
          isLanguageUkr()
            ? "На жаль, сталася помилка під час реєстрації. Будь ласка, спробуйте ще раз."
            : "Unfortunately, an error occurred during registration. Please try again."
        );
        setShowAlert(true);
      });
  };

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  const handleSaveChangesClick = () => {
    if (phoneValue && !checkPhone(phoneValue)) {
      setAlertContent(
        isLanguageUkr()
          ? "Перевірка номера телефону не пройшла. Будь ласка, введіть дійсний номер телефону у форматі +380********* або *********."
          : "Phone validation failed. Please enter a valid phone number in the format +380********* or *********."
      );
      setShowAlert(true);
      return;
    }

    if (emailValue && !checkEmail(emailValue)) {
      setAlertContent(
        isLanguageUkr()
          ? "Будь ласка, введіть коректну електронну адресу."
          : "Please enter a valid email address."
      );
      setShowAlert(true);
      return;
    }

    if (!!newPassword) {
      if (newPassword.length < PASSWORDLENGTH) {
        setAlertContent(
          isLanguageUkr()
            ? `Пароль занадто короткий. Мінімальна довжина - ${PASSWORDLENGTH} символів.`
            : `Password is too short. Minimum length is ${PASSWORDLENGTH} characters.`
        );
        setShowAlert(true);
        return;
      }
      api.put(
        "api/password-change",
        {
          newPassword: newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
            "Content-Type": "application/json",
          },
        }
      );
    }

    dispatch(
      setUser({
        firstName: firstN,
        lastName: lastN,
        email: emailValue,
        phoneNumber: phoneValue,
        addresses: addresses,
      })
    );
    setEditProfile(false);
    setShowAlert(true);
    setAlertContent(
      isLanguageUkr() ? "Інформація змінена" : "Information updated"
    );
    api
      .put(
        "/api/user-details",
        {
          firstName: firstN,
          lastName: lastN,
          email: emailValue,
          phoneNumber: phoneValue,
          addresses: addresses,
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
            ? "Помилка оновлення профілю. Будь ласка, спробуйте ще раз."
            : "Profile update error. Please try again."
        );
        setShowAlert(true);
      });
  };

  const handleLogoutClick = () => {
    localStorage.removeItem("accessToken");
    dispatch(setUserNull());
    setIsOpenedLoginForm(false);
  };

  const handleAddAddressClick = () => {
    setAddresses([
      ...addresses,
      {
        streetAddress: "",
        city: "",
        zipCode: "",
      },
    ]);
  };

  const handleDeleteAddressClick = (index) => {
    setAddresses(addresses?.filter((address, i) => i !== index));
  };

  const handleCityChange = (value, index) => {
    setAddresses(
      addresses?.map((address, i) => {
        if (i === index) {
          return { ...address, city: value };
        }
        return address;
      })
    );
  };

  const handleStreetAddressChange = (value, index) => {
    setAddresses(
      addresses?.map((address, i) => {
        if (i === index) {
          return { ...address, streetAddress: value };
        }
        return address;
      })
    );
  };

  const handleZipCodeChange = (value, index) => {
    setAddresses(
      addresses?.map((address, i) => {
        if (i === index) {
          return { ...address, zipCode: value };
        }
        return address;
      })
    );
  };

  return (
    <div className={styles.wrap}>
      <div
        className={styles.background}
        onClick={() => {
          setIsOpenedLoginForm(false);
        }}
      ></div>
      {showAlert && (
        <Alert variant="success" className={styles.alert}>
          {alertContent === "Інформація змінена" ||
          alertContent === "Information updated" ? (
            <img src="/img/done.svg" alt="" />
          ) : (
            <img src="/img/errorAlert.svg" alt="" />
          )}
          <p>{alertContent}</p>
        </Alert>
      )}
      <div className={styles.contentWrapper}>
        <div className={styles.content}>
          {userData == null ? (
            <form action="">
              <div
                className={`${styles.registration} ${
                  activePart === 0 ? styles.active : ""
                } ${styles.contentBlock}`}
                onClick={() => setActivePart(0)}
              >
                <h1>{isLanguageUkr() ? "Реєстрація" : "Registration"}</h1>
                <label>
                  {isLanguageUkr()
                    ? "Введіть номер телефону чи ел. пошту"
                    : "Enter your phone number or email"}
                  <input
                    onChange={(event) => setUserNameValue(event.target.value)}
                    type="login"
                  />
                </label>
                <label>
                  {isLanguageUkr()
                    ? "Введіть свій пароль"
                    : "Enter your password"}
                  <input
                    onChange={(event) => setPassword(event.target.value)}
                    type={isChecked ? "text" : "password"}
                  />
                  <label>
                    {isLanguageUkr() ? "Відобразити пароль" : "Show password"}
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={handleCheckboxChange}
                    />
                  </label>
                </label>
                <button onClick={handleRegisterClick}>
                  {isLanguageUkr() ? "Зареєструватися" : "Register"}
                </button>
              </div>
              <div
                className={`${styles.authorization} ${
                  activePart === 1 ? styles.active : ""
                } ${styles.contentBlock}`}
                onClick={() => setActivePart(1)}
              >
                <h1>{isLanguageUkr() ? "Авторизація" : "Authorization"}</h1>
                <label>
                  {isLanguageUkr()
                    ? "Введіть номер телефону чи ел. пошту"
                    : "Enter your phone number or email"}
                  <input
                    onChange={(event) => setUserNameValue(event.target.value)}
                    type="login"
                  />
                </label>
                <label>
                  {isLanguageUkr()
                    ? "Введіть свій пароль"
                    : "Enter your password"}
                  <input
                    onChange={(event) => setPassword(event.target.value)}
                    type={isChecked ? "text" : "password"}
                  />
                  <label>
                    {isLanguageUkr() ? "Відобразити пароль" : "Show password"}
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={handleCheckboxChange}
                    />
                  </label>
                </label>
                <button onClick={handleLoginClick}>
                  {isLanguageUkr() ? "Увійти" : "Login"}
                </button>
              </div>
            </form>
          ) : (
            <form
              action=""
              className={styles.userInfo}
              onSubmit={(event) => event.preventDefault()}
            >
              <h1>
                {`${isLanguageUkr() ? "Профіль" : "Profile"}: `}
                {editProfile ? (
                  <>
                    <input
                      value={firstN}
                      onChange={(event) => setFirstName(event.target.value)}
                      placeholder={isLanguageUkr() ? "Ім'я" : "Name"}
                      type="text"
                    />
                    <input
                      value={lastN}
                      onChange={(event) => setLastName(event.target.value)}
                      placeholder={isLanguageUkr() ? "Прізвище" : "Surname"}
                      type="text"
                    />
                  </>
                ) : (
                  `${firstN} ${lastN}`
                )}
              </h1>
              <label>
                {`${isLanguageUkr() ? "Ваш email" : "Your email"}: `}
                {editProfile ? (
                  <input
                    value={emailValue}
                    onChange={(event) => {
                      if (editProfile) {
                        setEmailValue(event.target.value);
                      }
                    }}
                    placeholder={isLanguageUkr() ? "Email" : "Email"}
                    type="email"
                  />
                ) : (
                  <span>{email}</span>
                )}
              </label>
              <label>
                {`${
                  isLanguageUkr() ? "Ваш номер телефону" : "Your phone number"
                }: `}
                {editProfile ? (
                  <input
                    value={phoneValue}
                    onChange={(event) => setPhoneValue(event.target.value)}
                    placeholder={
                      isLanguageUkr() ? "Номер телефону" : "Phone number"
                    }
                    type="tel"
                  />
                ) : (
                  <span>{phoneNumber}</span>
                )}
              </label>
              {editProfile && (
                <label>
                  {isLanguageUkr() ? "Новий пароль" : "New password"}
                  <input
                    onChange={(event) => setNewPassword(event.target.value)}
                    type="password"
                  />
                </label>
              )}
              <div className={styles.addressBlock}>
                {addresses?.map((address, index) => {
                  return (
                    <label key={index} className={styles.address}>
                      <div className={styles.header}>
                        {`${
                          isLanguageUkr()
                            ? `Адреса доставки №${index + 1}`
                            : `Delivery Address №${index + 1}`
                        }:`}
                        {editProfile && (
                          <div onClick={() => handleDeleteAddressClick(index)}>
                            <img src="/img/delete.svg" alt="decorPic" />
                            {isLanguageUkr()
                              ? "Видалити адресу"
                              : "Delete Address"}
                          </div>
                        )}
                      </div>
                      {editProfile ? (
                        <div className={styles.inputs}>
                          <div className={styles.wrapInputs}>
                            <input
                              className={styles.zip}
                              value={address.zipCode}
                              onChange={(event) =>
                                handleZipCodeChange(event.target.value, index)
                              }
                              placeholder={
                                isLanguageUkr() ? "Код міста" : "City Code"
                              }
                              type="number"
                            />{" "}
                            <input
                              value={address.city}
                              onChange={(event) =>
                                handleCityChange(event.target.value, index)
                              }
                              placeholder={isLanguageUkr() ? "Місто" : "City"}
                              type="text"
                            />
                          </div>
                          <input
                            value={address.streetAddress}
                            onChange={(event) =>
                              handleStreetAddressChange(
                                event.target.value,
                                index
                              )
                            }
                            placeholder={
                              isLanguageUkr()
                                ? "Адреса: вул., буд, кв."
                                : "Address: str., bldg., apt."
                            }
                            type="text"
                          />
                        </div>
                      ) : (
                        <>
                          <p>
                            {address.zipCode} {address.city},
                          </p>
                          <p>{address.streetAddress}</p>
                        </>
                      )}
                    </label>
                  );
                })}
                {editProfile && (
                  <button
                    onClick={handleAddAddressClick}
                    className={styles.addAddressBtn}
                  >
                    {isLanguageUkr() ? "Додати адресу" : "Add address"}
                  </button>
                )}
              </div>
              <div className={styles.btnBlock}>
                {editProfile ? (
                  <button onClick={handleSaveChangesClick}>
                    {isLanguageUkr() ? "Зберегти зміни" : "Save Changes"}
                  </button>
                ) : (
                  <button onClick={() => setEditProfile(true)}>
                    {isLanguageUkr() ? "Редагувати профіль" : "Edit Profile"}
                  </button>
                )}
                <button onClick={handleLogoutClick}>
                  {isLanguageUkr() ? "Вийти" : "Sign Out"}
                </button>
              </div>
            </form>
          )}
        </div>
        <img
          onClick={() => setIsOpenedLoginForm(false)}
          src="/img/closeImg.svg"
          alt="Close"
          className={styles.close}
        />
      </div>
    </div>
  );
}

export default LoginForm;
