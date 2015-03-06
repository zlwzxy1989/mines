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
	//标旗时不能点
	if (getGridStatus(config, x, y) == GRID_STATUS_FLAG)
	{
		return false;
	}
	return config.grid_data[y][x].clickable;
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
		} 
		else if (_type == GRID_TYPE_EMPTY)
		{
			_img_id = String(_status) + '-' + String(_type) + '-' + String(_mines_around);
		}			
	} else {
		_img_id = String(_status);
	}
	return 'img/' + config.prefix + 'grid_' + _img_id + '.' + config.img_type;
}
//用于SHI后开图,默认不改变flag的status
function setGridToOpen(config){
	var i,j;
	for (i = 0;i < config.map_height ;i++) {
		for (j = 0;j < config.map_width ;j++) {
			//如果是旗,判断旗是否标对
			if (config.grid_data[i][j].status == GRID_STATUS_FLAG)
			{
				if (config.grid_data[i][j].type != GRID_TYPE_MINE)
				{
					config.grid_data[i][j].status = GRID_STATUS_WRONG_FLAG;
				}
			} 
			else 
			{
				config.grid_data[i][j].status = GRID_STATUS_OPENED;
			}

		}
	}
}
//游戏失败后重画可以不重新生成,用drawSingleGrid
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
		
		$(this).bind('mousedown', {"config":config}, function(e){
			e.preventDefault();
			if (!isGameOver(e.data.config))
			{
				if (e.which == 1)
				{
					changeFace(FACE_CLICK_DOWN);
				}
						
				//mousedown只处理右键,左键在click里处理
				if (e.which == 3)
				{
					right_click_event(e, $(this).attr('id'));
				}
			}
		});

		$(this).bind('mouseover', {"config":config}, function(e){
			var config = e.data.config;
			var _coordinate = getCoordinateByImgId(config, $(this).attr('id'));
			if (isClickable(config, _coordinate[0], _coordinate[1]))
			{
				$(this).css('opacity', 0.7);
			}
		});

		$(this).bind('mouseout', function(e){
			$(this).css('opacity', 1);
		});
		$(this).click({"config":config}, function(e){
			if (!isGameOver(e.data.config))
			{
				left_click_event(e, $(this).attr('id'));
			}
		});
	});
}
function getGridType(config, x, y){
	//console.log('getGridType in ' + y + '-' + x + ':');
	//标记为雷时当雷处理
	if (getGridStatus(config, x, y) == GRID_STATUS_FLAG)
	{
		return GRID_TYPE_MINE;
	}
	var _grid_type = config.grid_data[y][x].type;

	if (_grid_type == GRID_TYPE_EMPTY && config.grid_data[y][x].mines_around > 0)
	{
		return GRID_TYPE_NUMBER;
	}
	return _grid_type;
}
function getGridStatus(config, x, y){
	return config.grid_data[y][x].status;
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
	
	//剩余雷数
	$('#mines_left').html(_result.mine_num);
	
	return _result;
}

//随机生成雷的坐标
//当雷比空白多时可以先填空白,剩下的就是雷
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
	var k;
	var _index, _point , _debug_info = '';
	//雷比空地多时从空地开始剔除
	if (config.mine_num * 2 > config.grid_num_all)
	{
		k = config.mine_num;
		while (k < config.grid_num_all)
		{
			_index = getRandInt(0, _pool_pop.length - 1);
			_point = _pool_pop[_index];
			_debug_info += ' add empty gird ' + _point + "\r\n";
			_pool_pop.splice(_index, 1);
			k++;			
		}
		_mine_pool = _pool_pop;
	}
	else
	{
		k = 0;
		while (k < config.mine_num)
		{
			_index = getRandInt(0, _pool_pop.length - 1);
			_point = _pool_pop[_index];
			_debug_info += ' add mine ' + _point + "\r\n";
			_mine_pool.push(_point);
			_pool_pop.splice(_index, 1);
			k++;
		}
	}
	addMsgTo(_debug_info);
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
		var _debug_mines_around = '';
		for (j = 0;j < config.map_height;j++)
		{
			_line = [];
			for (i = 0;i < config.map_width;i++)
			{
				_point = getPointStr(i, j);
				_type = $.inArray(_point, config.mine_pool) == -1 ? GRID_TYPE_EMPTY : GRID_TYPE_MINE;
				_mines_around_tmp = _type == GRID_TYPE_EMPTY ? getMinesAround(config, i, j) : 0;
				_debug_mines_around += ' point '+ _point +': '+ _mines_around_tmp +' mines around' + "\r\n";
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
		addMsgTo(_debug_mines_around);
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
	if (isClickable(config, x, y))
	{
		var _gird_data_single = config.grid_data[y][x];
		_gird_data_single.clickable = false;
		_gird_data_single.status = GRID_STATUS_OPENED;
		drawSingleGrid(config, x, y);
		config.num_clicked++;
		addMsgTo('clicked grid num:' + config.num_clicked + ' | ' + config.grid_num_all);
	}
}
function drawSingleGrid(config, x, y){
	$('#' + getImgId(config, x, y)).attr('src', getCurrentImageSrc(config, x, y));
}
var left_click_event = function(e, img_id){
	var config = e.data.config;
	var _coordinate = getCoordinateByImgId(config, img_id);
	var _gird_data_single = config.grid_data[_coordinate[1]][_coordinate[0]];
	addMsgTo('left click ' + _coordinate + '...');

	//未打开状态时,打开格子
	if (isClickable(config, _coordinate[0], _coordinate[1]))
	{
		openSingleGrid(config, _coordinate[0], _coordinate[1]);
		selectLastClick(config, _coordinate[0], _coordinate[1]);
		//是否踩雷
		if (_gird_data_single.type == GRID_TYPE_MINE)
		{
			config.game_over = true;
			changeFace(FACE_FAILED);
			setTimeout("alert('你SHI了!')", 100);
			clearTimer();
			setGridToOpen(config);
			drawMap(config);
			selectLastClick(config, _coordinate[0], _coordinate[1]);
			return;
		} 
		else
		{
			//判定是否胜利
			if (isWin(config))
			{
				config.game_over = true;
				changeFace(FACE_SUCCESS);
				setTimeout("alert('你赢了!')", 100);
				clearTimer();
				return;
			}
			//是空格,计算所有与当前格临接的空格和数字
			if (_gird_data_single.mines_around == 0)
			{
				openGridsAround(config, _gird_data_single.x, _gird_data_single.y);
				//判定是否胜利
				if (isWin(config))
				{
					config.game_over = true;
					changeFace(FACE_SUCCESS);
					setTimeout("alert('你赢了!')", 100);
					clearTimer();
					return;
				}
			}
		}		
	}
	changeFace(FACE_NORMAL);
}
function right_click_event(e, img_id){
	var config = e.data.config;
	if (isGameOver(config))
	{
		return;
	}
	var _coordinate = getCoordinateByImgId(config, img_id);
	var _gird_data_single = config.grid_data[_coordinate[1]][_coordinate[0]];
	addMsgTo('right click ' + _coordinate + '...');
	if (_gird_data_single.status != GRID_STATUS_OPENED)
	{
		//减少旗时剩余雷数增加
		if (_gird_data_single.status == GRID_STATUS_FLAG)
		{
			addMinesDisplay(config);
		}
		_gird_data_single.status = _gird_data_single.status % 3 + 1;
		//增加旗时剩余雷数减少
		if (_gird_data_single.status == GRID_STATUS_FLAG)
		{
			minusMinesDisplay(config);
		}
		drawSingleGrid(config, _coordinate[0], _coordinate[1]);
	}

}
//打开周围的格子
function openGridsAround(config, x, y){
	var _result = [];
	//尝试扫描线种子填充算法
	var _start_point = {"x":x, "y":y};
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
		openSingleGrid(config, _current_point.x, _current_point.y);
		_left_border_x = 0;
		_right_border_x = config.map_width - 1;
		//左右延伸到边界,找到left和right边界
		//windows为8方向填充,左右边界各+1
		//left
		for (i = _current_point.x - 1;i >= 0;i-- )
		{
			_grid_type_tmp = getGridType(config, i, _current_point.y);
			//console.log('left ' + _grid_type_tmp);
			//空格,变为显示,继续循环
			if (_grid_type_tmp == GRID_TYPE_EMPTY)
			{
				openSingleGrid(config, i, _current_point.y);
				continue;
			}
			//数字,变为显示,退出
			if (_grid_type_tmp == GRID_TYPE_NUMBER)
			{
				openSingleGrid(config, i, _current_point.y);
				_left_border_x = i;
				break;
			}
			//雷,不打开当前格,退出
			if (_grid_type_tmp == GRID_TYPE_MINE)
			{
				_left_border_x = i;
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
			if (_grid_type_tmp == GRID_TYPE_EMPTY)
			{
				openSingleGrid(config, i, _current_point.y);
				continue;
			}
			//数字,变为显示,退出
			if (_grid_type_tmp == GRID_TYPE_NUMBER)
			{
				openSingleGrid(config, i, _current_point.y);
				_right_border_x = i;
				break;
			}
			//雷,不打开当前格,退出
			if (_grid_type_tmp == GRID_TYPE_MINE)
			{
				_right_border_x = i;
				break;
			}

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
					if (_grid_type_tmp == GRID_TYPE_NUMBER)
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
		//扫描y-1和y+1,获取新的起点
		addStartPoint(_current_point.y + 1);
		addStartPoint(_current_point.y - 1);
		//console.log(_point_pool);

	}
}

function isGameOver(config){
	if (config.game_over)
	{
		return true;
	}
	return false;
}

function startTimer(){
		var _start_time = 0;
		$('#timer').html(secondsToStr(_start_time));
		var _start_timer = function(){
			_start_time++;
			$('#timer').html(secondsToStr(_start_time));
			timer = setTimeout(_start_timer, 1000);
		}
		timer = setTimeout(_start_timer, 1000);
}
function clearTimer(){
	clearTimeout(timer);
}

function getMinesDisplay(config){
	return parseInt($(config.mines_left_container).html(),10);
}
function setMinesDisplay(config, value){
	$(config.mines_left_container).html(value);
}
function addMinesDisplay(config){
	var _current_mines = getMinesDisplay(config);
	setMinesDisplay(config, ++_current_mines);
}
function minusMinesDisplay(config){
	var _current_mines = getMinesDisplay(config);
	setMinesDisplay(config, --_current_mines);

}
function changeFace(id){
	$('#face').attr('src', 'img/face_' + String(id) + '.jpg');
}

function check_param(){
	if (IsNumber($("#map_height").val()) == false) {
		$("#err_msg").html("地图高必须输入正整数");
		$("#map_height").select();
		return false;
	}
	if (IsNumber($("#map_width").val()) == false) {
		$("#err_msg").html("地图宽必须输入正整数");
		$("#map_width").select();
		return false;
	}
	if (IsNumber($("#mine_num").val()) == false) {
		$("#err_msg").html("雷数必须输入正整数");
		$("#mine_num").select();
		return false;
	}
	if (IsNumber($("#grid_width").val()) == false) {
		$("#err_msg").html("边长必须输入正整数");
		$("#grid_width").select();
		return false;
	}
	var _map_height = parseInt($("#map_height").val(), 10);
	var _map_width = parseInt($("#map_width").val(), 10);
	var _mine_num = parseInt($("#mine_num").val(), 10);
	var _grid_width = parseInt($("#grid_width").val(), 10);
	if (_map_height <= 8) {
		$("#err_msg").html("比初级还小怎么行");
		$("#map_height").select(); 
		return false;
	}
	if (_map_width <= 8) {
		$("#err_msg").html("比初级还小怎么行");
		$("#map_width").select();
		return false;
	}
	if (_mine_num > _map_height * _map_width) {
		$("#err_msg").html("雷数不能超过格子总数");
		$("#mine_num").select(); 
		return false;
	}
	if (_map_height * _map_width > 1000) {
		$("#err_msg").html("地图太大小心机器爆掉");
		$("#map_height").select(); 
		return false;
	}
	if (_grid_width < 12) {
		$("#err_msg").html("你看得清吗...");
		$("#grid_width").select(); 
		return false;
	}
	if (_grid_width > 100) {
		$("#err_msg").html("这不是1080P电影...");
		$("#grid_width").select(); 
		return false;
	}
	$("#err_msg").html('');
	return true;
}