$(document).ready(function(){
	var _map_generator = new mapGenerator();
	$('#init').click(function(){
		$("#debug").html('');
		var _mine_num = parseInt($('#mine_num').val(), 10);
		var _map_height = parseInt($('#map_height').val(), 10);
		var _map_width = parseInt($('#map_width').val(), 10);
		var _grid_width = parseInt($('#grid_width').val(), 10);
		//初始化是否点击过的flag
		sl_clicked_flag = {};
		var i, j;
		for (i = 0;i < _map_width; i++)
		{
			for (j = 0;j < _map_height; j++)
			{
				sl_clicked_flag[getPointStr(i, j)] = true;
			}
		}

		sl_game_over = false;
		sl_num_clicked = 0;
		sl_grid_num_all = _map_width * _map_height;

		_map_generator.init({
			"mine_num":_mine_num,
			"map_height":_map_height,
			"map_width":_map_width,
			"grid_width":_grid_width,
			"debug":1
		});
		_map_generator.draw();
	});
	$('#reset').click(function(){
		$('#mine_num').val(map_generator_default_config.mine_num);
		$('#map_height').val(map_generator_default_config.map_height);
		$('#map_width').val(map_generator_default_config.map_width);
		$('#grid_width').val(map_generator_default_config.grid_width);
	});
	$('#reset').click();
});