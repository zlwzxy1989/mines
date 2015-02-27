function addMsgTo(text, selector){
	var _selector = selector == undefined ? '#debug' : selector;
	$(_selector).val($(_selector).val() + text + "\r\n");
	$(_selector).scrollTop($(_selector)[0].scrollHeight);
}

function getPointStr(x, y)
{
	return String(x) + '-' + String(y);
}

function isClickable(x, y)
{
	return sl_clicked_flag[getPointStr(x, y)];
}

function setClicked(x, y)
{
	sl_clicked_flag[getPointStr(x, y)] = false;
}

function draw(type, point_x, point_y){
	sl_map_generator.draw(type, point_x, point_y);
}

function getGridType(x, y){
	var _grid_type = sl_map_generator.mapData[x][y].config.type;
	if (_grid_type == GRID_TYPE_EMPTY && sl_map_generator.mapData[x][y].mines_around > 0)
	{
		return GRID_TYPE_NUMBER;
	}
	return _grid_type;
}