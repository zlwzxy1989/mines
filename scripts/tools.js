/**
 * tool functions without business logic
 *
 * @copyright  Copyright  LexisNexis, a division of Reed Elsevier Inc. All rights reserved.
 */

/*
 * 复制对象
 *
 * @param obj object
 *
 * return object
 * */
function clone(obj){ 
	if(typeof(obj) != 'object') {
		return obj;
	}
	if(obj == null) {
		return obj; 
	}
	var _new_obj = new Object(); 
	for(var i in obj) {
		_new_obj[i] = clone(obj[i]); 
	}
	return _new_obj; 
} 
/*
 * 从obj中获取key对应的value,如key对应的值不存在则返回default_value
 *
 * @param obj object
 * @param key string
 * @param default_value mixed
 *
 * return mixed
 * */

function getValueFromObj(obj, key, default_value) {
    var _obj = obj || {};
    return _obj[key] == undefined ? default_value : _obj[key];
}
/*
 * 根据default_obj的key获取obj中相同key的value,如obj中不存在相同的key则使用default_obj中的value,返回修改后的default_obj
 *
 * @param obj object
 * @param default_obj object
 *
 * return object
 * */

function getValuesFromObj(obj, default_obj) {
    var _obj = obj || {}, _default_obj = clone(default_obj) || {};
    for (var key in _default_obj) {
        _default_obj[key] = getValueFromObj(_obj, key, _default_obj[key]);
    }
    return _default_obj;
}

/*
 * 显示loading图标,图标会覆盖掉指定区域(jquery选择器)
 *
 * @param loading_area string loading div的选择器
 * @param target string 将被覆盖的区域的选择器
 * @param option object loading图标的参数
 * */

function show_loading(obj) {
    var _obj_default = {
        loading_area: '#loading',
        target: '.head_table',
        option: {
            lines: 12, // The number of lines to draw
            length: 5, // The length of each line
            width: 3, // The line thickness
            radius: 9, // The radius of the inner circle
            corners: 1, // Corner roundness (0..1)
            rotate: 0, // The rotation offset
            color: '#000', // #rgb or #rrggbb
            speed: 1, // Rounds per second
            trail: 60, // Afterglow percentage
            shadow: false, // Whether to render a shadow
            hwaccel: false, // Whether to use hardware acceleration
            className: 'spinner', // The CSS class to assign to the spinner
            zIndex: 2e9, // The z-index (defaults to 2000000000)
            top: 'auto', // Top position relative to parent in px
            left: 'auto' // Left position relative to parent in px
        }
    };
    obj = obj || {};
    var _obj = getValuesFromObj(obj, _obj_default);
    var _spin_str = _obj.loading_area + '_spin';
    var searchLoadingInterval;

    var target = $(_spin_str).get(0);
    var spinner = new Spinner(_obj.option).spin(target);

    var e2 = $(_obj.target), e = $(_obj.loading_area), es = $('span', e);
    var h = parseInt(e2.height()), s = '.';
    e2.hide();
    e.height(h).show();
    searchLoadingInterval = window.setInterval(function () {
        (8 == s.length) ? s = '.' : s += '.';
        es.html(s)
    }, 600);
}
/*
 * 获取所有get参数到json对象,可提供json形式的默认值
 *
 * @param obj_default object
 *
 * @return object
 * */

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
        if (pos == -1) continue;
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
 * 获取min~max的随机整数
 *
 * @param min int 
 * @param max int 
 *
 * @return int
 * */
 function getRandInt(min, max){
	var _max = max == undefined ? 1 : parseInt(max, 10);
	var _min = min == undefined ? 0 : parseInt(min, 10);
	if (_max <=0)
	{
		return 0;
	}
	if (_min <0)
	{
		return 0;
	}
	if (_min > _max)
	{
		return 0;
	}
	return parseInt(_min + Math.random() * _max, 10);
 }
