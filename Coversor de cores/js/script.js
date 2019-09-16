//getInputs

const inputHex = document.getElementById("inputHex");
const inputsRgb = document.getElementsByClassName("rgb");
const inputsHsv = document.getElementsByClassName("hsv");
const inputsCmyk = document.getElementsByClassName("cmyk");
const inputs = document.getElementsByTagName("input");

//set readonlys

function typeColorChange(select){
	const value = select.value;

	for(let i = 0;i < inputs.length; i++){
		inputs[i].readOnly = true;
	}

	if(value == "Hex"){
		inputHex.readOnly = false;
	} else if(value ==  "RGB"){
		for(let i = 0; i < 3; i++){
			inputsRgb[i].readOnly = false;
		}
	} else if(value == "HSV"){
		for(let i = 0; i < 3; i++){
			inputsHsv[i].readOnly = false;
		}
	} else {
		for(let i = 0; i < 4; i++){
			inputsCmyk[i].readOnly = false;
		}
	}

}

//converters

function hexToRgb(value){
	let red = value.slice(0,2);
	let green = value.slice(2,4);
	let blue = value.slice(4,6);

	red = parseInt(red, 16);
	green = parseInt(green, 16);
	blue = parseInt(blue, 16);

	inputsRgb[0].value = red;
	inputsRgb[1].value = green;
	inputsRgb[2].value = blue;

	let colors = [red, green, blue];
	return(colors);


	
}

function hsvToRgb(hsv){
	let red, green, blue;

	hsv[1] = hsv[1]/100;
	hsv[2] = hsv[2]/100;
	if(hsv[0] == 360) hsv[0] = 0;

	const c = hsv[2] * hsv[1];
	let num = (hsv[0]/60) % 2 - 1;
	if(num < 0) num = num * -1;
	const x = c * (1 - num);
	const m = hsv[2] - c;

	if (hsv[0] < 60) {red = c; green = x; blue = 0;}
	else if (hsv[0] < 120) {red = x; green = c; blue = 0;}
	else if (hsv[0] < 180) {red = 0; green = c; blue = x;}
	else if (hsv[0] < 240) {red = 0; green = x; blue = c;}
	else if (hsv[0] < 300) {red = x; green = 0; blue = c;}
	else if (hsv[0] < 360) {red = c; green = 0; blue = x;}

	red = Math.round((red + m) * 255);
	green = Math.round((green + m) * 255);
	blue = Math.round((blue + m) * 255);

	let rgb = [red, green, blue];

	for(let i in inputsRgb){
		inputsRgb[i].value = rgb[i];
	}
	return rgb;
}

function cmykToRgb(cmyk){
	let red, green, blue;

	for (let i in cmyk){
		cmyk[i] = cmyk[i]/100;
	}

	red = Math.round(255 * (1 - cmyk[0]) * (1 - cmyk[3]));
	green = Math.round(255 * (1 - cmyk[1]) * (1 - cmyk[3]));
	blue = Math.round(255 * (1 - cmyk[2]) * (1 - cmyk[3]));

	let rgb = [red, green, blue];

	for(let i in inputsRgb){
		inputsRgb[i].value = rgb[i];
	}
	return rgb;
}

function rgbToHex(rgb){
	let hex;
	for(let i in rgb){
		let convertedNumber = Number(rgb[i]).toString(16);
		if(convertedNumber.length == 1){
			convertedNumber = 0 + convertedNumber;
		}
		if(i == 0){
			hex = convertedNumber;
		} else {
			hex += convertedNumber;
		}
	}
	inputHex.value = hex.toUpperCase();
	return hex;
}

function rgbToHsv(rgb){
	let red = rgb[0]/255;
	let green = rgb[1]/255;
	let blue = rgb[2]/255;
	let hue, saturation, brightness, cMax, cMin, delta;

	cMax = Math.max(red, blue, green);
	cMin = Math.min(red, blue, green);
	delta = cMax - cMin;

	if(delta == 0){
		hue = 0;
	} else if(cMax == red){
		hue = 60 * ((green - blue)/delta);
	} else if(cMax == green){
		hue = 60 * ((blue - red)/delta + 2);
	} else {
		hue = 60 * ((red - green)/delta + 4);
	}

	if(hue < 0){
		hue += 360;
	}

	if(cMax == 0){
		saturation = 0;
	} else {
		saturation = (delta/cMax) * 100;
	}

	brightness = Math.round(cMax * 100);

	saturation = Math.round(saturation);
	hue = Math.round(hue);

	inputsHsv[0].value = hue + "°";
	inputsHsv[1].value = saturation + "%";
	inputsHsv[2].value = brightness + "%";

	let hsv = [hue, saturation, brightness];
	return hsv;
}

function rgbToCmyk(rgb){
	let red = rgb[0]/255;
	let green = rgb[1]/255;
	let blue = rgb[2]/255;
	let key, cyan, magenta, yellow, max;

	key = 1 - Math.max(red, green, blue);
	cyan = Math.round(((1 - red - key)/(1 - key))*100);
	magenta = Math.round(((1 - green - key)/(1 - key))*100);
	yellow = Math.round(((1 - blue - key)/(1 - key))*100);
	key = Math.round(key*100);

	inputsCmyk[0].value = cyan;
	inputsCmyk[1].value = magenta;
	inputsCmyk[2].value = yellow;
	inputsCmyk[3].value = key;

	let cmyk = [cyan, magenta, yellow, key];
	return cmyk;
}

//triggers

function Hexadecimal(input){
	const padraoHex = /[0-9a-f]{6}/i;
	const notHex = /[^0-9a-f]/i;
	input.value = input.value.replace(notHex, "");


	if(padraoHex.test(input.value)){
		rgbToCmyk(hexToRgb(input.value));
		rgbToHsv(hexToRgb(input.value));
		changeBackground(input.value);
	}
}

function RGB(input){
	input.value = input.value.replace(/\D/, "");
	if(input.value < 0 || input.value > 255){
		alert("O número tem que estar entre 0 e 255!");
	} else if(voidInput(inputsRgb)){
		let rgb = [];
		for(i = 0; i < 3; i++){
			rgb.push(Number(inputsRgb[i].value));
		}
		rgbToCmyk(rgb);
		rgbToHsv(rgb);
		changeBackground(rgbToHex(rgb));
	}
}

function HSV(input){
	input.value = input.value.replace(/\D/, "");
	if(inputsHsv[0].value < 0 || inputsHsv > 360){
		alert("Hue deve estar entre 0 e 360!");
	} else if (inputsHsv[1].value < 0 || inputsHsv[1].value > 100){
		alert("Saturation deve estar entre 0 e 100!");
	} else if (inputsHsv[2].value < 0 || inputsHsv[2].value > 100){
		alert("Brightness deve estar entre 0 e 100!");
	} else if(voidInput(inputsHsv)){
		let hsv = [];
		for(let i in inputsHsv){
			hsv.push(inputsHsv[i].value);
		}
		let rgb = hsvToRgb(hsv);
		changeBackground(rgbToHex(rgb));
		rgbToCmyk(rgb);
	}
}

function CMYK(input){
	input.value = input.value.replace(/\D/, "");
	if(input.value < 0 || input.value > 100){
		alert("O número tem que estar entre 0 e 100!");
	} else if(voidInput(inputsCmyk)){
		let cmyk = [];
		for(i = 0; i < 4; i++){
			cmyk.push(inputsCmyk[i].value);
		}
		let rgb = cmykToRgb(cmyk);
		changeBackground(rgbToHex(rgb));
		rgbToHsv(rgb);
	}
}

function voidInput(input){
	for(let i in input){
		if(input[i].value == ""){
			return false;
		}
	}
	return true;
}

function changeBackground(color){
	document.getElementsByTagName("body")[0].style.background = "#" + color;
}

window.onload = function(){
	const select = document.getElementById("selectColor");
	typeColorChange(select);
}