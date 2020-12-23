var dayofweek = ["日)","月)","火)","水)","木)","金)","土)"];
var showTime = true;
var use24HourClock = true;
var time_block;
var clock_elem;
var date_elem;
var avail_height;
var font = "KosugiMaru-Regular";
var font_weight = "-Regular";
var sunrise = 365;
var sunset = 1155;
var sunrise_duration = 10;
var currentMinute = 0;

window.wallpaperPropertyListener = {
	applyUserProperties: function(properties) {
		if (properties.showTime) {
			showTime = properties.showTime.value;
			if(!showTime) {
				time_block.style.visibility = "collapse";
			} else {
				time_block.style.visibility = "visible";
			}
		}
		if (properties.sunrise) {
			let input = properties.sunrise.value.split(":");
			let hours = parseInt(input[0]) % 24;
			let minutes = parseInt(input[1]) % 60;
			let total_mins = 60 * hours + minutes;
			if (total_mins > 0) {
				sunrise = total_mins;
			}
			currentMinute = -1;
		}
		if (properties.sunset) {
			let input = properties.sunset.value.split(":");
			let hours = parseInt(input[0]) % 24;
			let minutes = parseInt(input[1]) % 60;
			let total_mins = 60 * hours + minutes;
			if (total_mins > 0) {
				sunset = total_mins;
			}
			currentMinute = -1;
		}
		if (properties.sunriseTime) {
			let minutes = parseInt(properties.sunriseTime.value) % 100;
			if (minutes > 0) {
				sunrise_duration = minutes;
			}
			currentMinute = -1;
		}
		if (properties.customTime) {
			let timeType = properties.customTime.value;
			use24HourClock = timeType;
		}
		if (properties.dateFormat) {
			let date_format = properties.dateFormat.value;
			if(date_format == 1) {
				dayofweek = ["日)","月)","火)","水)","木)","金)","土)"];
			} else {
				dayofweek = ["日)","一)","二)","三)","四)","五)","六)"];
			}
		}
		if (properties.clockSize) {
			let sizePref = properties.clockSize.value;
			let font_size = sizePref + "em";
			time_block.style.fontSize = font_size;
		}
		if(properties.fontType) {
			let fontType = properties.fontType.value;
			if(fontType == 1) {
				font = "KosugiMaru-Regular";
				time_block.style.fontFamily = font;
				clock_elem.style.fontSize = "2em";
			} else if (fontType == 2) {
				font = "Kosugi-Regular";
				time_block.style.fontFamily = font;
				clock_elem.style.fontSize = "2em";
			} else if (fontType == 3) {
				font = "SawarabiMincho";
				time_block.style.fontFamily = font;
				clock_elem.style.fontSize = "2em";
			} else if (fontType == 4) {
				font = "MPLUS1p" + font_weight;
				time_block.style.fontFamily = font;
				clock_elem.style.fontSize = "1.8em";
			} else if (fontType == 5) {
				font = "MPLUSRounded1c" + font_weight;
				time_block.style.fontFamily = font;
				clock_elem.style.fontSize = "1.8em";
			} else if (fontType == 6) {
				font = "NotoSansJP" + font_weight;
				time_block.style.fontFamily = font;
				clock_elem.style.fontSize = "2em";
			} else if (fontType == 7) {
				font = "NotoSerifJP" + font_weight;
				time_block.style.fontFamily = font;
				clock_elem.style.fontSize = "2em";
			} else {
				font = "KosugiMaru-Regular";
				time_block.style.fontFamily = font;
				clock_elem.style.fontSize = "2em";
			}
		}
		if(properties.fontWeight) {
			let fontWeight = properties.fontWeight.value;
			font_weight = fontWeight;
			font = font.split("-")[0] + fontWeight;
			time_block.style.fontFamily = font;
		}
	}
};

function rescaleWindow() {
	//Set clock position right above taskbar, or above watermark if taskbar hidden
	//If taskbar hidden, max will return screen.height * 0.02 which is above watermark of background picture
	//If not hidden, then max will return screen.height - avail_height + 10, which is right above taskbar
	avail_height = screen.availHeight;
	time_block.style.bottom = Math.max((screen.height - avail_height + 10), screen.height * 0.02) + "px";
}

function load() {
	//Init vars
	time_block = document.getElementById("time");
	clock_elem = document.getElementById("clock");
	date_elem = document.getElementById("date");

	//Update Clock Location
	rescaleWindow();

	//Initialize clock and time of day
	update();
	dayCheck();

	//Set update intervals
	setInterval(update,1000);//update every second
}

function formatHours(hr) {
	var newHr = "";
	if(hr == 0) {
		newHr += use24HourClock ? "00" : "12";
	} else {
		newHr += ((use24HourClock ? '0' + hr : '0' + hr % 12) || 12).slice(-2);
	}
	return newHr;
}

function update() {
	//Check to see if window has changed, update clock position if changed
	if(screen.availHeight != avail_height) {
		rescaleWindow();
	}

	//Get new date value
	var d = new Date();

	if(d.getMinutes() != currentMinute) {
		currentMinute = d.getMinutes();
		dayCheck();
	}

	if(showTime) {
		//Use new date value to update time and date
		clock_elem.innerHTML = '' + formatHours(d.getHours()) + ":" + ('0' + d.getMinutes()).slice(-2);
		date_elem.innerHTML = d.getFullYear() + "年" + (d.getMonth()+1) + "月" + d.getDate() + "日 (" + dayofweek[d.getDay()];
	}
}

function dayCheck() {
	//Get new date value
	let dayTime = new Date();

	//Get current time
	let curHour = dayTime.getHours();
	let curMin = dayTime.getMinutes();
	let mins = 60 * curHour + curMin;

	var imageUrl;
	if(mins < sunrise) {
		imageUrl = "url(./files/night01.jpg)";
	} else if(sunrise <= mins && mins < sunrise + sunrise_duration) {
		imageUrl = "url(./files/sunset01.jpg)";
	} else if(mins < sunset) {
		imageUrl = "url(./files/day01.jpg)";
	} else if(sunset <= mins && mins < sunset + sunrise_duration) {
		imageUrl = "url(./files/sunset01.jpg)";
	} else {
		imageUrl = "url(./files/night01.jpg)";
	}
	document.body.style.backgroundImage = imageUrl;
}
