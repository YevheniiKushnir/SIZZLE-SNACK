import React from "react";
import styles from "./pagination.module.scss";
import ReactPaginate from "react-paginate";
import { useSelector, useDispatch } from "react-redux";
import { setItemOffset } from "../../redux/slices/paginationSlice";

function Pagination() {
  const { activePage, pageCount, itemsPerPage, filteredItems } = useSelector(
    (store) => store.pagination
  );
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(setItemOffset(0));
  }, [filteredItems]);

  const handlePageClick = (event) => {
    const newOffset = event.selected * itemsPerPage;
    dispatch(setItemOffset(newOffset));
  };
  return (
    <div className={styles.wrap}>
      <ReactPaginate
        breakLabel="..."
        nextLabel="&#9658;"
        onPageChange={handlePageClick}
        pageRangeDisplayed={8}
        pageCount={pageCount}
        previousLabel="&#9668;"
        renderOnZeroPageCount={null}
        activeClassName={"active"}
        forcePage={activePage}
      />
    </div>
  );
}

export default Pagination;
