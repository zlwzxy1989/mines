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
	_result.draw = function(draw_type){
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
		/*
		//添加用于统计的事件
		$(_result.config.container + " img").each(function(){
			var _id = $(this).attr('id');
			var _arr_tmp = _id.split('_');
			_arr_tmp = _arr_tmp[_arr_tmp.length - 1].split('-');
			var _x = _arr_tmp[0];
			var _y = _arr_tmp[1];
			var _grid_tmp = _result.mapData[_x][_y];
			$(this).click(function(){
				addMsgTo('clicked');
				if (_grid_tmp.getClickable() && !sl_game_over)
				{
					setClicked(_result.config.x, _result.config.y);
					if (_grid_tmp.isMine())
					{
						sl_game_over = true;
						_result.draw(GRID_STATUS_OPENED);
						setTimeout("alert('你SHI了!'), 100");
						return;
					}
					sl_num_clicked++;
					addMsgTo('clicked grid num:' + sl_num_clicked);
					//判定是否胜利
					if (sl_num_clicked + _result.config.mine_num >= sl_grid_num_all)
					{
						sl_game_over = true;
						_result.draw(GRID_STATUS_OPENED);
						setTimeout("alert('你赢了!'), 100");
						return;
					}
				}				
			});
			
		});*/
	}
	return _result;
}