exports.formatDates = function(array) {
  const formattedDate = array.map(function(object) {
    const newObject = { ...object };

    const date = object.created_at;
    const updatedDate = new Date(date);
    newObject.created_at = updatedDate;

    return newObject;
  });

  return formattedDate;
};

exports.makeRefObj = function(array) {
  const referenceObject = array.reduce(function titleAndId(object, entry) {
    for (let key in entry)
      if (key === "article_id") {
        const referenceKey = entry["title"];
        const valueKey = entry[key];
        object[referenceKey] = valueKey;
      }

    return object;
  }, {});

  return referenceObject;
};

exports.formatComments = (array, articleRef) => {
  const copyArray = [...array];
  const formattedComments = exports
    .formatDates(copyArray)
    .map(function(comments) {
      const newComments = { ...comments };

      for (let key in articleRef)
        if (newComments.belongs_to === key) {
          newComments.belongs_to = articleRef[key];
        }
      newComments["article_id"] = newComments["belongs_to"];
      delete newComments["belongs_to"];
      newComments["author"] = newComments["created_by"];
      delete newComments["created_by"];

      return newComments;
    });

  return formattedComments;
};
