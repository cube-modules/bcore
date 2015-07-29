/**
 * 公共方法
 */

/**
 * traver 深度优先遍历
 * @param {Object} parent 需要遍历的数据
 * @param {Function} cb callback函数
 */
function traver(parent, cb) { //深度优先遍历
  var child;
  for (var key in parent) { //初步循环
    child = parent[key];
    if (child && typeof(child) === 'object') {
        cb(key, child, parent);
        traver(child, cb);
    }
  }
}

/**
 * isNone 判断是否是数字
 * @param {Float} d
 * @return {Boolean}
 */
function isNone(d) {
  return (d === null || d === undefined || isNaN(d));
}

/**
 * extend  合并方法
 * @param  {Objects}  需要扩展的对象
 * @return {Objects}  扩展完成的对象
 *
 * @example
 *   merge(dest, source0, [...]);
 */
function merge(dest) {
  var sources = Array.prototype.slice.call(arguments, 1),
    i, j, len, src;

  for (j = 0, len = sources.length; j < len; j++) {
    src = sources[j] || {};
    for (i in src) {
      if (src.hasOwnProperty(i)) {
        dest[i] = src[i];
      }
    }
  }
  return dest;
}

/**
 * clone 浅复制
 * @param  {Object} obj 被复制的对象
 * @return {Object}     复制后的对象
 */
function clone(obj){
  var result = Array.isArray(obj)?[]:{};
    //clone
    for(var k in obj){
      if (obj.hasOwnProperty(k)) {
        result[k] = obj[k];
      }
    }
  return result;
}

/**
 * deepMerge 深度合并
 * @param  {Object} dest  被合并的对象
 * @param  {Object} src   发起合并的对象
 * @param  {Number} depth 合并深度
 * @return {Object}       合并结束的对象
 */
function deepMerge(dest, src, depth) {
  var i, j, len, src, result = clone(dest), depth = depth || 0;
  console.log(depth,'depth')
    if(depth++ >= 3) {
      console.log('层数过深, 全部继承');
      return clone(src);
    }
    //
    for (i in src) {
      if (src.hasOwnProperty(i)) {
        var value = src[i];
        var destValue = dest[i];
        if(value === destValue) continue;
        if(value === undefined || value === null) continue;
        if (destValue && typeof (destValue) === 'object' && typeof (value) === 'object') {
          result[i] = deepMerge(destValue, value, depth);
          continue;
        }
        result[i] = value;
      }
    }
  return result;
}

  

module.exports = {
  merge: merge,
  isNone: isNone,
  traver: traver,
  deepMerge: deepMerge,
  clone: clone
};
