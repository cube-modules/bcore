var Class = require('../class');
var Utils = require('./../utils');
var expect = require('expect.js');

describe('class.js', function () {

  it('expect create a class extend Class', function () {
    var Test = Class.extend();
    var test = new Test;
    expect(Test).to.be.a('function');
    expect(test instanceof Class).to.be(true);
  });

  it('expect create a class with specified prototype', function () {
    var Test = Class.extend({
      hello: function (msg) {
        return msg;
      }
    });
    var test = new Test;
    expect(test.hello('hello')).to.be('hello');
  });

  it('expect create a class with specified constructor', function () {
    var Test = Class.extend(function Test(a, b) {this.value = a + b;});
    var test = new Test(1,2);
    expect(test instanceof Test).to.be(true);
    expect(test.value).to.be(3);
  });

  it('expect create a class extend another class, with constructor', function () {
    var TestClassA = Class.extend(function TestClassA(a, b) {
      this.value = a + b;
    });
    var TestClassB = TestClassA.extend(function TestClassB(a, b, c) {
      this._super.apply(this, [a, b]);
      this.sum = a + b + c;
    });
    var test = new TestClassB(1, 2, 3);
    expect(test instanceof TestClassB);
    expect(test instanceof TestClassA);
    expect(test.constructor).to.be(TestClassB);
    expect(test.value).to.be(3);
    expect(test.sum).to.be(6);
  });

  it('expect override function ok', function () {
    var TestClassA = Class.extend(function TestClassA(a, b) {this.value = a + b}, {
      test: function (msg) {
        return msg;
      }
    });
    var TestClassB = TestClassA.extend(
      function TestClassB(a, b, c) {
        this._super.apply(this, [a, b]);
        this.sum = a + b + c;
      },
      {
        test: function (msg, msg2) {
          return msg + msg2;
        }
      }
    );
    var testb = new TestClassB(1,2,3);
    var testa = new TestClassA(5, 6);
    expect(testb.value).to.be(3);
    expect(testb.sum).to.be(6);
    expect(testa.value).to.be(11);
    expect(testa.sum).to.be(undefined);
    // check override function
    expect(testa.test('h')).to.be('h');
    expect(testb.test('h', 'ello')).to.be('hello');
    // check if super class prototype function is ok
    expect(TestClassA.prototype.test.length).to.be(1);
  });
});

describe('utils.js', function () {
  /////////////////////////////////// utils 测试 ///////////////////////////////////
   it('expect deepMerge, "dest: object, source: undefined" be ok', function () {
     var dest = {
       a:1
      };
      var merged = Utils.deepMerge(dest, undefined);
      expect(JSON.stringify(merged)).to.be(JSON.stringify(dest));
    });

   it('expect deepMerge, "dest: object, source contains undefined" be ok', function () {
      var dest = {
        a: 2,
        b: 3
      };
      var merged = Utils.deepMerge(dest, {
        a: undefined,
        b: undefined
      });
      console.log(merged, 'merged')
      expect(JSON.stringify(merged)).to.be(JSON.stringify(dest));
    });

   it('expect deepMerge, "dest: object_object, source object_object" be ok', function () {
      var dest = {
        a:{
          b: 2,
          c: 3
        }
      };
      var source = {
        a: {
          b: 1,
        }
      };
      var merged = Utils.deepMerge(dest, source);
      expect(JSON.stringify(merged)).to.be(JSON.stringify({
        a:{
          b: 1,
          c: 3
        }
      }));
    });

    it('expect deepMerge function  be ok', function () {
      var dest = {
        a: function(a){return a + 1;},
        b: function(a){return a + 2;}
      };
      var source = {
        b: function(a){return a;},
      }
      var result = Utils.deepMerge(dest, source);
      var func = result.b;
      expect(func(22)).to.be(22);
    });

   it('expect deepMerge, "dest: object, source deepObject" be ok', function () {
      var dest = {
        a:{
          b: 2,
          c: {
            d:{
              e: 1,
              c: 2
            }
          }
        }
      };
      var source = {
        a:{
          b: 3,
          c: {
            d:{
              e: 2
            }
          }
        }
      };
      var merged = Utils.deepMerge(dest, source);
      expect(JSON.stringify(merged)).to.be(JSON.stringify(source));
    });

   it('expect clone, "clone object" be ok', function () {
      var obj = {
        a: 1
      };
      expect(JSON.stringify(obj)).to.be(JSON.stringify(Utils.clone(obj)));
    });


    it('expect clone, "clone array" be ok', function () {
      var arr = [2,3,4];
      expect(JSON.stringify(arr)).to.be(JSON.stringify(Utils.clone(arr)));
    });

    it('expect traver, "traver object" be ok', function () {
      var arr = [];
      var obj = {
        a: {
          b: {
            c: {},
            d:{
              e: {}
            }
          }
        }
      };

      Utils.traver(obj, function(key, child, parent){
        arr.push(key);
      })

      expect(JSON.stringify(arr)).to.be(JSON.stringify(['a', 'b', 'c', 'd', 'e']));
    });


    it('expect merge  be ok', function () {
      var dest = {
        a: 1,
        b: 2
      };
      var source = {
        b: 3
      }
      expect(JSON.stringify(Utils.merge(dest, source))).to.be(JSON.stringify({
        a: 1,
        b: 3
      }));
    });

    it('expect isNone, "isNone array" be ok', function () {
      var isNone = Utils.isNone;
      expect(isNone(null) && isNone(undefined)).to.be(true);
    });

   it('expect deepClone, "deepClone object" be ok', function () {
      var a = {
        b: {
          c: 1
        }
      };
      var a1 = Utils.deepClone(a);
      console.log(a1);
      a1.b.c = 2;
      expect(a.b.c).to.be(1);
    });
});

