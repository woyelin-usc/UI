var _isDown, _points, _strokeID, _r, _g, _rc, _idx =null; // global variables


$(document).ready( function () {
	$("#videoTable").DataTable()

	$('#videoTable tbody').on( 'mouseup', 'tr', function () {
	    var idx = $("#videoTable").DataTable().row( this ).index();
	    _idx = idx
	})
});









		function onClickEvent(x,y) {
			//console.log("Your mouse position: (" + x + "," + y + ")")
		}

		function onLoadEvent()
		{
			_points = new Array(); // point array for current stroke
			_strokeID = 0;
			_r = new PDollarRecognizer();

			var canvas = document.getElementById('myCanvas');
			_g = canvas.getContext('2d');
			_g.lineWidth = 3;
			_g.font = "16px Gentilis";
			_rc = getCanvasRect(canvas); // canvas rect on page
			_g.fillStyle = "rgb(255,255,136)";
			_g.fillRect(0, 0, _rc.width, 20);

			_isDown = false;
		}
		function getCanvasRect(canvas)
		{
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
		function getScrollY()
		{
			var scrollY = $(window).scrollTop();
			return scrollY;
		}
		//
		// Mouse Events
		//
		function mouseDownEvent(x, y, button)
		{
			document.onselectstart = function() { return false; } // disable drag-select
			document.onmousedown = function() { return false; } // disable drag-select
			if (button <= 1)
			{
				_isDown = true;
				x -= _rc.x;
				y -= _rc.y - getScrollY();
				if (_strokeID == 0) // starting a new gesture
				{
					_points.length = 0;
					_g.clearRect(0, 0, _rc.width, _rc.height);
				}
				_points[_points.length] = new Point(x, y, ++_strokeID);
				drawText("Recording stroke #" + _strokeID + "...");
				var clr = "rgb(" + rand(0,200) + "," + rand(0,200) + "," + rand(0,200) + ")";
				_g.strokeStyle = clr;
				_g.fillStyle = clr;
				_g.fillRect(x - 4, y - 3, 9, 9);
				console.log("Top Left of Rectangle: (" + _rc.x + "," + _rc.y + ")")
				console.log("Draw Rectangle on: (" + x + "," + y + ")")
			}
			else if (button == 2)
			{
				drawText("Recognizing gesture...");
			}
		}
		function mouseMoveEvent(x, y, button)
		{
			if (_isDown)
			{
				x -= _rc.x;
				y -= _rc.y - getScrollY();
				_points[_points.length] = new Point(x, y, _strokeID); // append
				drawConnectedPoint(_points.length - 2, _points.length - 1);
			}
		}


		function mouseUpEvent(x, y, button, id)
		{
			document.onselectstart = function() { return true; } // enable drag-select
			document.onmousedown = function() { return true; } // enable drag-select
			if (button <= 1)
			{
				if (_isDown)
				{
					_isDown = false;
					drawText("Stroke #" + _strokeID + " recorded.");
				}
			}
			else if (button == 2) // segmentation with right-click
			{
				if (_points.length >= 10)
				{
					var text ="new Array("
					
					// * This is the part where I print all the codes
					for (i in _points) {
						text += "new Point(" + _points[i].X + "," + _points[i].Y + "," + _points[i].ID + "),"
					}
					text = text.slice(0,-1)
					text += ")"
					// console.log(text)
					
					var result = _r.Recognize(_points);
					drawText("Result: " + result.Name + " (" + round(result.Score,2) + ").");
					if(result.Name == "play") {
						document.getElementById("video"+_idx).play()
					}
					else if(result.Name == 'pause') {
						$("#video" + "1" )[0].pause()
					}
					else if(result.Name == "increaseVolume") {
						$("#video")[0].volume += 0.1
					}
					else if(result.Name == "decreaseVolume") {
						$("#video")[0].volume -= 0.1
					}
					else if(result.Name == "muted") {
						$("#myvideo")[0].muted = !$("#myvideo")[0].muted
					}
					else if(result.Name == "increasePlaybackRate") { 
						$("#myvideo")[0].playbackRate+=0.2
					}
					else if(result.Name == "decreasePlaybackRate") {
						$("#myvideo")[0].playbackRate-=0.2
					}
					else if(result.Name == "seekPlus") {
						$("#myvideo")[0].currentTime+=10
					}
					else if(result.Name == "seekMinus") {
						$("#myvideo")[0].currentTime-=10
					}
					else if(result.Name == "increaseWidth") {
						$("#myvideo")[0].width+=50
						onLoadEvent()
					}
					else if(result.Name == "decreaseWidth") {
						$("#myvideo")[0].width-=50
						onLoadEvent()
					}
					else if(result.Name == "increaseHeight") {
						$("#myvideo")[0].height+=50
						onLoadEvent()
					}
					else if(result.Name == "decreaseHeight") {
						$("#myvideo")[0].height-=50
						onLoadEvent()
					}
					else if(result.Name == "playAll") {
						$("#myvideo")[0].play()
					}
					else;
				}
				else
				{
					drawText("Too little input made. Please try again.");
				}
				_strokeID = 0; // signal to begin new gesture on next mouse-down
			}
		}
		function drawConnectedPoint(from, to)
		{
			_g.beginPath();
			_g.moveTo(_points[from].X, _points[from].Y);
			_g.lineTo(_points[to].X, _points[to].Y);
			_g.closePath();
			_g.stroke();
		}
		function drawText(str)
		{
			_g.fillStyle = "rgb(255,255,136)";
			_g.fillRect(0, 0, _rc.width, 20);
			_g.fillStyle = "rgb(0,0,255)";
			_g.fillText(str, 1, 14);
		}
		function rand(low, high)
		{
			return Math.floor((high - low + 1) * Math.random()) + low;
		}
		function round(n, d) // round 'n' to 'd' decimals
		{
			d = Math.pow(10, d);
			return Math.round(n * d) / d
		}
		//
		// Multistroke Adding and Clearing
		//
		function onClickAddExisting()
		{
			if (_points.length >= 10)
			{
				var pointclouds = document.getElementById('pointclouds');
				var name = pointclouds[pointclouds.selectedIndex].value;
				var num = _r.AddGesture(name, _points);
				drawText("\"" + name + "\" added. Number of \"" + name + "\"s defined: " + num + ".");
				_strokeID = 0; // signal to begin new gesture on next mouse-down
			}
		}
		function onClickAddCustom()
		{
			var name = document.getElementById('custom').value;
			if (_points.length >= 10 && name.length > 0)
			{
				var num = _r.AddGesture(name, _points);
				drawText("\"" + name + "\" added. Number of \"" + name + "\"s defined: " + num + ".");
				_strokeID = 0; // signal to begin new gesture on next mouse-down
			}
		}
		function onClickCustom()
		{
			document.getElementById('custom').select();
		}
		function onClickDelete()
		{
			var num = _r.DeleteUserGestures(); // deletes any user-defined templates
			alert("All user-defined gestures have been deleted. Only the 1 predefined gesture remains for each of the " + num + " types.");
			_strokeID = 0; // signal to begin new gesture on next mouse-down
		}
		function onClickClearStrokes()
		{
			_points.length = 0;
			_strokeID = 0;
			_g.clearRect(0, 0, _rc.width, _rc.height);
			drawText("Canvas cleared.");
		}




