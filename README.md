bcore
=========================

浏览器基础库，提供 event, class, router 等等模块的封装


## classes

class.js    // 基类， 所有继承关系的class，都需要继承自这里
event.js    // 来自node.js，提供基础事件支持
router.js   // 提供路由支持，单页应用，或者url存储路径的情况，都可以使用这个包
cookie.js   // cookie操作
util.js

incomming

cache.js    -- localStorage, db etc.

## usage

```js
var class = require('bcore/class');
var event = require('bcore/event');
var router = require('bcore/router');
```

## DOC

### class
```
// 用法
function Constructor() {
  // super class constructor
  this._super.call(this, args....);
  // super class functions
  this._super.prototype.funcA();
}
Class.extend(Constructor, {
  //properties
});
```

### event

```

``

### router

```

```
