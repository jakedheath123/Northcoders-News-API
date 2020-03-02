exports.formatDates = function(array) {
  const formattedDate = array.map(function(object) {
    const newObject = { ...object };

    const objectDate = object.created_at;
    const updatedDate = new Date(objectDate);
    newObject.created_at = updatedDate;

    return newObject;
  });

  return formattedDate;
};

exports.makeRefObj = function(array) {
  const referenceObject = array.reduce(function titleAndId(object, entry) {
    const idRegex = /id$/g;

    for (let key in entry) {
      const referenceKey = entry["title"];

      if (idRegex.test(key) === true) {
        const referenceValue = entry[key];
        object[referenceKey] = referenceValue;
      }
    }

    return object;
  }, {});

  return referenceObject;
};

exports.formatComments = (comments, articleRef) => {};
