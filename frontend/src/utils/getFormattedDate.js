import moment from "moment";

const getFormattedDate = (dateString) => {
  return moment(dateString).format("DD.MM.YYYY");
};

export default getFormattedDate;
