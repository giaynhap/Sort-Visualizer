


algorythmName = Heap
/* config alogrithm
 Select
 Insert
 Bubble
 Merge
 Quick
 Heap
 Radix

*/
class Display{

	init(id)
	{
		this.canvas = document.getElementById(id);
		this.ctx = this.canvas.getContext("2d");
		this.frame = this.frame.bind(this)
		this.canvas.height=200;
		this.canvas.width=300*4;
	}
	startFrame()
	{
		 window.requestAnimationFrame(this.frame);
	}
	frame()
	{
		this.perFrame();
		this.draw();
		this.endFrame();	
	}

	perFrame()
	{
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);  
		this.ctx.fillStyle = "#ff0000"
	}

	draw()
	{
		for (var i in this.drawValue)
		{
			this.moveColDraw(i);
			let height = this.drawValue[i]*this.canvas.height/this.maxValue;
			this.ctx.fillRect(i*4, this.canvas.height-height , 3, height );
		}
	}
	moveColDraw(index)
	{

		if (this.animation&&Math.abs(this.drawValue[index]-this.input[index])>2)
		{
			var vec = Math.abs(this.drawValue[index] - this.input[index] )/ (this.drawValue[index] - this.input[index] )
			this.drawValue[index]-=vec*2;
		}else
		{
			this.drawValue[index] = this.input[index]
		}
	}
	endFrame()
	{
		window.requestAnimationFrame(this.frame);
	}
	setArray(input,maxSize = 10)
	{
		this.input = input.slice();
		this.drawValue =this.input.slice();
		this.maxValue = maxSize;
		
	}
}
// Audio API javascript :D
audioCtx = new(window.AudioContext || window.webkitAudioContext)();
 
 // Display 1 with anim 

let objDisplay = new Display();
objDisplay.init("myCanvas");
objDisplay.startFrame();
objDisplay.animation = true;

// display 2 no anim
let objDisplay2 = new Display();
objDisplay2.init("myCanvas2");
objDisplay2.startFrame();

// display 3 when done
let objDisplay3 = new Display();
objDisplay3.init("myCanvas3");
objDisplay3.startFrame();


let objRadix = new algorythmName();
// time check;
let start = timeStamp();
// sort input
var input2 =  makeTest();
objDisplay.setArray(input2,300);
objDisplay2.setArray(input2,300);
objDisplay3.setArray(input2,300);


// hook algorithm processing
objRadix.eventMoving = async function(x,y,data,data2)
{
 	if (x==-1){
	 objDisplay.input[y] = data;
	 objDisplay2.input[y] = data;
	}
	else{
		objDisplay.input[x] = data;
		objDisplay2.input[x] = data;
		objDisplay.input[y] = data2;
		objDisplay2.input[y] = data2;
	}
	  await beep(data*10+200);
 
}

objRadix.eventMoved = async function(data)
{
 objDisplay3.setArray(data,300);
 return ;
	
}

objRadix.eventDone = async function(data)
{
	for (var k in data)
	{
		await beep(data[k]*10+200);
	}

}


// do sort
let result = objRadix.sort( input2 );
result.then(function(value){
	let end = timeStamp();
	console.log(end-start);
})


function makeTest()
{
	let arr = [];
	for (var i =0;i<100;i++)
	{
		arr[i] = Math.floor(Math.random() * Math.floor(300)) ;
	}
	return arr;
}

function timeStamp()
{
	return  new Date().getTime();
}



function beep(frequency=900) {

	volume = 1;

	type = "sine";
	duration = 300;
  var oscillator = audioCtx.createOscillator();
  var gainNode = audioCtx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  gainNode.gain.value = volume;
  oscillator.frequency.value = frequency;
  oscillator.type = type;

  oscillator.start();
  return new Promise(function(end){
		setTimeout(
		function() {
			oscillator.stop();
			end();
		},
			duration/10
		);
  })

};
 beep();