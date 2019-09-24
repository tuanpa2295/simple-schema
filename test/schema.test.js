const assert = require('chai').assert;
const expect = require('chai').expect;
const SchemaType = require('../lib/schemaType');
const { traverse, isPOJO } = require('../lib/utils');
const describe = require('mocha').describe;
const { Schema } = require('../lib/schema');
const _ = require('lodash');

describe('test create schema', function () {
  it('should return traversed paths', function () {
    let schema1 = new Schema({
      b: String,
      c: Number
    });

    let obj1 = schema1.create();
    let traversedPaths = traverse(obj1);

    assert.typeOf(obj1, 'object');
    expect(traversedPaths).to.eql(['b', 'c']);
    assert.typeOf(schema1.getSchemaTypeOfPath('b').type, 'function');
    expect(obj1).to.eql({ b: '', c: 0 });
  });

  it('should return created empty schema with types', function () {
    let schema2 = new Schema({
      b: Number,
      c: String,
      d: Boolean,
      e: Array
    });

    let obj2 = schema2.create();
    expect(obj2).to.eql({ b: 0, c: '', d: false, e: [] });
  });

  it('should return created schema with validation values passed in', function () {
    let schema3 = new Schema({
      b: { type: Number, min: 20, max: 50, default: 25 },
      c: { type: String },
      d: Boolean,
      e: Array
    });

    let obj3 = schema3.create();

    expect(obj3).to.eql({ b: 25, c: '', d: false, e: [] });

  });

  it('should return schema type of path', function () {


  });
});


describe('create schema with nested object', function () {
  let schema = new Schema({
    b: String,
    c: {
      d: {
        e: {
          type: Number
        }, f: {
          g: [{ s: String }]
        }
      }
    }
  });
  let generatedObj = schema.create();

  it('should return traversed path', function () {
    let traversedPaths = traverse(generatedObj);
    expect(traversedPaths).to.eql(['b', 'c.d.e', 'c.d.f.g.0.s', 'c.d.f.g.0', 'c.d.f.g', 'c.d.f', 'c.d', 'c']);
  });

  it('should return generated empty object', function () {
    assert.typeOf(generatedObj, 'object');
    expect(generatedObj).to.eql({ b: '', c: { d: { e: 0, f: { g: [{ s: '' }] } } } });
  });


});

describe('create schema with empty array', function () {
  it('should return', function () {
    let schema1 = new Schema({
      b: Number,
      c: String,
      v: Array
    });

    let generatedObj = schema1.create();
    assert.typeOf(generatedObj, 'object');
    expect(generatedObj).to.eql({ b: 0, c: '', v: [] });
  });
});

describe('create schema with array of objects', function () {
  let schema1 = new Schema({
    a: String,
    b: { c: { d: String, e: [{ f: String }] } }
  });

  let uncasedObj = { a: 100, b: { c: { d: 100, e: [{ f: 1000 }, { f: 100 }, { f: 150000 }] } } }

  let obj = schema1.create();

  it('should return traversed paths', function () {
    let traversedPaths = traverse(obj);
    assert.typeOf(obj, 'object');
    expect(traversedPaths).to.eql(['a', 'b.c.d', 'b.c.e.0.f', 'b.c.e.0', 'b.c.e', 'b.c', 'b']);
    expect(obj).to.eql({ a: '', b: { c: { d: '', e: [{ f: '' }] } } });
  });
  it('should return casted object', function () {
    let casted = schema1.cast(uncasedObj);
    expect(casted).to.eql({ a: '100', b: { c: { d: '100', e: [{ f: '1000' }, { f: '100' }, { f: '150000' }] } } });
  })

});

describe('test schema validation', function () {
  it('should return normal', function () {
    let schema = new Schema({ title: String, author: [{ firstName: [{ s: String, g: String }], lastName: { type: Number, min: 20, max: 30, required: true } }] });
    let obj = { title: 'Gone with the wind', author: [{ firstName: [{ s: 'Nam', g: 'Tuan' }, { s: 'Nghia', g: 'Nam' }], lastName: 25 }] };

    let generatedObj = schema.cast(obj);

    assert.typeOf(generatedObj, 'object');
    expect(generatedObj).to.eql(generatedObj, obj);
  });

  let schema = new Schema({ title: String, author: [{ firstName: [{ s: String, g: { type: String, match: '^[a-z][a-z0-9_\\.]{5,32}@[a-z0-9]{2,}(\\.[a-z0-9]{2,4}){1,2}$' } }], lastName: { type: Number, min: 20, max: 30, required: true } }] });

  it('should return validated string match', function () {
    let obj = { title: 'Gone with the wind', author: [{ firstName: [{ s: 100, g: 'tuanpa@gmail.com' }, { s: 150, g: 'tuanpa@gmail.com' }], lastName: 25 }] };
    let shouldReturnedObj = { title: 'Gone with the wind', author: [{ firstName: [{ s: '100', g: 'tuanpa@gmail.com' }, { s: '150', g: 'tuanpa@gmail.com' }], lastName: 25 }] };
    let generatedObj = schema.cast(obj);

    assert.typeOf(generatedObj, 'object');
    expect(generatedObj).to.eql(generatedObj, shouldReturnedObj);
  });

  it('should return error string match', function () {
    let obj = { title: 'Gone with the wind', author: [{ firstName: [{ s: 100, g: 'tuanpa@gmail.com' }, { s: 150, g: 'tuanpa' }], lastName: 25 }] };
    let schemaType = new SchemaType(String);

    //console.log('Object', _.get(obj, 'author.0.firstName.1.g'));

    //expect(schemaType.validate.call(schemaType, _.get(obj, 'author.0.firstName.1.g'), { match: '^[a-z][a-z0-9_\\.]{5,32}@[a-z0-9]{2,}(\\.[a-z0-9]{2,4}){1,2}$' })).to.throw(Error);
  });
});


