// import Validator from './validator';
const {SchemaNumber, SchemaString, SchemaBoolean, SchemaObject, SchemaArray} = require('./schematype');

class TSchema {
  constructor(objSchema, options) {
    this.obj = objSchema;
    this.props = [];
   // this.validators = Object.assign({}, Validator);
    //this.typecasters = Object.assign({}, typecast);
    this.options = this.defaultOptions(options);
    // Object.keys(objSchema).forEach(k => this.path(k, objSchema[k]))
  }
  create() {
    return this.clone(this.obj);
  }

  path(path, rules) {
    const parts = path.split('.');
    const suffix = parts.pop();
    const prefix = parts.join('.');

    // Make sure full path is created
    if (prefix) {
      this.path(prefix);
    }

    // Nested schema
    if (rules instanceof Schema) {
      rules.hook((k, v) => this.path(join(k, path), v));
      return this.path(path, rules.props);
    }
  }
};

TSchema.prototype.clone = function create (obj) {
  let copy;
  // Handle the 3 simple types, and null or undefined
  if (null == obj || "object" != typeof obj) return obj;

  // Handle Array
  if (obj instanceof Array) {
    copy = [];
    for (let i = 0, len = obj.length; i < len; i++) {
      copy[i] = this.clone(obj[i]);
    }
    return copy;
  }

  // Handle Object
  if (obj instanceof Object) {
    copy = {};
    let temp = null;
    let valuetemp = null;
    for (let attr in obj) {
      if (obj.hasOwnProperty(attr)) {
        let options = obj[attr];
        let schemaType = null;
        //console.log(options);
        if(checkSchemaType(options)) {
          schemaType = new options(null, null);
        } else {
          schemaType = new options.type(options.value, options);
        }
        if(obj[attr].value && typeof obj[attr].value === 'object') {
          temp = attr;
          valuetemp = this.clone(obj[attr].value);
        }

        temp = obj[attr].value;
        if(temp) {
          copy[attr] = valuetemp;
        } else {
          copy[attr] = schemaType.cast();
        }
      }
    }
    return copy;
  };

  throw new Error("Unable to copy obj! Its type isn't supported.");
};

function checkSchemaType(objClass) {
  try {
    let obj = new objClass;
    return !!(obj instanceof SchemaBoolean || obj instanceof SchemaNumber || obj instanceof SchemaArray || obj instanceof SchemaObject || obj instanceof SchemaString);
  } catch (err) {
    return false;
  }
}

TSchema.prototype.defaultOptions = function (options) {

 // let opts = Object.keys(options);

};

// let schema = new TSchema({
//   bm: {
//     value:    [
//       {t: {
//         value: {
//           lm: {
//             type: SchemaNumber,
//             defaultValue: 11,
//           }
//         },
//           type: SchemaObject,
//           defaultValue: 'X ',
//         }},
//       {k: {
//           type: SchemaString,
//           defaultValue: 'V ',
//         }},
//       {l: {
//           type: SchemaString,
//           defaultValue: 'DEOS ',
//         }},
//     ],
//     type: SchemaArray,
//     defaultValue: 'DEOS ',
//   }
//   , a: {
//     type: SchemaString,
//     defaultValue: 'Vietnam ',
//     required: false
//   }, b: {
//     type: SchemaNumber,
//     defaultValue: 1000,
//     required: false
//   }, c: {
//     value: {
//       z: {
//         value: {
//           g: {
//             value: {
//               m: {
//                 type: SchemaString,
//                 defaultValue: 'Tuan PA m'
//               }
//             },
//             type: SchemaObject,
//             defaultValue: 2000
//           }
//         },
//         type: SchemaObject,
//         defaultValue: 1700
//       }
//     },
//     type: SchemaBoolean,
//     defaultValue: true
//   }, d: {
//     value:  {
//         e: {
//           value: {
//             f: {
//               value: {
//                 k: {
//                   type: SchemaString,
//                   defaultValue: 'Nguyen Anh Tuan'
//                 }
//               },
//               type: SchemaObject,
//               defaultValue: 'Tuan f'
//             }
//           },
//           type: SchemaObject,
//           defaultValue: 1500
//         }
//     },
//     type: SchemaObject,
//     defaultValue: true
//   }});
//
// let schema1 = new TSchema({
//   b: {
//     type: SchemaNumber,
//     defaultValue: 100
//   },
//   c: SchemaBoolean,
//   v: {
//     value: {
//       arr: {
//         value:[{b: {type: SchemaString, defaultValue: 'BC'}}, {c: {type: SchemaNumber, defaultValue: 10}}],
//         type: SchemaArray,
//         defaultValue: 'DEOS ',
//       }
//     },
//     type: SchemaObject
//   }
// });
//
// console.log('Create', schema1.create().v.arr);

module.exports = {TSchema};




