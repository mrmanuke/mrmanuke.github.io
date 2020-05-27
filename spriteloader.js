
class SpriteLoader {
	constructor() {
	}
	
	loadFromFile(fname) {
		var sprite = new Sprite();
		sprite.loadImgFromFile(fname);
		return sprite;
	}
	
	loadMegaManFromFile(fname) {
		var sprite = new MegaMan();
		sprite.loadImgFromFile(fname);
		return sprite;
	}
}

class Sprite {
	constructor() {
		this.x = 0;
		this.y = 0;
		this.frames = 0;
		this.rows = 0;
		this.curFrame = 0;
		this.curRow = 0;
		this.frameRate = 20;
		this.img = null;
		this.framew = 1;
		this.frameh = 1;
		this.scalew = 1;
		this.scaleh = 1;
		this.scale = 5;
		this.backForth = false;
		this.stepSize = 1;
		this.visible = false;
	}
	
	loadImgFromFile(fname) {
		var img = new Image();
		img.src = fname;
		var opts = fname.split("/");
		opts = opts[opts.length-1].split(".");
		opts = opts[0].split("-");
		this.framew = parseInt(opts[1].substring(0, opts[1].length-1));
		this.frameh = parseInt(opts[2].substring(0, opts[2].length-1));
		this.backForth = (opts[3].localeCompare("bf") == 0);
		//console log options
		var clog = "";
		for (var i = 0; i < opts.length; i++) {
			clog += opts[i] + ", ";
		}
		clog += "framew: " + this.framew + " bf:" + this.backForth;
		console.log(clog);
		//end console log options
		var that = this;
		img.onload = function() {
			that.init(img);
		}
	}
	
	unloadImg() {
		this.visible = false;
		this.img = null;
	}
	
	init(img) {
		this.img = img;
		this.frames = Math.floor((img.width+0.1) / this.framew);
		this.rows = Math.floor((img.height+0.1) / this.frameh);
		this.spritew = img.width;
		this.spriteh = img.height;
		this.scalew = this.framew*this.scale;
		this.scaleh = this.frameh*this.scale;
		console.log("init w:" + img.width + " h:" + img.height + " frames:" + this.frames);
	}
	
	step() {
		if(!this.img || !this.visible) return;
		if(this.bf) {
			if (this.curFrame == 0 || this.curFrame == this.frames-1) {
				this.stepSize = -this.stepSize;
			}
			this.curFrame += this.stepSize;
		} else {
			this.curFrame = (this.curFrame+1)%this.frames;
		}
	}
	
	drawAt(ctx, cx, cy) {
		if(!this.img || !this.visible) return;
		var fx = this.curFrame * this.framew;
		var fy = this.curRow * this.frameh;
		ctx.drawImage(this.img, fx, fy, this.framew, this.frameh, cx, cy, this.scalew, this.scaleh);
	}
	
	draw(ctx) {
		if(!this.img || !this.visible) return;
		this.drawAt(ctx, this.x, this.y);
	}
	
	hitCheck(clickCoords, isDown) {
	}
}

class MegaMan extends Sprite {
	constructor() {
		super();
		this.gunH = 13;
	}
	
	stopShooting() {
		this.curRow = 0;
	}
	
	startShooting() {
		this.curRow = 1;
	}
	
	/*hitCheck(clickCoords, isDown) {
		if(isDown) {
			this.curRow = 1;
		} else {
			this.curRow = 0;
		}
	}*/
}