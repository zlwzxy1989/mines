$(document).ready(function(){
	if (!DEBUG)
	{
		$('#debug').hide();
	}
	//屏蔽右键菜单
    $(document).bind("contextmenu", function (e) {
        return false;
    });
	$('#init,#face').click(function(){
		changeFace(0);
		game_config = game_init(global_config);
		drawMap(game_config);
		addEventToImg(game_config);
		//如果计时已经在运行,先停掉再开启
		if (timer)
		{
			clearTimer();
		}
		startTimer();
	});
	$('#rank').change(function(e){
		var _rank = parseInt($(this).val(), 10);

		$('#mine_num').val(game_rank[_rank].mine_num);
		$('#map_height').val(game_rank[_rank].map_height);
		$('#map_width').val(game_rank[_rank].map_width);
	});

	$('#timer').html(secondsToStr(0));
	$('#grid_width').val(global_config.grid_width);

	$('#rank').val(4);
	$('#rank').trigger('change');
	changeFace(FACE_NORMAL);
	
	//初始化时先画一个图占位置
	game_config = game_init(global_config);
	drawMap(game_config);
	var i, _x, _y;
	for (i = 0;i < map_ji.length ;i++ )
	{
		_x = map_ji[i].x;
		_y = map_ji[i].y;
		game_config.grid_data[_y][_x].status = GRID_STATUS_OPENED;
		drawSingleGrid(game_config, _x, _y);
	}
	$('#rank').val(0);
	$('#mines_left').html(0);

	//切换设置的隐藏/显示
	$('#sl_middle').click(function(e){
		$('#sl_left').toggle('fast',function(e){
			var _current_arrow_str = $('#arrow').html();
			var _new_arrow_str = _current_arrow_str == '&lt;' ? '&gt;' : '&lt;';
			$('#arrow').html(_new_arrow_str);		
		});
	});
});