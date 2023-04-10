const arrayService = {
  hasDuplicateValues: function (array) {
    let hasDuplicate = array.some((value, index) => array.indexOf(value) !== index);

    return hasDuplicate;
  },
  sortAscending: function (array, objectKey = undefined, nestedObjectKey = undefined) {
    array = array.sort((a, b) => {
      if (objectKey) {
        a = a[objectKey];
        b = b[objectKey];

        if (nestedObjectKey) {
          a = a[nestedObjectKey];
          b = b[nestedObjectKey];
        }
      }

      if (a < b) {
        return -1;
      }

      if (a > b) {
        return 1;
      }

      return 0;
    });

    return array;
  },
  sortDescending: function (array, objectKey = undefined, nestedObjectKey = undefined) {
    array = array.sort((a, b) => {
      if (objectKey) {
        a = a[objectKey];
        b = b[objectKey];

        if (nestedObjectKey) {
          a = a[nestedObjectKey];
          b = b[nestedObjectKey];
        }
      }

      if (a > b) {
        return -1;
      }

      if (a < b) {
        return 1;
      }

      return 0;
    });

    return array;
  }
}

export default arrayService;
