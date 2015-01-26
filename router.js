/*!
 * core/router.js
 * Authors  : 剪巽 <jianxun.zxl@taobao.com> (https://github.com/fishbar)
 * Create   : 2014-05-23 21:31:08
 * CopyRight 2014 (c) Alibaba Group
 *
 * @example
 *
 *  var Router = require('core/router');
 *  Router.init({
 *    accessKeys: {reporter: /^\w+$/, cate_id: /^\d+$/},
 *    data: {  // data from caches
 *      reporter: 'from_cache'
 *    },
 *    onSave: function (data) {
 *      // may be you need to save router info here
 *    },
 *    hashChange(function (data) {
 *      // watch  hash change, and do your code here
 *    });
 *  });
 */

/**
 * parsing 解析string to object
 * @param  {string} str  由查询条件组成的string，eg cid:50016349|sid:33780312|start:2012-02-02|end:2012-02-08|dt:1|rid:hot_product
 * @param  {string} type 目前仅支持hash 可扩展url类型
 * @return {object}
 */
function parsing(str, type) {
  var res = {};
  if (!str) {
    return res;
  }
  var arr = [];
  var tmp = [];
  if (type === 'hash') {
    arr = str.split('/');
    for (var i = 0, len = arr.length; i < len; i++) {
      if (!arr[i]) {
        continue;
      }
      tmp = arr[i].split(':');
      try {
        res[tmp[0]] = decodeURIComponent(tmp[1]);
      } catch (e) {
        console.log(e);
      }
    }
  }
  return res;
}
/**
 * stringify 解析object to string
 * @param  {object} obj 查询条件key/value
 */
function stringify(obj) {
  var str = [], tmp;
  for (var key in obj) {
    tmp = obj[key];
    if (tmp === 'undefined' || tmp === undefined || tmp === null || typeof(obj[key]) === 'function') {
      continue;
    }
    str.push(key, ':', encodeURIComponent(tmp), '/');
  }
  str.pop();
  return str.join('');
}

function filter(data, filters) {
  var obj = {};
  var tmp;
  var ff;
  for (var i in data) {
    tmp = data[i];
    ff = filters[i];
    if (ff && ff.test(tmp)) {
      obj[i] = tmp;
    }
  }
  return obj;
}

function equal(a, b) {
  var checked = {};
  for (var i in a) {
    if (a[i] != b[i]) {
      return false;
    }
    checked[i] = true;
  }
  var flag = true;
  for (var j in b) {
    if (checked[j]) {
      continue;
    }
    flag = false;
  }
  return flag;
}

module.exports = {
  data : {},
  // cookie : '',
  accessList : {},
  type : '',
  /**
   * init router
   * @param  {Object} config
   * {
   *   type:  optional, 存储方式 ， default hash
   *   accessKeys:  object, 授权的key, 可被安全使用的,
   *   data: {} 初始化参数
   *   onSave: function(data){}  保存路由数据到别的地方
   *   hashChange: function(data){}  事件回调
   * }
   */
  init : function (config) {
    this.accessList = config.accessKeys || {};
    var type = config.type || 'hash';
    this.onSave = config.onSave || function () {};
    this.hashChange(config.hashChange || function () {});

    var hash = '';
    if (!type || type === 'hash') {
      //don't use it window.location.hash,it has a bug in firefox,the hash will auto decode;
      hash = location.href.split('#!')[1] || '';
      location.hash = '#!' + hash + '/';  // trigger hashchange manually
    }
    // hash key/value
    // var routerObj = filter(parsing(hash, type), this.accessList);
    // hash first, then cookie
    // this.data = routerObj;
    this.type = type;
    this.update(config.data || {});
  },
  /**
   * 设置允许设置的hash名称列表
   * @param {Object} keys 授权的key
   * @return {Object}
   */
  registKeys: function (keys) {
    var orig = this.accessList;
    for (var i in keys) {
      orig[i] = keys[i];
    }
  },
  /**
   * get 读取查询条件
   * @param  {string} key 要查询的key
   * @return {objec|string}
   */
  get : function (key) {
    return key ? this.data[key] : this.data;
  },
  /**
   * 更新 url 中的hash
   * @param  {[type]} param [description]
   * @return {[type]}       [description]
   */
  update: function (param) {
    if (!param || this.isEmpty(param)) {
      return;
    }
    var data = this.data;
    // merge
    for (var i in param) {
      if (this.accessList[i]) {
        data[i] = param[i];
      }
    }
    var hash = stringify(data);
    location.hash = '#!/' + hash;
    this.onSave(data);
  },
  clear: function () {
    this.data = {};
  },
  /**
   * save 保存查询条件 set cookie
   * @param  {object} param 变更的查询条件对象
   */
  /*
  save : function () {
    if (!this.cookie) {
      return;
    }
    var data = this.data;
    if (data.nocache !== undefined) {
      return;
    }
    var hash = stringify(data);
    // save to cookie
    cookie.set(this.cookie, hash);
  },
  */
  hashChange: function (fn) {
    var self = this;
    function _change() {
      var hash = location.href.split('#!')[1] || '';
      var hashObj = filter(parsing(hash, self.type), self.accessList);
      if (equal(self.data, hashObj)) {
        return;
      }
      self.data = hashObj;
      fn(hashObj);
      self.onSave(hashObj);
    }
    if (window.addEventListener) {
      window.addEventListener('hashchange', _change, false);
    } else if (window.attachEvent) {
      window.attachEvent('hashchange', _change);
    } else {
      console.error('browser not support hashchange');
    }
  },
  isEmpty: function (obj) {
    var key = true;
    for (var i in obj) {
      key = false;
      break;
    }
    return key;
  }
};