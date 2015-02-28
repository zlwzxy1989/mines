$(document).ready(function(){
	$('#init').click(function(){
		game_config = game_init(global_config);
		drawMap(game_config);
		addEventToImg(game_config);
	});
	$('#reset').click(function(){
		$('#mine_num').val(global_config.mine_num);
		$('#map_height').val(global_config.map_height);
		$('#map_width').val(global_config.map_width);
		$('#grid_width').val(global_config.grid_width);
	});
	$('#reset').click();
});