import React from "react";
import qs from "qs";

import Header from "../components/Header";
import Categories from "../components/Categories";
import SearchBlock from "../components/SearchBlock";
import ProductList from "../components/ProductList";

import { LanguageContext } from "../App";
import {
  setCategories,
  setSelectedCategory,
  setSelectedSort,
  setOpenedItem,
} from "../redux/slices/filterSlice";
import { setItems } from "../redux/slices/productListSlice";
import api from "../utils/api";
import {
  setFilteredItems,
  setLoading,
  setActivePage,
} from "../redux/slices/paginationSlice";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

export const Home = React.memo(() => {
  const {
    selectedSort,
    selectedCategory,
    searchValue,
    sort,
    categories,
    openedItem,
  } = useSelector((store) => store.filter);
  const { activePage } = useSelector((store) => store.pagination);
  const { items } = useSelector((store) => store.productList);
  const { language, isLanguageUkr, setLanguage } =
    React.useContext(LanguageContext);
  const [isReadytoLoad, setIssReadytoLoad] = React.useState(false);
  const [isLoadingCategory, setIsLoadingCategory] = React.useState(false);
  const isMounted = React.useRef(0);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    setIsLoadingCategory(true);
    api
      .get("/api/categories")
      .then((res) => {
        const titles = res.data.map((item) => ({
          title: item.title,
          titleUkr: item.titleUkr,
        }));
        dispatch(setCategories(titles));
        setIsLoadingCategory(false);
        isMounted.current = 0;
      })
      .catch((er) => {
        console.log(er);
      });
  }, []);
  React.useEffect(() => {
    if (!isLoadingCategory && categories.length > 1) {
      const params = new URLSearchParams(location.search);
      const sortBy = params.get("sortBy");
      const categoryBy = params.get("categoryBy");
      const slugLink = params.get("items");
      const lang = params.get("language");
      const page = params.get("page");
      const sortParam = sort.find((obj) => obj.name === sortBy);
      const categoryParam = categories.find((obj) => obj.title === categoryBy);

      dispatch(setSelectedCategory(categoryParam || selectedCategory));
      dispatch(setSelectedSort(sortParam || selectedSort));
      dispatch(setOpenedItem(slugLink));
      setLanguage(lang || "ukr");
      setIssReadytoLoad(true);
    }
  }, [isLoadingCategory, location.search]);
  React.useEffect(() => {
    window.scrollTo(0, 0);
    if (isReadytoLoad) {
      dispatch(setLoading(true));
      const categoryBy =
        selectedCategory.title === "All"
          ? ""
          : `category=${selectedCategory.title}`;

      const orderBy = `orderby=${
        isLanguageUkr() && selectedSort.propertyUkr
          ? selectedSort.propertyUkr
          : selectedSort.property
      }`;

      api
        .get(`/api/products?${categoryBy}&${orderBy}`)
        .then((res) => {
          dispatch(setItems(res.data));
          dispatch(setLoading(false));
        })
        .catch((er) => console.log(er));
    }
  }, [selectedCategory, selectedSort, isReadytoLoad]);
  React.useEffect(() => {
    dispatch(
      setFilteredItems(
        items
          .filter((obj) => obj.stock > 0)
          .filter((obj) => {
            const searchKey = isLanguageUkr() ? "titleUkr" : "title";
            const categoryBy =
              selectedCategory.title === "All"
                ? true
                : obj.category.title === selectedCategory.title;
            return (
              (searchValue === "" ||
                obj[searchKey]
                  .toLocaleLowerCase()
                  .includes(searchValue.toLocaleLowerCase())) &&
              categoryBy
            );
          })
      )
    );
  }, [searchValue, selectedCategory, items]);
  React.useEffect(() => {
    if (isReadytoLoad && isMounted.current >= 2) {
      const queryParams = {
        language: language,
        page: activePage + 1,
        categoryBy: selectedCategory.title,
        sortBy: selectedSort.name,
      };
      if (openedItem) {
        queryParams.items = openedItem;
      }
      const queryStr = qs.stringify(queryParams);

      navigate(`?${queryStr}`);
    }

    if (isMounted.current === 5) {
    } else {
      isMounted.current++;
    }
  }, [
    selectedCategory,
    selectedSort,
    language,
    activePage,
    openedItem,
    isReadytoLoad,
  ]);

  return (
    <>
      <Header />
      <Categories />
      <SearchBlock />
      <ProductList />
    </>
  );
});
