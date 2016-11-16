// var _isDown, _points, _strokeID, _r, _g, _rc, _idx =null; // global variables

var _isDownArr = [], _pointsArr=[], _strokeIDArr=[], _rArr=[], _gArr=[], _rcArr=[], _idx =null; // global variables

$(document).ready( function () {
	$("#videoTable").DataTable()

	$('#videoTable tbody').on( 'mouseover', 'tr', function () {
	    var idx = $("#videoTable").DataTable().row( this ).index();
	    _idx = idx
	})
});


function onLoadEvent()
{
	for (var i = 0; i<2; ++i)
		createVideo(i)
}

function createOneVideo() {

}


function createVideo(i) {

	_pointsArr[i] = new Array(); // point array for current stroke
	_strokeIDArr[i] = 0;
	_rArr[i] = new PDollarRecognizer();

	var canvas = document.getElementById('canvas'+i);
	_gArr[i] = canvas.getContext('2d');
	_gArr[i].lineWidth = 3;
	_gArr[i].font = "16px Gentilis";
	_rcArr[i] = getCanvasRect(canvas); // canvas rect on page
	_gArr[i].fillStyle = "rgb(255,255,136)";
	_gArr[i].fillRect(0, 0, _rcArr[i].width, 20);

	_isDownArr[i] = false;
}


function getCanvasRect(canvas) {
	var w = canvas.width;
	var h = canvas.height;

	var cx = canvas.offsetLeft;
	var cy = canvas.offsetTop;
	while (canvas.offsetParent != null)
	{
		canvas = canvas.offsetParent;
		cx += canvas.offsetLeft;
		cy += canvas.offsetTop;
	}
	return {x: cx, y: cy, width: w, height: h};
}


function getScrollY() {
	var scrollY = $(window).scrollTop();
	return scrollY;
}

// Mouse Events
function mouseDownEvent(x, y, button) {
	document.onselectstart = function() { return false; } // disable drag-select
	document.onmousedown = function() { return false; } // disable drag-select
	if (button <= 1) {
		_isDownArr[_idx] = true;
		x -= _rcArr[_idx].x;
		y -= _rcArr[_idx].y - getScrollY();
	
		if (_strokeIDArr[_idx] == 0) { // starting a new gesture
			_pointsArr[_idx].length = 0;
			_gArr[_idx].clearRect(0, 0, _rcArr[_idx].width, _rcArr[_idx].height);
		}
		
		_pointsArr[_idx][_pointsArr[_idx].length] = new Point(x, y, ++_strokeIDArr[_idx]);
		drawText("Recording stroke #" + _strokeIDArr[_idx] + "...");
		var clr = "rgb(" + rand(0,200) + "," + rand(0,200) + "," + rand(0,200) + ")";
		_gArr[_idx].strokeStyle = clr;
		_gArr[_idx].fillStyle = clr;
		_gArr[_idx].fillRect(x - 4, y - 3, 9, 9);
	}

	else if (button == 2) {
		drawText("Recognizing gesture...");
	}
}
	

function mouseMoveEvent(x, y, button) {
	if (_isDownArr[_idx])
	{
		x -= _rcArr[_idx].x;
		y -= _rcArr[_idx].y - getScrollY();
		_pointsArr[_idx][_pointsArr[_idx].length] = new Point(x, y, _strokeIDArr[_idx]); // append
		drawConnectedPoint(_pointsArr[_idx].length - 2, _pointsArr[_idx].length - 1);
	}
}


function mouseUpEvent(x, y, button, id) {
	document.onselectstart = function() { return true; } // enable drag-select
	document.onmousedown = function() { return true; } // enable drag-select
	if (button <= 1)
	{
		if (_isDownArr[_idx])
		{
			_isDownArr[_idx] = false;
			drawText("Stroke #" + _strokeIDArr[_idx] + " recorded.");
		}
	}
	else if (button == 2) // segmentation with right-click
	{
		if (_pointsArr[_idx].length >= 10)
		{

			// // * This is the part where I print all the codes
			// var text ="new Array("
			// for (i in _points) {
			// 	text += "new Point(" + _points[i].X + "," + _points[i].Y + "," + _points[i].ID + "),"
			// }
			// text = text.slice(0,-1)
			// text += ")"
			// console.log(text)
			
			var result = _rArr[_idx].Recognize(_pointsArr[_idx]);
			drawText("Result: " + result.Name + " (" + round(result.Score,2) + ").");
			if(result.Name == "play") {
				document.getElementById("video"+_idx).play()
			}
			else if(result.Name == 'pause') {
				document.getElementById("video"+_idx).pause()
			}
			else if(result.Name == "increaseVolume") {
				document.getElementById("video"+_idx).volume += 0.1
			}
			else if(result.Name == "decreaseVolume") {
				document.getElementById("video"+_idx).volume -= 0.1
			}
			else if(result.Name == "muted") {
				document.getElementById("video"+_idx).muted = !document.getElementById("video"+_idx).muted
			}
			else if(result.Name == "increasePlaybackRate") { 
				document.getElementById("video"+_idx).playbackRate+=0.2
			}
			else if(result.Name == "decreasePlaybackRate") {
				document.getElementById("video"+_idx).playbackRate-=0.2
			}
			else if(result.Name == "seekPlus") {
				document.getElementById("video"+_idx).currentTime+=10
			}
			else if(result.Name == "seekMinus") {
				document.getElementById("video"+_idx).currentTime-=10
			}
			else if(result.Name == "increaseWidth") {
				document.getElementById("video"+_idx).width+=50
				onLoadEvent()
			}
			else if(result.Name == "decreaseWidth") {
				document.getElementById("video"+_idx).width-=50
				onLoadEvent()
			}
			else if(result.Name == "increaseHeight") {
				document.getElementById("video"+_idx).height+=50
				onLoadEvent()
			}
			else if(result.Name == "decreaseHeight") {
				document.getElementById("video"+_idx).height-=50
				onLoadEvent()
			}
			else if(result.Name == "playAll") {
				document.getElementById("video"+_idx).play()
			}
			else;
		}
		else
		{
			drawText("Too little input made. Please try again.");
		}
		_strokeIDArr[_idx] = 0; // signal to begin new gesture on next mouse-down
	}
}
function drawConnectedPoint(from, to) {
	_gArr[_idx].beginPath();
	_gArr[_idx].moveTo(_pointsArr[_idx][from].X, _pointsArr[_idx][from].Y);
	_gArr[_idx].lineTo(_pointsArr[_idx][to].X, _pointsArr[_idx][to].Y);
	_gArr[_idx].closePath();
	_gArr[_idx].stroke();
}

function drawText(str) {
	_gArr[_idx].fillStyle = "rgb(255,255,136)";
	_gArr[_idx].fillRect(0, 0, _rcArr[_idx].width, 20);
	_gArr[_idx].fillStyle = "rgb(0,0,255)";
	_gArr[_idx].fillText(str, 1, 14);
}

function rand(low, high) {
	return Math.floor((high - low + 1) * Math.random()) + low;
}

function round(n, d) { // round 'n' to 'd' decimals
	d = Math.pow(10, d);
	return Math.round(n * d) / d
}
