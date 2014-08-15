/*!
 * nfmcg: assets/js/lib/util/router.js
 * Authors  : 剪巽 <jianxun.zxl@taobao.com> (https://github.com/fishbar)
 * Create   : 2014-05-23 21:31:08
 * CopyRight 2014 (c) Alibaba Group
 */
var cookie = require('./cookie');
var hashchange = require('../core/jquery.hashchange');
//@body
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
  cookieName : '',
  accessList : {},
  type : 'hash',
  init : function (config) {
    this.cookieName = config.rCookie;
    var type = config.rType;
    var hash = '';
    if (type === 'hash') {
      //don't use it window.location.hash,it has a bug in firefox,the hash will auto decode;
      hash = location.href.split('#!')[1] || '';
    }
    var cstr = cookie.get(this.cookieName);
    // hash key/value
    var routerObj = filter(parsing(hash, type), this.accessList);
    // cookie key/value
    var cookieObj = filter(parsing(cstr, type), this.accessList);
    // hash first, then cookie
    this.data = this.isEmpty(routerObj) ? cookieObj : routerObj;
    this.type = type;
  },
  /**
   * 设置允许设置的hash名称列表
   * @return {[type]}
   */
  registKeys: function (list) {
    this.accessList = list;
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
    if (!param) {
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
    this.save();
  },
  clear: function () {
    this.data = {};
  },
  /**
   * save 保存查询条件 set cookie
   * @param  {object} param 变更的查询条件对象
   */
  save : function () {
    var data = this.data;
    if (data.nocache !== undefined) {
      return;
    }
    var hash = stringify(data);
    // save to cookie
    cookie.set(this.cookieName, hash);
  },
  hashChange: function (fn) {
    var self = this;
    $(window).hashchange(function () {
      var hash = location.href.split('#!')[1] || '';
      var hashObj = filter(parsing(hash, self.type), self.accessList);
      if (equal(self.data, hashObj)) {
        return;
      }
      self.data = hashObj;
      fn(hashObj);
      self.save();
    });
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
