function mapGenerator(){
	var _result = {};
	var _flag_controller = new 
	_result.config = {};
	_result.init = function(args) {
		var _args = args || {};
		_result.config = getValuesFromObj(args, map_generator_default_config);
	}
	
	//1-重画,格子覆盖表示 2-格子正面表示
	_result.draw = function(draw_type){
		var _draw_type = draw_type == undefined ? 1 : draw_type;
		var _
	}
}