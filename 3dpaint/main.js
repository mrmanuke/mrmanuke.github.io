var canvas = document.getElementById('canvas');
var canvasy = canvas.getBoundingClientRect().top;
var ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var yoff = document.getElementById('cursor1').style.height;// / 2;

if (canvas.addEventListener) {
	// IE9, Chrome, Safari, Opera
	canvas.addEventListener("mousewheel", MouseWheelHandler, false);
	// Firefox
	canvas.addEventListener("DOMMouseScroll", MouseWheelHandler, false);
}
// IE 6/7/8
else canvas.attachEvent("onmousewheel", MouseWheelHandler);

function MouseWheelHandler(e) {

	// cross-browser wheel delta
	var e = window.event || e; // old IE support
	var d = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
	//console.log("delta: " + delta);
	if (d > 0) {
		changeCursor(delta+1, r*1.02);
	} else {
		changeCursor(delta-1, r*0.98);
	}
	
	return false;
}

window.onload = function() {
	var context = canvas.getContext('2d');
	ctx.beginPath();
	ctx.moveTo(canvas.width/2+.5,20);
	ctx.lineTo(canvas.width/2+.5,canvas.height-20);
	ctx.strokeStyle = "#aaa";
	ctx.lineWidth = 1;
	ctx.stroke();
	ctx.beginPath();
	ctx.strokeStyle = "black";
	ctx.lineWidth = r*2;
}

window.onresize = function() {
	return;
	//canvas.width = window.innerWidth;
	//canvas.height = window.innerHeight;
	//var context = canvas.getContext('2d');
	//ctx.beginPath();
	//ctx.moveTo(canvas.width/2+.5,20);
	//ctx.lineTo(canvas.width/2+.5,canvas.height-20);
	//ctx.strokeStyle = "#aaa";
	//ctx.lineWidth = 1;
	//ctx.stroke();
	//ctx.beginPath();
	//ctx.strokeStyle = "black";
	//ctx.lineWidth = r*2;
}

var count = 0;

var r = 4;
var painting = false;
var left = true;
var sizer = 1;
var delta = 0;
var mouseX = 0;
var mouseY = 0;

var color = "#000000";

function colorchoose(col) {
	color = col;
	document.getElementById('cursor1').style.backgroundColor = col;
	document.getElementById('cursor1').style.backgroundColor = col;
	document.getElementById('cursor2').style.backgroundColor = col;
	document.getElementById('cursor2').style.backgroundColor = col;
}

var putPoint = function(e) {
	//console.log("px:" + e.pageX + " py:" + e.pageY);
	if (painting) {
		var cr = sizer*r;
		e.pageX += cr;
		e.pageY += cr;
		var px = e.pageX + canvas.width/2 + delta;
		var py = e.pageY;

		if (count == 0) {
			oldpx = e.pageX + canvas.width/2 + delta;
			oldpy = e.pageY;
		};
		
		ctx.lineWidth = cr*2;
		
		ctx.strokeStyle = color;
		ctx.fillStyle = color;
		ctx.lineTo(e.pageX,e.pageY);
		ctx.stroke();

		ctx.beginPath();
		ctx.arc(e.pageX,e.pageY,cr,0,2*Math.PI);
		ctx.arc(px, py,cr,0,2*Math.PI);
		ctx.fill();

		ctx.beginPath();
		ctx.moveTo(px, py);
		ctx.lineTo(oldpx, oldpy);
		ctx.stroke();

		oldpx = e.pageX + canvas.width/2 + delta;
		oldpy = e.pageY;

		ctx.beginPath();
		ctx.moveTo(e.pageX,e.pageY);
		count++;

		//document.getElementById('cursor1').style.width = 2*r + 'px';
		//document.getElementById('cursor1').style.height = 2*r + 'px';
		//document.getElementById('cursor2').style.width = 2*r + 'px';
		//document.getElementById('cursor2').style.height = 2*r + 'px';
	}
}

var start = function(e) {
	painting = true;
	putPoint(canvas.relMouseCoords(e));
}

var end = function() {
	painting = false;
	ctx.beginPath();
	count = 0;
}

function doKeyDown(e) {
	if (e.keyCode == 87) {changeSize(1);};//changeCursor(delta, r+1)};//w
	if (e.keyCode == 83) {changeSize(-1);};//changeCursor(delta, r-1)};//s
	if (e.keyCode == 68) {changeCursor(delta+1, r*1.02)};//d
	if (e.keyCode == 65) {changeCursor(delta-1, r*.98)};//a
	//putPoint();
}

function changeCursor(newDelta, newR) {
	r = newR;
	delta = newDelta;
	var cr = sizer*r;
	
	//document.getElementById('rad').innerHTML = Math.round(r*100)/100;
	//document.getElementById('d').innerHTML = Math.round(delta*100)/100;

	document.getElementById('cursor1').style.width = 2*cr + 'px';
	document.getElementById('cursor1').style.height = 2*cr + 'px';
	document.getElementById('cursor2').style.width = 2*cr + 'px';
	document.getElementById('cursor2').style.height = 2*cr + 'px';
	
	var mouseE = new Object();
	mouseE.pageX = mouseX;
	mouseE.pageY = mouseY;
	movecursor(mouseE, true);
}

function rgbToHex(rgb) {
	var hex = Number(rgb).toString(16);
	if (hex.length < 2) {
		hex = "0" + hex;
	}
	return hex;
};

function changeRanger() {
	var ele = document.getElementById('changer');
	var col = "#" + rgbToHex(document.getElementById('redRanger').value) + rgbToHex(document.getElementById('greenRanger').value) + rgbToHex(document.getElementById('blueRanger').value);
	ele.style.color = col;
	ele.style.background = col;
}

function changeSize(d) {
	var ele = document.getElementById('sizeRanger');
	var v = parseFloat(ele.value) + d;
	console.log(v);
	if (v < ele.min || v > ele.max) return;
	ele.value = v;
	changeSizer(v);
}

function changeSizer(v) {
	var ele = document.getElementById('sizeRanger');
	sizer = v/(ele.max*0.4);
	changeCursor(delta, r);
}

var movecursor = function(e, dontrel) {
	var coords;
	if (dontrel) {
		coords = e;
	} else {
		coords = canvas.relMouseCoords(e);
	}
	mouseX = coords.pageX;
	mouseY = coords.pageY;
	document.getElementById('cursor1').style.left = coords.pageX-1 + 'px';
	document.getElementById('cursor1').style.top = coords.pageY+canvasy-1 + 'px';
	document.getElementById('cursor2').style.left = coords.pageX-1+canvas.width/2+delta + 'px';
	document.getElementById('cursor2').style.top = coords.pageY+canvasy-1 + 'px';
	putPoint(coords);
}

canvas.addEventListener('mousedown', start);
canvas.addEventListener('mouseup', end);
window.addEventListener('keydown', doKeyDown);
canvas.addEventListener('mousemove', movecursor);

function relMouseCoords(event){
    var totalOffsetX = 0;
    var totalOffsetY = 0;
    var canvasX = 0;
    var canvasY = 0;
    var currentElement = this;
	var offsetx = 0;
	var offsety = 0;
	var scalex = 1;
	var scaley = 1;
	
	var doc = document.documentElement;
	var left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
	var top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);

    do{
        totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
        totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
    }
    while(currentElement = currentElement.offsetParent)

    canvasX = (event.pageX - totalOffsetX - offsetx - left) / scalex;
    canvasY = (event.pageY - totalOffsetY - offsety - top) / scaley;

    return {pageX:canvasX, pageY:canvasY}
}
HTMLCanvasElement.prototype.relMouseCoords = relMouseCoords;