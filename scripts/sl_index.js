$(document).ready(function(){
	//屏蔽右键菜单
    $(document).bind("contextmenu", function (e) {
        return false;
    });
	$('#init').click(function(){
		game_config = game_init(global_config);
		drawMap(game_config);
		addEventToImg(game_config);
	});
	$('#rank').change(function(e){
		var _rank = parseInt($(this).val(), 10);

		$('#mine_num').val(game_rank[_rank].mine_num);
		$('#map_height').val(game_rank[_rank].map_height);
		$('#map_width').val(game_rank[_rank].map_width);
	});
	$('#grid_width').val(global_config.grid_width);
	$('#rank').val(0);
	$('#rank').trigger('change');
});