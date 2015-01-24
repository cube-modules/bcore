/**
 * Class cookie,  manipulate cookie in browser
 * Authors  : 剪巽 <jianxun.zxl@taobao.com> (https://github.com/fishbar)
 * Create   : 2014-09-10 21:31:08
 * CopyRight 2014 (c) Alibaba Group
 */

/**
 * set cookie
 * @param name <string> cookie name
 * @param value <string> cookie value
 * @param options <object>
 *   - expires <number|date> expires in xx seconds, or expires when date
 *   - path <path> cookie storage path
 *   - domain <string> cookie domain
 *   - secure <bool> true or false
 */
function set(name, value, options) {
  options = options || {};
  if(value === null) {
    value = '';
    options.expires = -1;
  }
  var val = name + '=' + escape(value);
  var expires = options.expires;
  var path = options.path;
  var domain = options.domain;
  var secure = options.secure;
  if(expires){
    var date;
    if( typeof expires == 'number') {
      date = new Date();
      date.setTime(date.getTime() + (expires * 1000));
    } else if(expires.getTime) {
      date = expires;
    }
    if(date)
      expires = '; expires=' + date.toUTCString();
    else
      expires = '';
  }
  path = path ? 'path=' + path : '';
  domain = domain ? '; domain=' + domain : '';
  secure = secure ? '; secure' : '';
  document.cookie = [val, expires, path, domain, secure].join('; ');
}
/**
 * get cookie by name
 * @param name <string> cookie name
 * @return <string>
 */
function get(name) {
  var cookieValue = '';
  var cookies = document.cookie.split('; ');
  for(var i = 0, len = cookies.length ; i < len ; i ++) {
    var cookie = cookies[i].replace(/^\s+|\s+$/g,'');
    cookie = cookie.split('=');
    // Does this cookie string begin with the name we want?
    if( cookie[0] == name ) {
      cookieValue = cookie[1];
      break;
    }
  }
  return unescape(cookieValue);
};

exports.get = get;
exports.set = set;