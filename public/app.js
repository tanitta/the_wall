window.onload = function(){
	theWall();
}

function theWall(){
	io = new RocketIO().connect();
	var is_down = false;
	var pos_x = 0;
	var pos_y = 0;
	var canvas;
	var context;
	
	init();
	function init(){
		canvas = document.getElementById("canvas1");
		context = canvas.getContext('2d');
		context.strokeStyle = "#000";
		context.fillStyle = "#F66";

		var img = new Image();
		img.src = "test.png";
		img.onload = function() {
			console.log("init...");
			io.push("init", "");
			console.log("image loaded");
		}
	}

	canvas.addEventListener('mousedown', down);
	function down(){
		is_down = true;
	}
	
	canvas.addEventListener('mousemove', move);
	function move(e) {
		var canvasRect = canvas.getBoundingClientRect();
		if(is_down){
			io.push("hello", pos_x+","+pos_y+","+(e.clientX-canvasRect.left)+","+(e.clientY-canvasRect.top));
		}
		pos_x = e.clientX-canvasRect.left;
		pos_y = e.clientY-canvasRect.top;

	}
	
	canvas.addEventListener('mouseup', up);
	function up(){
		is_down = false;
	}

	function draw(x1,y1,x2,y2,width,color){
		context.lineWidth = width;
		context.strokeStyle = color;
		context.moveTo(x1, y1);
		context.lineTo(x2, y2);
		context.stroke();
	}

	io.on("echo", function(message){
		p = message.split(",");
		draw(parseFloat(p[0]),parseFloat(p[1]),parseFloat(p[2]),parseFloat(p[3]),1,"#000000");
	});


	io.on("request_image", function(message){
		var img_png_src = canvas.toDataURL();

		io.push("push_image", img_png_src);
	});

	io.on("requested_image", function(message){
		console.log("start load log");
		var requested_img = new Image();
		// console.log(message.message);

		requested_img.src = message.message;
		requested_img.onload = function() {
			console.log("loaded log");
			context.drawImage(requested_img, 0, 0);
		}
	});
}

