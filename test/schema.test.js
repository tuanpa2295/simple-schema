let assert = require('chai').assert;
let expect = require('chai').expect;
const describe = require('mocha').describe;
const {SchemaNumber, SchemaString, SchemaBoolean, SchemaObject, SchemaArray} = require('../lib/schematype');
const {TSchema} = require('../lib/schema');

describe('createSchema', function() {
  it('should return', function() {
    let schema = new TSchema({
      b: SchemaString,
      c: SchemaNumber
    });
    let generatedObj = schema.create();

    assert.typeOf(generatedObj, 'object');
    expect(generatedObj).to.eql({b: null, c: null});
  });
});

describe('createSchemaWithEmptyArray', function() {
  it('should return', function() {
    let schema1 = new TSchema({
      b: {
        type: SchemaNumber,
        defaultValue: 100
      },
      c: SchemaBoolean,
      v: {
        value: {
          arr: {
            value:[],
            type: SchemaArray,
            defaultValue: 'DEOS ',
          }
        },
        type: SchemaObject
      }
    });

    let generatedObj = schema1.create();
    assert.typeOf(generatedObj, 'object');
    expect(generatedObj).to.eql({b: 100, c: null, v: { arr: []}});
  });
});

describe('createSchemaWithObjectArray', function() {
  it('should return', function() {
    let schema1 = new TSchema({
      b: {
        type: SchemaNumber,
        defaultValue: 100
      },
      c: SchemaBoolean,
      v: {
        value: {
          arr: {
            value:[{b: SchemaNumber}, {c: SchemaString}],
            type: SchemaArray,
            defaultValue: 'DEOS ',
          }
        },
        type: SchemaObject
      }
    });

    let schema = new TSchema({
      b: {
        type: SchemaNumber,
        defaultValue: 100
      },
      c: SchemaBoolean,
      v: {
        value: {
          arr: {
            value:[{b: {type: SchemaString, defaultValue: 'BC'}}, {c: {type: SchemaNumber, defaultValue: 10}}],
            type: SchemaArray,
            defaultValue: 'DEOS ',
          }
        },
        type: SchemaObject
      }
    });

    let generatedObj = schema1.create();
    let generatedObj2 = schema.create();

    assert.typeOf(generatedObj, 'object');
    expect(generatedObj).to.eql({b: 100, c: null, v: { arr: [{b: null}, {c: null}]}});
    expect(generatedObj2).to.eql({b: 100, c: null, v: { arr: [{b: 'BC'}, {c: 10}]}});
  });
});

describe('createSchemaWithSchemaNumberAndSchemaString', function() {
  it('should return', function() {
    let schema = new TSchema({
      a: {
        type: SchemaNumber,
        defaultValue: 10
      },
      b: {
        type: SchemaString,
        defaultValue: 'XXX'
      },
      c: {
        type: SchemaString,
        defaultValue: 'XXX'
      }
    })
    let generatedObj = schema.create();
    assert.typeOf(generatedObj, 'object');
    expect(generatedObj).to.eql({a: 10, b: 'XXX', c: 'XXX'});  });
});

describe('createSchemaWithSchemaWithDeepNested', function() {
  it('should return', function() {
    let schema = new TSchema({
      a: {
        value: {
          g: {
            value: {
              z: {
                type: SchemaString,
                defaultValue: 'DEEP NESTED'
              }
            },
            type: SchemaObject,
            defaultValue: null
          }
        },
        type: SchemaObject,
        defaultValue: null
      },
      b: {
        type: SchemaString,
        defaultValue: 'XXX'
      },
      c: {
        type: SchemaString,
        defaultValue: 'XXX'
      }
    })
    let generatedObj = schema.create();
    assert.typeOf(generatedObj, 'object');
    expect(generatedObj).to.eql({a: {g: { z: 'DEEP NESTED'}}, b: 'XXX', c: 'XXX'});  });
});
