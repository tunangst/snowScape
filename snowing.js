const main = document.querySelector('main');
let windowHeight = main.clientHeight;
let windowWidth = main.clientWidth;
const numberOfSnowflakes = 1000;
let spawningCloud = [];
let reset = false;
// let resetPosition = false;
const requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.msRequestAnimationFrame;


//================================================global functions=====
const getSupportedTransform = () => {
	const transforms = ['transform', 'msTransform', 'webkitTransform', 'mozTransform', 'oTranssform'];
	for (let index = 0; index < transforms.length; index++) {
		if (typeof document.body.style[transforms[index]] !== 'undefined') {
			return transforms[index];
		}
	}
	return null;
};
const startUp = () => {
	window.addEventListener('DOMContentLoaded', buildSnowflakes, false);
	window.addEventListener('resize', checkScreenSize, false);
};
// const setResized = () => {
// 	reset = true;
// };
const getFloatDirection = () => {
	let plusOrMinus = randomBetween(0, 1, 'round');
	if (plusOrMinus === 0) {
		return -1;
	} else {
		return 1;
	}
};
const getStartX = () => {
	let newSpawn = randomBetween(0, windowWidth, 'round');
	return newSpawn;
};
const getStartY = () => {
	let startDelay = randomBetween(-100, -10000, `round`);
	return startDelay;
};

const getFallSpeed = (tier) => {
	let speed = 0;
	switch (tier) {
		case 1:
			speed = randomBetween(800, 1000, 'round');
			break;
		case 2:
			speed = randomBetween(400, 500, 'round');
			break;
		case 3:
			speed = randomBetween(100, 200, 'round');
			break;
		default:
			console.log(`no tier, no speed`);
	}
	return speed;
};
const getVariation = (axis) => {
	let vary;
	if (axis === `x`) {
		vary = randomBetween(-1, 1, 'noround');
	} else {
		vary = randomBetween(-20, 20, 'noround');
	}
	return vary;
};
const getOpacity = (tier) => {
	let alpha = 0;
	switch (tier) {
		case 1:
			alpha = randomBetween(.05, .1, 'noround');
			break;
		case 2:
			alpha = randomBetween(.8, 1, 'noround');
			break;
		case 3:
			alpha = randomBetween(.4, .6, 'noround');
			break;
		default:
			console.log(`no tier, no alpha`);
	}
	return alpha;
};
const getHeight = (tier) => {
	let size = 0;
	switch (tier) {
		case 1:
			size = randomBetween(50, 200, 'round');
			break;
		case 2:
			size = randomBetween(15, 20, 'round');
			break;
		case 3:
			size = randomBetween(8, 12, 'round');
			break;
		default:
			console.log(`no tier, no size`);
	}
	return size;
};
const getWidth = (height) => {
	let size = 0;
	let heightMin = height - height * (20 / 100);
	let heightMax = height + height * (20 / 100);
	size = randomBetween(heightMin, heightMax, 'round');
	return size;
};
const getTranslate = (target, x, y, degrees) => {
	x = Math.round(x);
	y = Math.round(y);
	let moveHere = `translate3d(${x}px,${y}px,0) rotate(${degrees}deg)`;
	target.style[transformProperty] = moveHere;
};
const getBlur = (tier) => {
	let range = 0;
	switch (tier) {
		case 1:
			range = `0 0 100px 20px #fff`;
			break;
		case 2:
			range = `0 0 3px 0 #fff`;
			break;
		case 3:
			range = `0 0 1px 0 #fff`;
			break;
		default:
			console.log(`no tier, no size`);
	}
	return range;
};
const checkScreenSize = () => {
	console.log(`updated size`)
	windowHeight = document.documentElement.clientHeight;
	windowWidth = document.documentElement.clientWidth;
	// windowHeight = main.clientHeight;
	// windowWidth = main.clientWidth;
};
const randomBetween = (min, max, round) => {
	const number = Math.random() * (max - min) + min;
	if (round === 'round') {
		let roundedNumber = Math.round(number);
		return roundedNumber;
	} else {
		return number;
	}
};
const snowflakeCrafting = (tier) => {
	let startX = randomBetween(0, windowWidth, 'round');
	let startY = getStartY();

	let snowflakeHeight = getHeight(tier);
	let snowflakeWidth = getWidth(snowflakeHeight);
	let randomTopLeftBorderRadius = randomBetween(70, 100, 'round');
	let randomTopRightBorderRadius = randomBetween(70, 100, 'round');
	let randomBottomRightBorderRadius = randomBetween(70, 100, 'round');
	let randomBottomLeftBorderRadius = randomBetween(70, 100, 'round');
	let randomFloatDirection = getFloatDirection();
	let randomXVariation = getVariation(`x`);
	let randomYVariation = getVariation(`y`);
	let setFallSpeed = getFallSpeed(tier);
	let setOpacity = getOpacity(tier);
	let setRotation = randomBetween(0, 5, 'round');
	let blur = getBlur(tier);

	let craftedSnowflake = new Snowflake(
		startX,
		startY,
		tier,
		snowflakeWidth,
		snowflakeHeight,
		randomFloatDirection,
		randomXVariation,
		randomYVariation,
		setFallSpeed,
		setOpacity,
		setRotation,
	);
	craftedSnowflake.div.setAttribute('class', 'snowflake');
	craftedSnowflake.div.setAttribute('style',
		`border-radius: 
			${randomTopLeftBorderRadius}px 
			${randomTopRightBorderRadius}px 
			${randomBottomRightBorderRadius}px 
			${randomBottomLeftBorderRadius}px;
		height: ${snowflakeHeight}px;
		width: ${snowflakeWidth}px;
		left: ${startX}px;
		top: ${startY}px;
		opacity: ${setOpacity};
		box-shadow: ${blur};
		`);
	main.appendChild(craftedSnowflake.div);
	spawningCloud.push(craftedSnowflake);
};
const shuffleSnowflakes = (array) => {
	let arrayLength = array.length;
	let temp;
	let index;
	while (arrayLength > 0) {
		index = Math.floor(Math.random() * arrayLength);
		arrayLength--;
		// And swap the last element with it
		temp = array[arrayLength];
		array[arrayLength] = array[index];
		array[index] = temp;
	}
	return array;
};
const changeLocation = () => {
	for (let index = 0; index < spawningCloud.length; index++) {
		let chosenFlake = spawningCloud[index];
		//change 
		chosenFlake.update();
	}
	// if (reset) {
	// 	checkScreenSize();
	// 	reset = false;
	// }
	requestAnimationFrame(changeLocation);
}
const buildSnowflakes = () => {
	//change this number to get a good visual later, different percent
	let tier = 0;

	let numberOfSnowflakesT1 = numberOfSnowflakes * (5 / 100);
	let numberOfSnowflakesT2 = numberOfSnowflakes * (35 / 100);
	let numberOfSnowflakesT3 = numberOfSnowflakes * (60 / 100);

	for (let t1Count = 0; t1Count < numberOfSnowflakesT1; t1Count++) {
		tier = 1; //foreground
		snowflakeCrafting(tier);
	}
	for (let t2Count = 0; t2Count < numberOfSnowflakesT2; t2Count++) {
		tier = 2; //midground
		snowflakeCrafting(tier);
	}
	for (let t3Count = 0; t3Count < numberOfSnowflakesT3; t3Count++) {
		tier = 3; //background
		snowflakeCrafting(tier);
	}
	shuffleSnowflakes(spawningCloud);
	checkScreenSize();
	changeLocation();
};

const transformProperty = getSupportedTransform();
startUp();
//========================================================
class Snowflake {
	constructor(x, y, tier, width, height, float, xVary, yVary, speed, opacity, rotate) {
		this.div = document.createElement('div');
		this.xPosition = x;
		this.yPosition = y;
		this.delay = y;
		this.tier = tier;
		this.width = width;
		this.height = height;
		this.floatDirection = float;
		this.xVariation = xVary;
		this.yVariation = yVary;
		this.fallSpeed = speed;
		this.opacity = opacity;
		this.rotation = rotate;
		this.cosIncrement = 0;

	};

	update() {
		// checkScreenSize(); too much lag
		this.cosIncrement += .008;
		// this.cosIncrement += this.fallSpeed / 5000;
		this.xPosition += this.xVariation * this.floatDirection * this.fallSpeed * Math.cos(this.cosIncrement) / 40;
		this.yPosition += this.yVariation * Math.sin(this.cosIncrement) / 40 + this.fallSpeed / 30;
		this.rotation += this.floatDirection;

		// this.xVariation = getVariation(`x`);
		// this.yVariation = getVariation(`y`);

		//setmotion
		getTranslate(this.div, this.xPosition, this.yPosition, this.rotation);


		//limit #'s
		if (this.rotation > 360) {
			this.rotation -= 360;
		}
		if (this.rotation < -360) {
			this.rotation += 360;
		}

		//reloaction
		//delay is a negative number
		if (this.yPosition > windowHeight + this.height - this.delay) {
			this.yPosition = this.delay;
			this.xPosition = getStartX();

		}
		if (this.xPosition > windowWidth + this.width * 2) {
			this.xPosition = -this.width * 2;
		}
		if (this.xPosition < -this.width * 2) {
			this.xPosition = windowWidth + this.width * 2;
		}
	};
}