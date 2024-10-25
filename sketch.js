/*
 * GUI to create simulation of 8 sensors to be used to test Bela synth.
 * manipulating sliders represents change in sensor data.
 * also includes play/stop btn and amplitude slider.
 * uses DOM objects available in p5.js: https://p5js.org/reference/#group-DOM
 *
 */

let isPlaying = 1;
let buffer = [0,0,0,0,0,0,0,0,0,0]; // data to send to Bela. 10 values: 1 button, 1 amp slider, 8 sensor slider

function setup() {

	button = createButton("PLAY/STOP");
	button.mouseClicked(changeButtonState);

	ampSlider = createSlider(0, 100, 50);
	s1Slider = createSlider(0, 100, 60);
	s2Slider = createSlider(0, 100, 60);
	s3Slider = createSlider(0, 100, 60);
	s4Slider = createSlider(0, 100, 60);
	s5Slider = createSlider(0, 100, 60);
	s6Slider = createSlider(0, 100, 60);
	s7Slider = createSlider(0, 100, 60);
	s8Slider = createSlider(0, 100, 60);

	pAmp = createP("Amplitude:");
	ps1 = createP("Sensor 1");
	ps2 = createP("Sensor 2");
	ps3 = createP("Sensor 3");
	ps4 = createP("Sensor 4");
	ps5 = createP("Sensor 5");
	ps6 = createP("Sensor 6");
	ps7 = createP("Sensor 7");
	ps8 = createP("Sensor 8");

	formatDOMElements();
	
	changeButtonState();

}

function draw() {

	// store values in the buffer
	// divide by 100 to convert range from [0, 100] to [0,1]
    buffer[1]=ampSlider.value()/100;
	buffer[2]=isPlaying;
	buffer[0]=s1Slider.value()/100;
	buffer[3]=s2Slider.value()/100;
	buffer[4]=s3Slider.value()/100;
	buffer[5]=s4Slider.value()/100;
	buffer[6]=s5Slider.value()/100;
	buffer[7]=s6Slider.value()/100;
	buffer[8]=s7Slider.value()/100;
	buffer[9]=s8Slider.value()/100;

	// send float buffer arry to Bela
    Bela.data.sendBuffer(0, 'float', buffer);

}

function formatDOMElements() {

	// format START/STOP button
	button.position(50,50);
	button.size(100,100);
	button.style('font-weight','bolder');
	button.style('border', '2px solid #000000');
	button.style('border-radius', '50%');
	button.style('color', 'white');
	
	// postition amp slider
	ampSlider.position(50,200);
	pAmp.position(50,160);
	
	// postition circular arrangement of sensor sliders
	let radius = windowHeight/3;
	let sliderCenterX = ampSlider.width/2;
	let sliderCenterY = ampSlider.height/2
	let calcX = (i) => (windowWidth/2 + radius * Math.cos(2*Math.PI/8*(i+5)) - sliderCenterX);
	let calcY = (i) => (windowHeight/2 + radius * Math.sin(2*Math.PI/8*(i+5)) - sliderCenterY);
	
	// position slider components
	s1Slider.position(calcX(1),calcY(1));
	s2Slider.position(calcX(2),calcY(2));
	s3Slider.position(calcX(3),calcY(3));
	s4Slider.position(calcX(4),calcY(4));
	s5Slider.position(calcX(5),calcY(5));
	s6Slider.position(calcX(6),calcY(6));
	s7Slider.position(calcX(7),calcY(7));
	s8Slider.position(calcX(8),calcY(8));
	
	// position slider labels
	ps1.position(s1Slider.x, s1Slider.y);
	ps2.position(s2Slider.x, s2Slider.y);
	ps3.position(s3Slider.x, s3Slider.y);
	ps4.position(s4Slider.x, s4Slider.y);
	ps5.position(s5Slider.x, s5Slider.y);
	ps6.position(s6Slider.x, s6Slider.y);
	ps7.position(s7Slider.x, s7Slider.y);
	ps8.position(s8Slider.x, s8Slider.y);

}


function changeButtonState() {
	isPlaying = 1 - isPlaying;
	if (isPlaying === 0) {
		button.style('background-color','green');
	}
	else {
		button.style('background-color','red');
	}
}
