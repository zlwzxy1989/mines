function flagController(){
	var _result = {};
	_result.config = {};
	_result.mine_pool = {};
	_result.mine_pool_arr = [];
	_result.init = function(args){
		var _result = {"respCode":"000", "respDesc":""};
		var _check_status = _checkConifg(args);
		if (_check_status.respCode !== "000")
		{
			return _check_status;
		}
		_result.config = args;
		return _result;

	}
	function _checkConifg(args) {
		var _result = {"respCode":"000", "respDesc":""};
		//检查合法性,暂略
		return _result;
	}
	//随机生成雷的坐标
	//算法可以改进,当雷比空白多时可以先填空白,剩下的就是雷
	_result.randomize = function(){
		_result.mine_pool = {};
		_result.mine_pool_arr = [];
		var i = 0,_x,_y,_point;
		while (i < _result.config.mine_num)
		{
			_x = getRandInt(0, _result.config.width);
			_y = getRandInt(0, _result.config.height);
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

	_result.genGridInfo = function(){
		var _result = [];
		var _line = [];
		var i,j;
		for (i = 0;i < _result.config.width ;i++)
		{
			_line = [];
			for (j = 0;j < _result.config.height ;j++)
			{

			}
		}
	}
}

function grid(){
	var _result = {};
	_result.config = {};

	_result.init = function(args){
		_result.config = args;
	}
	_result.isMine = function(){
		return _result.config.type == GRID_TYPE_MINE;
	}
	_result.getClickable = function(){
		return _result.config.status == GRID_STATUS_COVERD;
	}
	_result.getCurrentImageId = function(){
		if (_result.config.status == GRID_STATUS_OPENED)
		{

			if (_result.config.type == GRID_TYPE_MINE)
			{
				return String(_result.config.status) + '-' + String(_result.config.type);
			} else if (_result.config.type == GRID_TYPE_EMPTY)
			{
				return String(_result.config.status) + '-' + String(_result.config.type) + '-' + String(_result.config.mines_arund);
			}			
		} else {
			return String(_result.config.status);
		}
	}
}