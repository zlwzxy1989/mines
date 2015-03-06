var global_config = {
	"mine_num":81,
	"map_height":9,
	"map_width":9,
	"grid_width":12,
	"container":'#mine_area',
	"grid_container":'div',
	"grid_class_prefix":'sl_',
	"prefix":'sl_',
	"img_type":'gif',
	"grid_container":"div",
	"mines_left_container":'#mines_left'
};

var grid_default_config = {
	"x":0,
	"y":0,
	//0-空格 1-雷
	"type":0,
	//0-覆盖 1-打开 2-棋 3-问号
	"status":0,
	//周围的雷数
	"mines_around":0
};

var game_rank = [
	{
	"mine_num":10,
	"map_height":9,
	"map_width":9,
	},
	{
	"mine_num":40,
	"map_height":16,
	"map_width":16,
	},
	{
	"mine_num":99,
	"map_height":16,
	"map_width":30,
	},
	{
	"mine_num":899,
	"map_height":30,
	"map_width":30,
	},
	{
	"mine_num":81,
	"map_height":9,
	"map_width":9,
	}
];
var GRID_TYPE_EMPTY = 0;
var GRID_TYPE_MINE = 1;
var GRID_TYPE_NUMBER = 2;

var GRID_STATUS_OPENED = 0;
var GRID_STATUS_COVERD = 1;
var GRID_STATUS_FLAG = 2;
var GRID_STATUS_QUESTION = 3;
var GRID_STATUS_WRONG_FLAG = 4;

var FACE_NORMAL = 0;
var FACE_CLICK_DOWN = 1;
var FACE_FAILED = 2;
var FACE_SUCCESS = 3


var map_ji = [
{"x":0, "y":7},
{"x":1, "y":7},
{"x":2, "y":7},
{"x":3, "y":7},
{"x":4, "y":7},
{"x":2, "y":6},
{"x":2, "y":5},
{"x":2, "y":4},
{"x":2, "y":3},
{"x":2, "y":2},
{"x":2, "y":1},
{"x":1, "y":1},
{"x":0, "y":2},
{"x":6, "y":7},
{"x":7, "y":7},
{"x":8, "y":7},
{"x":7, "y":6},
{"x":7, "y":5},
{"x":7, "y":4},
{"x":7, "y":3},
{"x":7, "y":2},
{"x":7, "y":1},
{"x":6, "y":1},
{"x":8, "y":1}
];