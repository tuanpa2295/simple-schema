const _ = require('lodash')
let utils = {
  isPOJO(arg) {
    if (arg == null || typeof arg !== 'object') {
      return false;
    }
    const proto = Object.getPrototypeOf(arg);
    return !proto || proto.constructor.name === 'Object';
  },
  traverse(obj, parentKey) {
    let result;
    if (_.isArray(obj)) {
      let idx = 0;
      result = _.flatMap(obj, function (obj) {
        return utils.traverse(obj, (parentKey + '.' || '') + idx++);
      });
    } else if (_.isPlainObject(obj)) {
      result = _.flatMap(_.keys(obj), function (key) {
        return _.map(utils.traverse(obj[key], key), function (subKey) {
          return (parentKey ? parentKey + '.' : '') + subKey;
        });
      });
    } else {
      result = [];
    }
    return _.concat(result, parentKey || []);
  }
}

module.exports = utils;
