// 全体設定
// 変わることがないので一応constに置いておく
var global_config = {
  // マイン数
  "mine_num" : 81,
  // 区域の高さ(マス数)
  "map_height" : 9,
  // 区域の幅(マス数)
  "map_width" : 9,
  // マスの幅(px)
  "grid_width" : 12,
  // ゲーム区域のjquery identifier
  "container" : '#mine_area',
  // ゲーム区域のhtml tag
  "grid_container" : 'div',
  // 未使用
  "grid_class_prefix" : 'sl_',
  // マス用画像名のprefix
  "prefix" : 'sl_',
  // 画像タイプ
  "img_type" : 'gif',
  // 設定区域のjquery identifier
  "mines_left_container" : '#mines_left'
};

// マスのデフォルト設定
var grid_default_config = {
  // x軸座標 左から0
  "x" : 0,
  // y軸座標 下から0
  "y" : 0,
  // マスのタイプ 0-空 1-マイン
  // 0-空格 1-雷
  "type" : 0,
  // マスの状態 0-未クリック 1-クリック済み 2-フラグ 3-ハテナ
  // 0-覆盖 1-打开 2-棋 3-问号
  "status" : 0,
  // 周辺8マスのマイン数
  // 周围的雷数
  "mines_around" : 0
};

// 難易度設定
var game_rank = [ {
  "mine_num" : 10,
  "map_height" : 9,
  "map_width" : 9,
}, {
  "mine_num" : 40,
  "map_height" : 16,
  "map_width" : 16,
}, {
  "mine_num" : 99,
  "map_height" : 16,
  "map_width" : 30,
}, {
  "mine_num" : 899,
  "map_height" : 30,
  "map_width" : 30,
}, {
  "mine_num" : 81,
  "map_height" : 9,
  "map_width" : 9,
} ];
// const
// マスタイプ
var GRID_TYPE_EMPTY = 0;
var GRID_TYPE_MINE = 1;
var GRID_TYPE_NUMBER = 2;

// マス状態
var GRID_STATUS_OPENED = 0;
var GRID_STATUS_COVERD = 1;
var GRID_STATUS_FLAG = 2;
var GRID_STATUS_QUESTION = 3;
var GRID_STATUS_WRONG_FLAG = 4;

// ゲーム区域上方の顔状態
var FACE_NORMAL = 0;
var FACE_CLICK_DOWN = 1;
var FACE_FAILED = 2;
var FACE_SUCCESS = 3

// 初期画面の絵
var map_ji = [ {
  "x" : 0,
  "y" : 7
}, {
  "x" : 1,
  "y" : 7
}, {
  "x" : 2,
  "y" : 7
}, {
  "x" : 3,
  "y" : 7
}, {
  "x" : 4,
  "y" : 7
}, {
  "x" : 2,
  "y" : 6
}, {
  "x" : 2,
  "y" : 5
}, {
  "x" : 2,
  "y" : 4
}, {
  "x" : 2,
  "y" : 3
}, {
  "x" : 2,
  "y" : 2
}, {
  "x" : 2,
  "y" : 1
}, {
  "x" : 1,
  "y" : 1
}, {
  "x" : 0,
  "y" : 2
}, {
  "x" : 6,
  "y" : 7
}, {
  "x" : 7,
  "y" : 7
}, {
  "x" : 8,
  "y" : 7
}, {
  "x" : 7,
  "y" : 6
}, {
  "x" : 7,
  "y" : 5
}, {
  "x" : 7,
  "y" : 4
}, {
  "x" : 7,
  "y" : 3
}, {
  "x" : 7,
  "y" : 2
}, {
  "x" : 7,
  "y" : 1
}, {
  "x" : 6,
  "y" : 1
}, {
  "x" : 8,
  "y" : 1
} ];