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
	_result.randomize = function(){
		addMsgTo('randomize...');
		var _time_start = new Date().getTime();
		_result.mine_pool = {};
		_result.mine_pool_arr = [];
		//所有格子的池,在某个格子做为雷取出后从池中去除
		var _pool_pop = [];
		var i, j;
		for (i = 0;i < _result.config.map_width;i++)
		{
			for (j = 0;j < _result.config.map_height;j++)
			{
				_pool_pop.push({"x":i, "y":j});
			}
		}
		var k = 0;
		var _index, _point;
		while (k < _result.config.mine_num)
		{
			_index = getRandInt(0, _pool_pop.length - 1);
			_point = getPointStr(_pool_pop[_index].x, _pool_pop[_index].y);
			addMsgTo(' add mine ' + _point);
			_result.mine_pool[_point] =  _pool_pop[_index];
			_result.mine_pool_arr.push(_result.mine_pool[_point]);
			_pool_pop.splice(_index, 1);
			k++;
		}
		var _time_end = new Date().getTime();
		addMsgTo('time spent:' + (_time_end - _time_start)/1000 + ' s');
		addMsgTo('randomize end...');
		
	}

	_result.genGridInfo = function(status){
		addMsgTo('genGridInfo...');
		var _time_start = new Date().getTime();
		var _grid_info = [];
		var _line = [];
		var i,j,_grid_tmp,_point,_type;
		//用于计算周围的雷数
		var m,n,_x_min,_x_max,_y_min,_y_max,_point_tmp,_mine_around_tmp;
		var _status = status == undefined ? GRID_STATUS_COVERD : status;
		//数组中保存形式为data[y坐标][x坐标]
		for (j = 0;j < _result.config.map_height;j++)
		{
			_line = [];
			for (i = 0;i < _result.config.map_width;i++)
			{
				_point = getPointStr(i, j);
				_type = _result.mine_pool[_point] == undefined ? GRID_TYPE_EMPTY : GRID_TYPE_MINE;
				_mines_around_tmp = 0;
				//计算格子周围的雷数
				if (_type == GRID_TYPE_EMPTY)
				{
					_x_min = i - 1 < 0 ? 0 : i - 1;
					_x_max = i + 1 >= _result.config.map_width ? i : i + 1;
					_y_min = j - 1 < 0 ? 0 : j - 1;
					_y_max = j + 1 >= _result.config.map_height ? j : j + 1;

					for (m = _x_min;m <= _x_max ;m++ )
					{
						for (n = _y_min;n <= _y_max ;n++ )
						{
							_point_tmp = getPointStr(m, n);
							if (_result.mine_pool[_point_tmp] != undefined)
							{
								_mines_around_tmp++;
							}
						}
					}
				}
				addMsgTo(' point '+ _point +': '+ _mines_around_tmp +' mines around');
				_grid_tmp = new grid();
				_grid_tmp.init({
					"x":i,
					"y":j,
					"type":_type,
					"status":_status,
					"width": _result.config.grid_width,
					"container":_result.config.grid_container,
					"prefix":_result.config.grid_class_prefix,
					"mine_num":_result.config.mine_num,
					"mines_around":_mines_around_tmp,
					"x_max":_result.config.map_width,
					"y_max":_result.config.map_height
				});
				_line.push(_grid_tmp);
			}
			_grid_info.push(_line);
		}
		var _time_end = new Date().getTime();
		addMsgTo('time spent:' + (_time_end - _time_start)/1000 + ' s');
		addMsgTo('genGridInfo end...');
		return _grid_info;
	}
	return _result;
}

function grid(){
	var _result = {};
	_result.config = {};

	_result.init = function(args){
		_result.config = getValuesFromObj(args, grid_default_config);
	}
	_result.setConfigValue = function(key, value){
		_result.config[key] = value;
	}
	_result.getConfigValue = function(key, default_value){
		return _result.config[key] == undefined ? default_value : _result.config[key];
	}
	_result.getImgId = function(){
		return _result.config.prefix + getPointStr(_result.config.x, _result.config.y);
	}

	_result.isMine = function(){
		return _result.config.type == GRID_TYPE_MINE;
	}
	_result.getClickable = function(){
		return _result.config.status == GRID_STATUS_COVERD;
	}
	_result.getCurrentImageSrc = function(){
		var _img_id = '';
		if (_result.config.status == GRID_STATUS_OPENED)
		{

			if (_result.config.type == GRID_TYPE_MINE)
			{
				_img_id = String(_result.config.status) + '-' + String(_result.config.type);
			} else if (_result.config.type == GRID_TYPE_EMPTY)
			{
				_img_id = String(_result.config.status) + '-' + String(_result.config.type) + '-' + String(_result.config.mines_around);
			}			
		} else {
			_img_id = String(_result.config.status);
		}
		return 'img/' + _result.config.prefix + 'grid_' + _img_id + '.' + _result.config.img_type;
	}
	var _click_event = function(e, check_around){
		addMsgTo('click ' + _result.getImgId() + '...');
		//未打开状态时,打开格子
		if (!sl_game_over && isClickable(_result.config.x, _result.config.y))
		{
			setClicked(_result.config.x, _result.config.y);
			$(this).unbind('.front');

			_result.setConfigValue('status', GRID_STATUS_OPENED);
			$(this).attr('src', _result.getCurrentImageSrc());
			//是否踩雷
			if (_result.isMine())
			{
				sl_game_over = true;
				setTimeout("alert('你SHI了!')", 100);
				draw(GRID_STATUS_OPENED, _result.config.x, _result.config.y);
				return;

			} else {
				sl_num_clicked++;
				addMsgTo('clicked grid num:' + sl_num_clicked + ' | ' + sl_grid_num_all);
				//判定是否胜利
				if (sl_num_clicked + _result.config.mine_num >= sl_grid_num_all)
				{
					sl_game_over = true;
					setTimeout("alert('你赢了!')", 100);
					draw(GRID_STATUS_OPENED);
					return;
				}
				//是空格,计算所有与当前格临接的空格和数字
				if (_result.config.mines_around == 0 && check_around == undefined)
				{
					//尝试扫描线种子填充算法
					var _start_point = {"x":_result.config.x, "y":_result.config.y};
					var _current_point = {};
					//算法的起点池
					var _point_pool = [];
					var _left_start,right_start;
					var _left_border_x,_right_border_x;
					var _grid_type_tmp;
					var i;
					_point_pool.push(_start_point);
					while (_point_pool.length > 0)
					{
						//取出起点
						_current_point = _point_pool.pop();
						_left_border_x = 0;
						_right_border_x = sl_map_width - 1;
						//左右延伸到边界,找到left和right边界
						//left
						for (i = _current_point.x;i >= 0;i-- )
						{
							_grid_type_tmp = getGridType(i, _current_point.y);
							//console.log('left ' + _grid_type_tmp);
							//空格,变为显示,继续循环
							if (_grid_type_tmp == GRID_TYPE_EMPTY)
							{
								$("#" + _result.config.prefix + getPointStr(i, _current_point.y)).trigger('click', [true]);
								continue;
							}
							//数字,变为显示,退出
							if (_grid_type_tmp == GRID_TYPE_NUMBER)
							{
								$("#" + _result.config.prefix + getPointStr(i, _current_point.y)).trigger('click', [true]);
								_left_border_x = i;
								break;
							}
							//雷,不打开当前格,退出
							if (_grid_type_tmp == GRID_TYPE_MINE)
							{
								_left_border_x = i + 1;
								break;
							}
						}
						//right
						for (i = _current_point.x + 1;i < sl_map_width;i++ )
						{
							_grid_type_tmp = getGridType(i, _current_point.y);
							//console.log('right ' + getPointStr(i, _current_point.y) + ' type:' + _grid_type_tmp);
							//console.log(sl_map_generator.mapData[_current_point.y][i]);

							//空格,变为显示,继续循环
							if (_grid_type_tmp == GRID_TYPE_EMPTY)
							{
								$("#" + _result.config.prefix + getPointStr(i, _current_point.y)).trigger('click', [true]);
								continue;
							}
							//数字,变为显示,退出
							if (_grid_type_tmp == GRID_TYPE_NUMBER)
							{
								$("#" + _result.config.prefix + getPointStr(i, _current_point.y)).trigger('click', [true]);
								_right_border_x = i;
								break;
							}
							//雷,不打开当前格,退出
							if (_grid_type_tmp == GRID_TYPE_MINE)
							{
								_right_border_x = i - 1;
								break;
							}

						}
						//扫描y-1和y+1,获取新的起点
						addStartPoint(_current_point.y + 1);
						addStartPoint(_current_point.y - 1);
						//console.log(_point_pool);
						if (_point_pool.length>3)
						{
							//return;
						}
						function addStartPoint(y)
						{
							//console.log(_left_border_x + ' to ' + _right_border_x + ' in line ' + y);
							if (y >= sl_map_height || y < 0)
							{
								return;
							}
							//控制是否要将当前点加入起点池的flag
							var _add_new_point = false;
							var _grid_type_tmp;
							for (i = _left_border_x;i <= _right_border_x ; i++)
							{
								//如果是已打开过的格子,直接跳过
								if (!isClickable(i, y))
								{
									continue;
								}

								_grid_type_tmp = getGridType(i, y);
								if (_grid_type_tmp == GRID_TYPE_EMPTY)
								{
									_add_new_point = true;
								}
								else
								{
									if (_grid_type_tmp == GRID_TYPE_NUMBER)
									{
										$("#" + _result.config.prefix + getPointStr(i, y)).trigger('click', [true]);
									}
									if (_add_new_point == true)
									{
										//console.log({"x":i - 1, "y":y});
										_point_pool.push({"x":i - 1, "y":y});
										_add_new_point = false;
									}
								} 

							}
							//添加边界点
							if (_add_new_point == true)
							{
								//console.log('bian jie');
								//console.log({"x":i - 1, "y":y});
								_point_pool.push({"x":_right_border_x, "y":y});
							}
						}
					}
					/*
					addMsgTo('click grids around');
					var _direction = [
						{"x":-1,"y":0},
						{"x":1,"y":0},
						{"x":0,"y":-1},
						{"x":0,"y":1}
					];
					var i, _x_tmp, _y_tmp;
					for (i = 0; i <= _direction.length - 1; i++)
					{
						_x_tmp = _result.config.x + _direction[i].x;
						_y_tmp = _result.config.y + _direction[i].y;
						if (isClickable(_x_tmp, _y_tmp))
						{
							addMsgTo('click around:' + getPointStr(_x_tmp, _y_tmp));
							$("#" + _result.config.prefix + getPointStr(_x_tmp, _y_tmp)).trigger('click', [true]);
						}
					}
					*/
				}
			}
			
		}
	}
	_result.getHtml = function(){
		var _container = $("<" + _result.config.container + " style='width:" + _result.config.width + "px;height:" + _result.config.width + "px'></" + _result.config.container + ">");
		var _img = $("<img id='" + _result.getImgId() + "' src='" + _result.getCurrentImageSrc() + "' />");
		_img.bind('click.front', _click_event);
		_container.append(_img);
		return _container;
	}
	
	return _result;
}