function mapGenerator(){
	var _result = {};
	var _flag_controller = new flagController();
	_result.config = {};
	_result.mapData = [];
	_result.init = function(args) {
		var _args = args || {};
		_result.config = getValuesFromObj(args, map_generator_default_config);
		_flag_controller.init(_result.config);
		_flag_controller.randomize();
	}
	
	//0-重画,格子覆盖表示 1-格子正面表示
	_result.draw = function(draw_type, point_x, point_y){
		addMsgTo('draw...');
		var _time_start = new Date().getTime();
		var _draw_type = draw_type == undefined ? GRID_STATUS_COVERD : draw_type;
		var _container_width,_container_height;
		var i,j;
		$(_result.config.container).html('');
		_result.mapData = _flag_controller.genGridInfo(_draw_type);
		//设置大容器宽高
		_container_width = _result.config.map_width * (_result.config.grid_width + 2 );
		_container_height = _result.config.map_height * (_result.config.grid_width + 2 );
		$(_result.config.container).css('width', _container_width);
		$(_result.config.container).css('height', _container_height);
		//逐个画小格子
		for (i = _result.mapData.length - 1;i >= 0;i--) {
			for (j = 0;j < _result.mapData[i].length ;j++) {
				$(_result.config.container).append(_result.mapData[i][j].getHtml());
			}
		}
		//画打开状态时,标注命中点
		if (_draw_type == GRID_STATUS_OPENED)
		{
			if (point_x != undefined && point_y != undefined)
			{
				$('#' + _result.config.grid_class_prefix + getPointStr(point_x, point_y)).parent().css('border-color', 'red');
			}
		}
		var _time_end = new Date().getTime();
		addMsgTo('time spent:' + (_time_end - _time_start)/1000 + ' s');
		addMsgTo('draw end...');
	}
	return _result;
}