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