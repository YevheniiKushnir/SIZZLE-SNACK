export default (text) => {
  const phonePattern = /^(\+\d{1,3})?\d{9}$/m;
  return phonePattern.test(text);
};
