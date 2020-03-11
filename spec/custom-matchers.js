const identity = x => x;

const checkIsDescending = (array, func = identity) => {
  for (let i = 1; i < array.length; i++) {
    if (func(array[i - 1]) < func(array[i])) return false;
  }
  return true;
};

const checkIsAscending = (array, func = identity) => {
  for (let i = 1; i < array.length; i++) {
    if (func(array[i - 1]) > func(array[i])) return false;
  }
  return true;
};

module.exports = { checkIsAscending, checkIsDescending };
