$(document).ready(function(){
	var _map_generator = new mapGenerator();
	$('#init').click(function(){
		var _mine_num = parseInt($('#mine_num').attr('value'), 10);
		var _map_height = parseInt($('#map_height').attr('value'), 10);
		var _map_width = parseInt($('#map_width').attr('value'), 10);
		//attr有问题?
		var _grid_width = parseInt($('#grid_width').attr('value'), 10);
		alert(_grid_width);
		_map_generator.init({
			"mine_num":_mine_num,
			"map_height":_map_height,
			"map_width":_map_width,
			"grid_width":_grid_width
		});
		_map_generator.draw();
	});
});