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
 * isNone 判断是否存在
 * @param {String/Function} d
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

function deepClone(src) {
  var input = Array.isArray(src)?[]:{};
  return deepMerge(input, src);
}


function isNeedClone(d){
  if(!d) return false;
  if(d instanceof HTMLElement) return false;
  if(d[0] && d[0] instanceof HTMLElement) return false;
  if(d.globalCompositeOperation) return false;//ctx的情况
  
  //还需判断div 等节点
  return true;
}

var maxDepth = 3;
function deepMerge(dest, src, isDirect, depth) {
  var i, j, len, src, depth = depth || 0;

  var result = isDirect ? dest : clone(dest);

    if (depth++ >= maxDepth) {
      console.log('层数过深, 全部继承');
      return src;
    }
    //
    for (i in src) {
      if (src.hasOwnProperty(i)) {
        var value = src[i];
        var destValue = dest[i];
        if(value === destValue) continue;
        if(value === undefined) continue;
        if (destValue && typeof (destValue) === 'object' && typeof (value) === 'object') {
          if(Array.isArray(destValue) !== Array.isArray(value)){ // 继承和被继承的 一个是数组 一个是对象
            if (typeof(value) === 'object' && (!isDirect) && isNeedClone(value)) value = deepClone(value);
            result[i] = value;
            continue;
          } else{
             result[i] = deepMerge(destValue, value, isDirect, depth);
             continue;
          }
        }
        if (typeof(value) === 'object' && (!isDirect) && isNeedClone(value)) value = deepClone(value);
        result[i] = value;
      }
    }
  return result;
}

function deepMergeCopy(dest, src){
  return deepMerge(dest, src, false);
}
function deepMergeDirect(dest, src){
  return deepMerge(dest, src, false);
}
module.exports = {
  'merge': merge,
  'isNone': isNone,
  'traver': traver,
  'deepMerge': deepMerge,
  'deepMergeDirect': deepMergeDirect,
  'deepMergeCopy': deepMergeCopy,
  'clone': clone,
  'deepClone': deepClone
};