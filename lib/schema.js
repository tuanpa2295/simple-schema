const SchemaType = require('./schemaType');
const { traverse, isPOJO } = require('./utils');
const _ = require('lodash');

function Schema(obj, options = null) {
  this.obj = {};
  this.keys = Object.keys(obj);
  this.listNodes = []
  this.strict = options && options.strict ? options.strict : null;
  this.paths = []

  for (let key of this.keys) {
    this.obj[key] = new SchemaType(obj[key]);
  }
  this.listNodes = this.iterateWalk(obj);
  console.log(JSON.stringify(this.listNodes));
  this.paths = this.getPaths(this.listNodes);
}

Schema.prototype.getPaths = function () {
  let paths = [];
  for (let node of this.listNodes) {
    if (node.hasOwnProperty('path')) {
      paths = paths.concat(node.path);
    }
  }
  return paths;
}


Schema.prototype.cast = function (obj) {
  const returnedObj = {}
  let paths = traverse(obj);

  for (let path of paths) {
    let standardizedPath = path.replace(/\d+/g, '0');
    let objValue = _.get(returnedObj, path, null);

    if (objValue == null) {
      let schemaTypeOptions = this.getSchemaTypeOfPath(standardizedPath);
      let schemaType = new SchemaType(schemaTypeOptions.type);
      _.set(returnedObj, path, schemaType.validate(_.get(obj, path), schemaTypeOptions.options));
    }
  }
  return returnedObj;
}

Schema.prototype.getSchemaTypeOfPath = function (path) {
  for (let node of this.listNodes) {
    let newPath = path.replace(/\d+/g, '0');

    if (node.path === newPath) {
      return { type: node.schemaType.type, options: node.options };
    }
  }
  return null;
}

Schema.prototype.create = function () {
  let obj = {};
  for (let node of this.listNodes) {
    _.set(obj, node.path, node.schemaType.default);
  }
  return obj;
};

Schema.prototype.iterateWalk = function (obj, prefix) {
  let listNodes = [];
  prefix = prefix || '';

  for (let key of Object.keys(obj)) {
    const path = prefix + key;
    let value = obj[key];
    if (Array.isArray(value)) {
      if (value.length === 0) {
        let node = { path: path, schemaType: new SchemaType(Array) };
        listNodes = listNodes.concat(node);
      } else {
        if (value[0] == null) {
          throw new Error('Invalid array path!')
        } else {
          let node = { path: path, schemaType: new SchemaType(Array) };
          listNodes = listNodes.concat(node);
          listNodes = listNodes.concat(this.iterateWalk(value, path + '.'));
        }
      }
    } else if (isPOJO(value) && !obj[key].hasOwnProperty('type')) {
      if (Object.keys(value).length > 0) {
        listNodes = listNodes.concat(this.iterateWalk(value, path + '.'));
      }
    } else {
      let nested = false;
      let node = { path: path, schemaType: new SchemaType(value), options: {} };
      if (path.split('.').length > 1) {
        node['nested'] = nested;
      }
      //TODO: Change to validator list
      if (value.hasOwnProperty('required')) {
        node.options['required'] = value.required;
      }

      if (value.hasOwnProperty('min')) {
        node.options['min'] = value.min;
      }
      if (value.hasOwnProperty('max')) {
        node.options['max'] = value.max;
      }
      if (value.hasOwnProperty('match')) {
        node.options['match'] = value.match;
      }
      listNodes = listNodes.concat(node);
    }
  }
  return listNodes;
}

Schema.prototype.checkReservedAttr = function (attr) {
  return ['required', 'type', 'min', 'max'].includes(attr);
}

module.exports = { Schema };
