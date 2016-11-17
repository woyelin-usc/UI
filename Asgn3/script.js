// var _isDown, _points, _strokeID, _r, _g, _rc, _idx =null; // global variables

var _isDownArr = [], _pointsArr=[], _strokeIDArr=[], _rArr=[], _gArr=[], _rcArr=[], _urlArr=["fakeurl"],_idx =null; // global variables

$(document).ready( function () {
	$("#videoTable").DataTable( {
		"order": [[0, 'desc']]
	})

	$('#videoTable tbody').on( 'mouseover', 'tr', function () {
	    var idx = $("#videoTable").DataTable().row( this ).index();
	    _idx = idx 
	})

    $('#videoTable tbody').on( 'click', 'tr', function () {
    	$("#videoTable").DataTable.$('tr.selected').removeClass('selected');
    	$(this).addClass('selected');
	});

});


function onLoadEvent()
{
	createVideo(0)
	for (var i = 1; i<_rcArr.length; ++i)
		createVideo(i)
}

function refresh() {
	for( var i=0; i<=_isDownArr.length; ++i)
		createVideo(i)
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
			// * This is the part where I print all the codes
			var text ="new Array("
			for (i in _pointsArr[_idx]) {
				text += "new Point(" + _pointsArr[_idx][i].X + "," + _pointsArr[_idx][i].Y + "," + _pointsArr[_idx][i].ID + "),"
			}
			text = text.slice(0,-1)
			text += ")"
			// console.log(text)
			
			var result = _rArr[_idx].Recognize(_pointsArr[_idx]);
			drawText("Result: " + result.Name + " (" + round(result.Score,2) + ").");
			if(result.Name == "play") {
				if(_idx==0) {
					for(var i=1; i<_rcArr.length; ++i) {
						$("#video"+i)[0].play()
					}
				}
				else
					$("#video"+_idx)[0].play()
			}
			else if(result.Name == 'pause') {
				if(_idx==0) {
					for(var i=1; i<_rcArr.length; ++i) {
						$("#video"+i)[0].pause()
					}
				}
				else
					$("#video"+_idx)[0].pause()
			}
			else if(result.Name == "increaseVolume") {
				// volume range: [0,1]

				if(_idx==0) {
					for(var i=1; i<_rcArr.length; ++i) {
						if( $("#video"+i)[0].volume<=0.9 )
							$("#video"+i)[0].volume += 0.1
						else 
							$("#video"+i)[0].volume = 1
					}
				}
				else {
					if( $("#video"+_idx)[0].volume<=0.9 )
						$("#video"+_idx)[0].volume += 0.1
					else 
						$("#video"+_idx)[0].volume = 1
				}
			}
			else if(result.Name == "decreaseVolume") {
				if(_idx==0) {
					for(var i=1; i<_rcArr.length; ++i) {
						if( $("#video"+i)[0].volume>=0.1)
							$("#video"+i)[0].volume -= 0.1
						else 
							$("#video"+i)[0].volume =0					
					}
				}

				else {
					if( $("#video"+_idx)[0].volume>=0.1)
						$("#video"+_idx)[0].volume -= 0.1
					else 
						$("#video"+_idx)[0].volume =0
				}
			}
			else if(result.Name == "muted") {
				if(_idx==0) {
					for(var i=1; i<_rcArr.length; ++i) {
						$("#video"+i)[0].muted = !$("#video"+i)[0].muted
					}
				}

				else $("#video"+_idx)[0].muted = !$("#video"+_idx)[0].muted
			}
			else if(result.Name == "increasePlaybackRate") { 
				if(_idx==0) {
					for(var i=1; i<_rcArr.length; ++i) {
						$("#video"+i)[0].playbackRate+=0.2
					}
				}

				else $("#video"+_idx)[0].playbackRate+=0.2
			}
			else if(result.Name == "decreasePlaybackRate") {
				if(_idx==0) {
					for(var i=1; i<_rcArr.length; ++i) {
						$("#video"+i)[0].playbackRate-=0.2
					}
				}

				else $("#video"+_idx)[0].playbackRate-=0.2
			}
			else if(result.Name == "seekPlusTime") {
				if(_idx==0) {
					for(var i=1; i<_rcArr.length; ++i) {
						$("#video"+i)[0].currentTime+=5
					}
				}

				else $("#video"+_idx)[0].currentTime+=5
			}
			else if(result.Name == "seekMinusTime") {
				if(_idx==0) {
					for(var i=1; i<_rcArr.length; ++i) {
						$("#video"+i)[0].currentTime-=5
					}
				}

				else $("#video"+_idx)[0].currentTime-=5
			}
			else if(result.Name == "increaseWidth") {

				if(_idx==0) {
					for(var i=1; i<_rcArr.length; ++i) {
						$("#video"+i)[0].width+=100
					}
				}

				else $("#video"+_idx)[0].width+=100
				onLoadEvent()
				drawText("Result: " + result.Name + " (" + round(result.Score,2) + ").");
			}
			else if(result.Name == "decreaseWidth") {
				if(_idx==0) {
					for(var i=1; i<_rcArr.length; ++i) {
						$("#video"+i)[0].width-=100
					}
				}

				else $("#video"+_idx)[0].width-=100
				onLoadEvent()
				drawText("Result: " + result.Name + " (" + round(result.Score,2) + ").");
			}
			else if(result.Name == "increaseHeight") {
				if(_idx==0) {
					for(var i=1; i<_rcArr.length; ++i) {
						$("#video"+i)[0].height+=100
					}
				}

				else $("#video"+_idx)[0].height+=100
				onLoadEvent()
				drawText("Result: " + result.Name + " (" + round(result.Score,2) + ").");
			}
			else if(result.Name == "decreaseHeight") {
				if(_idx==0) {
					for(var i=1; i<_rcArr.length; ++i) {
						$("#video"+i)[0].height-=100
					}
				}

				else $("#video"+_idx)[0].height-=100
				onLoadEvent()
				drawText("Result: " + result.Name + " (" + round(result.Score,2) + ").");
			}
			else if(result.Name == "addVideo") {
				if(_idx==0) {
					var url = prompt("Please enter your video URL")
					addVideo(url)
				}
			}
			else if(result.Name == "deleteVideo") {
				if(_idx==0) {
					console.log("Delete All Videos")
				}
				else {
					$("#videoTable").DataTable().row('.selected').remove().draw( false );
					deleteVideo(_idx)
					onLoadEvent()
					// console.log("BEFORE: " + _rcArr.length)
					// deleteVideo(_idx)
					// $("#videoTable").empty()
					// console.log("AFTER: " + _rcArr.length)


     //        		$("<table class='display' id='videoTable' cellspacing='0' width='100%'></table>").appendTo($(".container"))
     //        		$("<thead></thead>").appendTo($("#videoTable"));
     //        		$("#videoTable thead").append("<tr></tr>");
     //            	$("#videoTable thead tr").append("<th>NewCanvas</th>");
     //            	$("#videoTable thead tr").append("<th>NewVideo</th>");
                	// $("<tbody></tbody>").appendTo($("#videoTable"));
                	// for(var i=1; i<_rcArr.length; ++i) {
                	// 	console.log(_urlArr[i])
						// $("#videoTable").DataTable().row.add([
						// 	'<canvas id="'+('canvas'+i)+'" width="250" height="200" style="background-color:#dddddd" \
						// 	onmousedown="mouseDownEvent(event.clientX, event.clientY, event.button)" \
						// 	onmousemove="mouseMoveEvent(event.clientX, event.clientY, event.button)" \
						// 	onmouseup="mouseUpEvent(event.clientX, event.clientY, event.button)" \
						// 	oncontextmenu="return false;"></canvas>',
						// 	'<video controls id="'+('video'+i)+'" width="320" height="240" src="../../../Desktop/'+_urlArr[i]+'"></video>'
						// ]).draw(true)
						// console.log("draw a role")
                	// }

					// onLoadEvent()
				}
			}
		}
		else
		{
			drawText("Too little input made. Please try again.");
		}
		_strokeIDArr[_idx] = 0; // signal to begin new gesture on next mouse-down
	}
}

function addVideo(url) {
	var idx = $("#videoTable").DataTable().rows().count()
	$("#videoTable").DataTable().row.add([
		'<canvas id="'+('canvas'+idx)+'" width="250" height="200" style="background-color:#dddddd" \
			onmousedown="mouseDownEvent(event.clientX, event.clientY, event.button)" \
			onmousemove="mouseMoveEvent(event.clientX, event.clientY, event.button)" \
			onmouseup="mouseUpEvent(event.clientX, event.clientY, event.button)" \
			oncontextmenu="return false;"></canvas>',
		'<video id="'+('video'+idx)+'" width="320" height="240" src="'+url+'"></video>'
	]).draw(true)

	createVideo(idx)
	_urlArr[idx] = url
}

function swap(arr, i, j) {
	var tmp = arr[i];
	arr[i] = arr[j];
	arr[j] = tmp
	arr.pop()
}

function deleteVideo(idx) {
	_isDownArr.splice(idx,1)
	_pointsArr.splice(idx,1)
	_strokeIDArr.splice(idx,1)
	_rArr.splice(idx,1)
	_gArr.splice(idx,1)
	_rcArr.splice(idx,1)
	_urlArr.splice(idx,1)


	for(; idx<_isDownArr.length; ++idx) {
		var j = idx+1
		$("#canvas"+j)[0].id = "canvas"+idx
		$("#video"+j)[0].id = "video"+idx
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
