const objectService = {
  resolvePath: function (path, object=self) {
    if (path === undefined || path === null || path === '') {
      return undefined;
    }

    let properties = Array.isArray(path) ? path : path.split('.');
    return properties.reduce((previousValue, currentValue) => previousValue?.[currentValue], object);
  },
  getFirstProperty: function (object) {
    return Object.values(object)[0];
  }
}

export default objectService;
