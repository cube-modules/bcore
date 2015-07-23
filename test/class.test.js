var Class = require('../class');
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
      // this._super.apply(this, [a, b]);
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
        // this._super.apply(this, [a, b]);
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
