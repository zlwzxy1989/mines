function addMsgTo(text, selector){
	if (DEBUG)
	{
		var _selector = selector == undefined ? '#debug' : selector;
		$(_selector).val($(_selector).val() + text + "\r\n");
		$(_selector).scrollTop($(_selector)[0].scrollHeight);
	}
}

function getPointStr(x, y)
{
	return String(x) + '-' + String(y);
}

function isClickable(config, x, y)
{
	return config.grid_data[y][x].clickable;
}

function setClicked(x, y)
{
	sl_clicked_flag[getPointStr(x, y)] = false;
}
function getImgId(config, x, y){
	return config.prefix + getPointStr(x, y);
}
function getGridHtml(config, x, y){
	var _container = "<" + config.grid_container + " style='width:" + config.grid_width + "px;height:" + config.grid_width + "px'>";
	_container += "<img id='" + getImgId(config, x, y) + "' src='" + getCurrentImageSrc(config, x, y) + "' />";
	_container += "</" + config.grid_container + ">";
	return _container;
}
function getCurrentImageSrc(config, x, y){
		var _img_id = '';
		var _status = config.grid_data[y][x].status;
		var _type = config.grid_data[y][x].type;
		var _mines_around = config.grid_data[y][x].mines_around;
		if (_status == GRID_STATUS_OPENED)
		{
			if (_type == GRID_TYPE_MINE)
			{
				_img_id = String(_status) + '-' + String(_type);
			} else if (_type == GRID_TYPE_EMPTY)
			{
				_img_id = String(_status) + '-' + String(_type) + '-' + String(_mines_around);
			}			
		} else {
			_img_id = String(_status);
		}
		return 'img/' + config.prefix + 'grid_' + _img_id + '.' + config.img_type;
	}

function drawMap(config){
	addMsgTo('draw...');
	var _time_start = new Date().getTime();
	var i,j;
	var _html = '';
	//逐个画小格子
	//所有传入参数的x,y均为坐标
	for (j = config.map_height - 1;j >= 0;j--) {
		for (i = 0;i < config.map_width ;i++) {
			_html += getGridHtml(config, i, j);
		}
	}
	$(config.container).html(_html);
	var _time_end = new Date().getTime();
	addMsgTo('time spent:' + (_time_end - _time_start)/1000 + ' s');
	addMsgTo('draw end...');
}
function getCoordinateByImgId(config, img_id){
	var _reg = new RegExp(config.prefix);
	return img_id.replace(_reg, '').split('-');
}
function addEventToImg(config){
	$(config.container + " img").each(function(){
		$(this).click(
		{"config":config}, _click_event
			/*function(){
			var _coordinate = getCoordinateByImgId(config, $(this).attr('id'));
			console.log(_coordinate);
			console.log(config.grid_data[_coordinate[1]][_coordinate[0]]);
		}*/);
	});
}
function getGridType(config, x, y){
	//console.log('getGridType in ' + y + '-' + x + ':');
	var _grid_type = config.grid_data[y][x].type;
	if (_grid_type == GRID_TYPE_EMPTY && config.grid_data[y][x].mines_around > 0)
	{
		return GRID_TYPE_NUMBER;
	}
	return _grid_type;
}

function game_init(config){
	$("#debug").val('');
	var _result = getValuesFromObj(config, global_config);
	//计算基础数据
	_result.game_over = false;
	_result.num_clicked = 0;
	_result.mine_num = parseInt($('#mine_num').val(), 10);
	_result.map_height = parseInt($('#map_height').val(), 10);
	_result.map_width = parseInt($('#map_width').val(), 10);
	_result.grid_num_all = _result.map_width * _result.map_height;
	_result.grid_width = parseInt($('#grid_width').val(), 10);
	_result.last_clicked = '';
	//随机生成雷
	_result.mine_pool = randomize(_result);

	//生成格子数据
	_result.grid_data = genGridData(_result);
	//设置大容器宽高
	_result.container_width = _result.map_width * (_result.grid_width + 2 );
	_result.container_height = _result.map_height * (_result.grid_width + 2 );

	$(_result.container).css('width', _result.container_width);
	$(_result.container).css('height', _result.container_height);

	
	return _result;
}

//随机生成雷的坐标
//算法可以改进,当雷比空白多时可以先填空白,剩下的就是雷
function randomize(config){
	addMsgTo('randomize...');
	var _mine_pool = [];
	var _time_start = new Date().getTime();
	
	//所有格子的池,在某个格子做为雷取出后从池中去除
	var _pool_pop = [];
	var i, j;
	for (i = 0;i < config.map_width;i++)
	{
		for (j = 0;j < config.map_height;j++)
		{
			_pool_pop.push(getPointStr(i, j));
		}
	}
	var k = 0;
	var _index, _point;
	while (k < config.mine_num)
	{
		_index = getRandInt(0, _pool_pop.length - 1);
		_point = _pool_pop[_index];
		addMsgTo(' add mine ' + _point);
		_mine_pool.push(_point);
		_pool_pop.splice(_index, 1);
		k++;
	}
	var _time_end = new Date().getTime();
	addMsgTo('time spent:' + (_time_end - _time_start)/1000 + ' s');
	addMsgTo('randomize end...');
	return _mine_pool;
}
function selectLastClick(config, x, y){
	if (config.last_clicked != '')
	{
		$(config.last_clicked).parent().css('border', '1px solid #000000');
	}
	config.last_clicked = '#' + getImgId(config, x, y);
	$(config.last_clicked).parent().css('border', '1px solid red');
}
function genGridData(config){
var _data = [];
		addMsgTo('genGridData...');
		var _time_start = new Date().getTime();
		var _data = [];
		var _line = [];
		var i,j,_grid_tmp,_point,_type;
		//用于计算周围的雷数
		var m,n,_x_min,_x_max,_y_min,_y_max,_point_tmp,_mine_around_tmp;
		//数组中保存形式为data[y坐标][x坐标]
		for (j = 0;j < config.map_height;j++)
		{
			_line = [];
			for (i = 0;i < config.map_width;i++)
			{
				_point = getPointStr(i, j);
				_type = $.inArray(_point, config.mine_pool) == -1 ? GRID_TYPE_EMPTY : GRID_TYPE_MINE;
				_mines_around_tmp = _type == GRID_TYPE_EMPTY ? getMinesAround(config, i, j) : 0;
				addMsgTo(' point '+ _point +': '+ _mines_around_tmp +' mines around');
				_line.push({
					"x":i,
					"y":j,
					"type":_type,
					"status":GRID_STATUS_COVERD,
					"mines_around":_mines_around_tmp,
					"clickable":true
				});
			}
			_data.push(_line);
		}
		var _time_end = new Date().getTime();
		addMsgTo('time spent:' + (_time_end - _time_start)/1000 + ' s');
		addMsgTo('genGridData end...');
		return _data;
}

function getMinesAround(config, x, y){
	var m,n,_x_min,_x_max,_y_min,_y_max,_point_tmp,_mines_around;
	_x_min = x - 1 < 0 ? 0 : x - 1;
	_x_max = x + 1 >= config.map_width ? x : x + 1;
	_y_min = y - 1 < 0 ? 0 : y - 1;
	_y_max = y + 1 >= config.map_height ? y : y + 1;
	_mines_around = 0;
	for (m = _x_min;m <= _x_max ;m++ )
	{
		for (n = _y_min;n <= _y_max ;n++ )
		{
			_point_tmp = getPointStr(m, n);
			if ($.inArray(_point_tmp, config.mine_pool) != -1)
			{
				_mines_around++;
			}
		}
	}
	return _mines_around;
}
function isWin(config){
	addMsgTo('grid num:' + config.num_clicked + ' | ' + config.grid_num_all);
	//判定是否胜利
	return config.num_clicked + config.mine_num >= config.grid_num_all;
}

function openSingleGrid(config, x, y){
	var _gird_data_single = config.grid_data[y][x];
	_gird_data_single.clickable = false;
	_gird_data_single.status = GRID_STATUS_OPENED;
	drawSingleGrid(config, x, y);
	config.num_clicked++;
	addMsgTo('clicked grid num:' + config.num_clicked + ' | ' + config.grid_num_all);
}
function drawSingleGrid(config, x, y){
	$('#' + getImgId(config, x, y)).attr('src', getCurrentImageSrc(config, x, y));
}
var _click_event = function(e){
	var config = e.data.config;
	if (config.game_over)
	{
		setTimeout("alert('游戏已经结束,请重新开局!')", 100);
		return;
	}
	var _coordinate = getCoordinateByImgId(config, $(this).attr('id'));
	var _gird_data_single = config.grid_data[_coordinate[1]][_coordinate[0]];
	addMsgTo('click ' + _coordinate + '...');

	//未打开状态时,打开格子
	if (_gird_data_single.clickable)
	{
		openSingleGrid(config, _coordinate[0], _coordinate[1]);
		selectLastClick(config, _coordinate[0], _coordinate[1]);
		//是否踩雷
		if (_gird_data_single.type == GRID_TYPE_MINE)
		{
			config.game_over = true;
			setTimeout("alert('你SHI了!')", 100);
			//draw(GRID_STATUS_OPENED, _result.config.x, _result.config.y);
			return;

		} 
		else
		{
			//判定是否胜利
			if (isWin(config))
			{
				config.game_over = true;
				setTimeout("alert('你赢了!')", 100);
				//draw(GRID_STATUS_OPENED);
				return;
			}
			//是空格,计算所有与当前格临接的空格和数字
			if (_gird_data_single.mines_around == 0)
			{
				//尝试扫描线种子填充算法
				var _start_point = {"x":_gird_data_single.x, "y":_gird_data_single.y};
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
					_right_border_x = config.map_width - 1;
					//左右延伸到边界,找到left和right边界
					//left
					for (i = _current_point.x;i >= 0;i-- )
					{
						_grid_type_tmp = getGridType(config, i, _current_point.y);
						//console.log('left ' + _grid_type_tmp);
						//空格,变为显示,继续循环
						if (_grid_type_tmp == GRID_TYPE_EMPTY && isClickable(config, i, _current_point.y))
						{
							openSingleGrid(config, i, _current_point.y);
							continue;
						}
						//数字,变为显示,退出
						if (_grid_type_tmp == GRID_TYPE_NUMBER && isClickable(config, i, _current_point.y))
						{
							openSingleGrid(config, i, _current_point.y);
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
					for (i = _current_point.x + 1;i < config.map_width;i++ )
					{
						_grid_type_tmp = getGridType(config, i, _current_point.y);
						//console.log('right ' + getPointStr(i, _current_point.y) + ' type:' + _grid_type_tmp);
						//console.log(sl_map_generator.mapData[_current_point.y][i]);

						//空格,变为显示,继续循环
						if (_grid_type_tmp == GRID_TYPE_EMPTY && isClickable(config, i, _current_point.y))
						{
							openSingleGrid(config, i, _current_point.y);
							continue;
						}
						//数字,变为显示,退出
						if (_grid_type_tmp == GRID_TYPE_NUMBER && isClickable(config, i, _current_point.y))
						{
							openSingleGrid(config, i, _current_point.y);
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
						if (y >= config.map_height || y < 0)
						{
							return;
						}
						//控制是否要将当前点加入起点池的flag
						var _add_new_point = false;
						var _grid_type_tmp;
						//是否区域内的格子都打开过,如果都打开过就忽略此起点
						var _all_opened = true;
						for (i = _left_border_x;i <= _right_border_x ; i++)
						{
							//只要有一个格子未打开就需要处理
							if (isClickable(config, i, y))
							{
								_all_opened = false;
							}
							_grid_type_tmp = getGridType(config, i, y);
							if (_grid_type_tmp == GRID_TYPE_EMPTY)
							{
								_add_new_point = true;
							}
							else
							{
								if (_grid_type_tmp == GRID_TYPE_NUMBER && isClickable(config, i, y))
								{
									openSingleGrid(config, i, y);
								}
								if (_add_new_point == true)
								{
									//console.log({"x":i - 1, "y":y});
									if (_all_opened == false)
									{
										_point_pool.push({"x":i - 1, "y":y});
										_all_opened = true;
									}									
									_add_new_point = false;
								}
							} 

						}
						//添加边界点
						if (_add_new_point == true)
						{
							//console.log('bian jie');
							//console.log({"x":i - 1, "y":y});
							if (_all_opened == false)
							{
								_point_pool.push({"x":_right_border_x, "y":y});
								_all_opened = true;
							}
						}
					}
				}
				//判定是否胜利
				if (isWin(config))
				{
					config.game_over = true;
					setTimeout("alert('你赢了!')", 100);
					//draw(GRID_STATUS_OPENED);
					return;
				}
			}

		}
		
	}
}