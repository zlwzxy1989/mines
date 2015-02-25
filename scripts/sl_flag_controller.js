function flagController(){
	var _result = {};
	_result.config = {};
	_result.mine_pool = {};
	_result.mine_pool_arr = [];
	_result.init = function(args){
		var _init_info = {"respCode":"000", "respDesc":""};
		var _check_status = _checkConifg(args);
		if (_check_status.respCode != "000")
		{
			return _check_status;
		}
		_result.config = args;
		return _init_info;

	}
	function _checkConifg(args) {
		var _check_info = {"respCode":"000", "respDesc":""};
		//检查合法性,暂略
		return _check_info;
	}
	//随机生成雷的坐标
	//算法可以改进,当雷比空白多时可以先填空白,剩下的就是雷
	function randomize(){
		_result.mine_pool = {};
		_result.mine_pool_arr = [];
		var i = 0,_x,_y,_point;
		while (i < _result.config.mine_num)
		{
			_x = getRandInt(0, _result.config.map_width);
			_y = getRandInt(0, _result.config.map_height);
			_point = String(_x) + '-' + String(_y);
			//未重复的雷,加入雷列表
			if (_result.mine_pool[_point] == undefined)
			{
				_result.mine_pool[_point] = {"x":_x, "y":_y};
				_result.mine_pool_arr.push(_result.mine_pool[_point]);
				i++;
			}
		}
	}

	_result.genGridInfo = function(status){
		randomize();
		var _grid_info = [];
		var _line = [];
		var i,j,_grid_tmp,_point,_type;
		var _status = status == undefined ? GRID_STATUS_COVERD : status;
		for (i = 0;i < _result.config.map_width;i++)
		{
			_line = [];
			for (j = 0;j < _result.config.map_height;j++)
			{
				_point = String(i) + '-' + String(j);
				_type = _result.mine_pool[_point] == undefined ? GRID_TYPE_EMPTY : GRID_TYPE_MINE;
				_grid_tmp = new grid();
				_grid_tmp.init({
					"x":i,
					"y":j,
					"type":_type,
					"status":_status,
					"width": _result.config.grid_width,
					"container":_result.config.grid_container,
					"prefix":_result.config.grid_class_prefix
				});
				_line.push(_grid_tmp);
			}
			_grid_info.push(_line);
		}
		return _grid_info;
	}
	return _result;
}

function grid(){
	var _result = {};
	_result.config = {};

	_result.init = function(args){
		_result.config = args;
	}
	_result.setValue = function(key, value){
		_result.config[key] = value;
	}
	_result.getValue = function(key, default_value){
		return _result.config[key] == undefined ? default_value : _result.config[key];
	}
	_result.getContainerId = function(){
		return _result.config.prefix + _result.config.x + '-' + _result.config.y;
	}

	_result.isMine = function(){
		return _result.config.type == GRID_TYPE_MINE;
	}
	_result.getClickable = function(){
		return _result.config.status == GRID_STATUS_COVERD;
	}
	_result.getCurrentImageClass = function(){
		var _img_id = '';
		if (_result.config.status == GRID_STATUS_OPENED)
		{

			if (_result.config.type == GRID_TYPE_MINE)
			{
				_img_id = String(_result.config.status) + '-' + String(_result.config.type);
			} else if (_result.config.type == GRID_TYPE_EMPTY)
			{
				_img_id = String(_result.config.status) + '-' + String(_result.config.type) + '-' + String(_result.config.mines_arund);
			}			
		} else {
			_img_id = String(_result.config.status);
		}
		return _result.config.prefix + 'grid_' + _img_id;
	}
	_result.getHtml = function(){
		var _html = '';
		_html += "<" + _result.config.container + " class='" + _result.getCurrentImageClass() + "' style='width:" + _result.config.width + "px;height:" + _result.config.width + "px' id='" + _result.getContainerId() + "'>";
		_html += "</" + _result.config.container + ">";
		return _html;

	}
	return _result;
}