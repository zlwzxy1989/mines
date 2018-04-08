/**
 * tool functions without business logic
 *
 */

/*
 * オブジェクトをクローン 复制对象
 *
 * @param obj object
 *
 * return object
 */
function clone(obj) {
  if (typeof (obj) != 'object') {
    return obj;
  }
  if (obj == null) {
    return obj;
  }
  var _new_obj = new Object();
  for ( var i in obj) {
    _new_obj[i] = clone(obj[i]);
  }
  return _new_obj;
}
/*
 * objからkeyの値を取り出す、存在しなければdefault_valueを返す
 * 从obj中获取key对应的value,如key对应的值不存在则返回default_value
 *
 * @param obj object @param key string @param default_value mixed
 *
 * return mixed
 */

function getValueFromObj(obj, key, default_value) {
  var _obj = obj || {};
  return _obj[key] == undefined ? default_value : _obj[key];
}
/*
 * objとdefault_objのマージ結果を返す。同じキーがあればobjの値を優先
 * 根据default_obj的key获取obj中相同key的value,如obj中不存在相同的key则使用default_obj中的value,返回修改后的default_obj
 *
 * @param obj object @param default_obj object
 *
 * return object
 */

function getValuesFromObj(obj, default_obj) {
  var _obj = obj || {}, _default_obj = clone(default_obj) || {};
  for ( var key in _default_obj) {
    _default_obj[key] = getValueFromObj(_obj, key, _default_obj[key]);
  }
  return _default_obj;
}

/*
 * urlのgetパラメーターを取得。jsonのデフォルト値を提供できる 获取所有get参数到json对象,可提供json形式的默认值
 *
 * @param obj_default object
 *
 * @return object
 */

function getArgs(obj_default) {
  if (typeof obj_default !== 'object' && obj_default != undefined) {
    obj_default = {};
  }
  var args = obj_default || {};
  var query = location.search.substring(1);
  // Get query string
  var pairs = query.split("&");
  // Break at ampersand
  for (var i = 0; i < pairs.length; i++) {
    var pos = pairs[i].indexOf('=');
    // Look for "name=value"
    if (pos == -1)
      continue;
    // If not found, skip
    var argname = pairs[i].substring(0, pos);// Extract the name
    var value = pairs[i].substring(pos + 1);// Extract the value
    value = decodeURIComponent(value);// Decode it, if needed
    args[argname] = value;
    // Store as a property
  }
  return args;// Return the object
}

/*
 * min~maxの範囲からランダム整数を返す 获取min~max的随机整数
 *
 * @param min int @param max int
 *
 * @return int
 */
function getRandInt(min, max) {
  var _max = max == undefined ? 1 : parseInt(max, 10);
  var _min = min == undefined ? 0 : parseInt(min, 10);
  if (_max <= 0) {
    return 0;
  }
  if (_min < 0) {
    return 0;
  }
  if (_min > _max) {
    return 0;
  }
  return parseInt(_min + Math.random() * _max, 10);
}

/*
 * 秒数をhh:mi:ssに変換する 秒数转成XX:XX:XX格式
 *
 * @param seconds int
 *
 * @return str
 */
function secondsToStr(seconds) {
  var _seconds_left = seconds == undefined ? 0 : seconds;
  var _seconds_left;
  if (isNaN(_seconds_left)) {
    return false;
  }
  function addZero(str) {
    return str.length == 1 ? '0' + str : str;
  }
  // 小时
  var _hours = parseInt(_seconds_left / 3600, 10);
  if (_hours >= 24) {
    return '23:59:59';
  }
  _seconds_left = _seconds_left % 3600;
  _hours = addZero(_hours) + ':';
  if (_hours.length == 2) {
    _hours = '0' + _hours;
  }
  // 分
  var _minutes = String(parseInt(_seconds_left / 60, 10));
  _seconds_left = String(_seconds_left % 60);
  _minutes = addZero(_minutes) + ':';
  if (_minutes.length == 2) {
    _minutes = '0' + _minutes;
  }
  // 秒为_seconds_left
  return _hours + _minutes + addZero(_seconds_left);
}

/*
 * 正の整数かどうかをチェック 检查是否是正整数
 *
 * @param str string
 *
 * @return boolean
 */

function IsNumber(str) {
  var _number = /^([1-9]\d*)$/;
  return _number.test(str);
}