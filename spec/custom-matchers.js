const checkPairWise = (array, iteratee, additionalData) => {
    for (let i = 1; i < array.length; i++) {
      if (iteratee(array[i - 1], array[i], additionalData)) return false;
    }
    return true;
  };
  ​
  const checkIsDescending = (array, info = {}) => {
    const { key, shouldBeNumbers } = info;
    return checkPairWise(
      array,
      (previous, current, { key, shouldBeNumbers }) => {
        previous = previous[key] || previous;
        current = current[key] || current;
        return shouldBeNumbers ? +previous < +current : previous < current ? true : false;
      },
      { shouldBeNumbers, key }
    );
  };
  ​
  const checkIsAscending = (array, info = {}) => {
    const { key, shouldBeNumbers } = info;
    return checkPairWise(
      array,
      (previous, current, { key, shouldBeNumbers }) => {
        previous = previous[key] || previous;
        current = current[key] || current;
        return shouldBeNumbers ? +previous > current : previous > current ? true : false;
      },
      { shouldBeNumbers, key }
    );
  };
  ​
  module.exports = { checkIsAscending, checkIsDescending };