const {Validator} = require('./validator');
class SchemaNumber {
  constructor(value, options) {
    this.value = value && (typeof value !== 'undefined') ? value : null;
    this.defaultValue = options && options.defaultValue && (typeof options.defaultValue !== 'undefined') ? options.defaultValue : null;
    this.required = options && options.required && (typeof options.required !== 'undefined') ? options.required : false;
  }
  cast() {
    if(this.required) {
      if(!Validator.required(this.value, this.required))
        throw new Error('Required value');
    }

    if (this.value == null && this.defaultValue == null) {
      return this.value;
    }

    if (this.value == null && this.defaultValue === false) {
      return this.value;
    }

    if(this.value == null && this.defaultValue) {
      if(typeof this.defaultValue === 'number'){
        return Number(this.defaultValue);
      } else {
        throw new Error('Not a valid default value')
      }
    }

    if (this.value === '') {
      return null;
    }
    if (typeof this.value === 'string' || typeof this.value === 'boolean') {
      this.value = Number(this.value);
    }
    if (this.value instanceof Number) {
      return this.value;
    }
    if (typeof this.value === 'number') {
      return this.value;
    }
    if (!Array.isArray(this.value) && typeof this.value.valueOf === 'function') {
      return Number(this.value.valueOf());
    }

    throw new Error('Not a SchemaNumber type');
  }
  validate() {}
};

class SchemaString {
  constructor(value, options) {
    this.value = value && (typeof value !== 'undefined') ? value : null;
    this.defaultValue = options && options.defaultValue && (typeof options.defaultValue !== 'undefined') ? options.defaultValue : null;
    this.required = options && options.required && (typeof options.required !== 'undefined') ? options.required : false;
  }

  cast() {
    if(this.required) {
      if(!Validator.required(this.value, this.required))
        throw new Error('Required value');
    }

    if(this.required) {
      if(!Validator.required(this.value, this.required))
        throw new Error('Required value');
    }

    if(this.defaultValue && !(typeof this.defaultValue === 'string')) {
      throw new Error('Not a valid default String');
    }

    if (this.value == null && this.defaultValue && typeof this.defaultValue === 'string' && this.defaultValue.trim().length > 0) {
      return this.defaultValue;
    }

    if (this.value == null) {
      return this.value;
    }

    if (this.value.toString &&
      this.value.toString !== Object.prototype.toString &&
      !Array.isArray(this.value)) {
      return this.value.toString();
    }

    throw new Error('Not a SchemaString type');
  }
  validate() {}
}

class SchemaBoolean {
  constructor(value, options) {
    this.value = value && (typeof value !== 'undefined') ? value : null;
    this.defaultValue = options && options.defaultValue && (typeof options.defaultValue !== 'undefined') ? options.defaultValue : null;
    this.required = options && options.required && (typeof options.required !== 'undefined') ? options.required : false;
  }

  cast() {
    if(this.required) {
      if(!Validator.required(this.value, this.required))
        throw new Error('Required value');
    }

    if (this.value === null && this.defaultValue == null) {
      return this.value;
    }

    if (this.value == null && this.defaultValue === false) {
      return this.defaultValue;
    }

    if (this.value == null && this.defaultValue === true) {
      return this.defaultValue;
    }

    if((new Set([true, 'true', 1, '1', 'yes'])).has(this.value)) {
      return true;
    } else if (new Set([false, 'false', 0, '0', 'no']).has(this.value)){
      return false;
    } else {
      throw new Error('Not a SchemaBoolean type');
    }
  }
  validate() {}
}

class SchemaObject {
  constructor(value, options) {
    this.value = value && (typeof value !== 'undefined') ? value : null;
    this.defaultValue = options && options.defaultValue && (typeof options.defaultValue !== 'undefined') ? options.defaultValue : null;
    this.required = options && options.required && (typeof options.required !== 'undefined') ? options.required : false;
  }

  cast() {
    if(this.value) {
      return new Object(this.value);
    } else {
      return {};
    }
  }
  validate() {}
}

class SchemaArray {
  constructor(value, options) {
    this.value = value && (typeof value !== 'undefined') ? value : null;
    this.defaultValue = options && options.defaultValue && (typeof options.defaultValue !== 'undefined') ? options.defaultValue : null;
    this.required = options && options.required && (typeof options.required !== 'undefined') ? options.required : false;
  }

  cast() {
    if(Array.isArray(this.value)) {
      return new Array(this.value);
    } else {
      return [];
    }
  }
  validate() {}
}

module.exports = {
  SchemaBoolean, SchemaNumber, SchemaString, SchemaObject, SchemaArray
};

