function SchemaType(value) {
  this.type = null;
  this.default = null;
  this.validators = [];
  if (typeof value === 'function') {
    this.type = value;
    this.default = defaultOfType(this.type);
  } else if (typeof value === 'object') {
    this.type = value.type;
    this.default = value.default || defaultOfType(this.type);
  } else {
    throw new Error('Unknown Object Type!');
  }
}

SchemaType.prototype.validate = function (value, options) {
  if (this.type == null) {
    throw new Error('Null schema type!');
  }

  const validators = (options) => {
    const entries = Object.entries(options);
    return entries.map(function (entry) {
      let type = entry[0], value = entry[1];
      return Object.assign({}, { type, value });
    });
  }
  //TODO: implement list of validators
  this.validators = validators(options);
  // this.validators.forEach((validator) => {
  //   validator.cast.call(value, options);
  // })

  switch (this.type) {
    case String:
      return castString(value, options);
    case Array:
      return castArray(value, options);
    case Number:
      return castNumber(value, options);
    case Boolean:
      return castBoolean(value, options);
    default:
      throw new Error('Can not cast value!');
  }
};

function castArray(value, options) {
  if (Array.isArray(this.value)) {
    return new Array(this.value);
  } else {
    return [];
  }
}

function castNumber(value, options) {
  if (options.required) {
    if (value == null) {
      throw new Error('Required field');
    }
  }

  if (options.min) {
    if (value < options.min) {
      throw new Error(`Can not be smaller than ${options.min}`);
    }
  }
  if (options.max) {
    if (value > options.max) {
      throw new Error(`Can not be greater than ${options.max}`);
    }
  }
  if (value == null) {
    return value;
  }
  if (value === '') {
    return null;
  }
  if (typeof value === 'string' || typeof value === 'boolean') {
    value = Number(value);
  }
  if (value instanceof Number) {
    return value;
  }
  if (typeof value === 'number') {
    return value;
  }
  if (!Array.isArray(value) && typeof value.valueOf === 'function') {
    return Number(value.valueOf());
  }

  throw new Error('Not a SchemaNumber type');
}

function castString(value, options) {

  if (value == null) {
    return value;
  }

  if (options && options.match) {
    const matched = new RegExp(options.match).test(value);
    if (!matched) {
      throw new Error(`'${value}' is not matched with regex`);
    }
  }

  if (value.toString &&
    value.toString !== Object.prototype.toString &&
    !Array.isArray(value)) {
    return value.toString();
  }

  throw new Error('Not a SchemaString type');
}

function castBoolean(value, options) {
  if (value === null) {
    return value;
  }
  if ((new Set([true, 'true', 1, '1', 'yes'])).has(value)) {
    return true;
  } else if (new Set([false, 'false', 0, '0', 'no']).has(value)) {
    return false;
  } else {
    throw new Error('Not a SchemaBoolean type');
  }
}

function defaultOfType(type) {
  switch (type) {
    case Number:
      return 0;
    case Function:
      return function () {
      };
    case String:
      return '';
    case Boolean:
      return false;
    case Array:
      return [];
    case Date:
      return new Date();
    case Symbol:
      return Symbol();
    default:
      return undefined;
  }
}

module.exports = SchemaType;
