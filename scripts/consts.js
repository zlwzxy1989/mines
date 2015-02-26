var map_generator_default_config = {
	"mine_num":20,
	"map_height":10,
	"map_width":10,
	"grid_width":12,
	"container":'#mine_area',
	"grid_container":'div',
	"grid_class_prefix":'sl_',
	"debug":0
};

var grid_default_config = {
	"x":0,
	"y":0,
	//0-空格 1-雷
	"type":0,
	//0-覆盖 1-打开 2-棋 3-问号
	"status":0,
	//周围的雷数
	"mines_around":0,
	"mine_num":20,
	"width":10,
	"container":'div',
	"prefix":'sl_',
	"img_type":'gif',
	"mousedown_img": 'grid_mouse_down.gif'
};

var GRID_TYPE_EMPTY = 0;
var GRID_TYPE_MINE = 1;

var GRID_STATUS_COVERD = 0;
var GRID_STATUS_OPENED = 1;
var GRID_STATUS_FLAG = 2;
var GRID_STATUS_QUESTION = 3;

