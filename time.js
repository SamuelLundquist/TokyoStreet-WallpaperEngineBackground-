var backgroundList = ["night01.jpg","night01.jpg","night01.jpg","night01.jpg","night01.jpg","night01.jpg","sunset01.jpg","sunset01.jpg","day01.jpg","day01.jpg","day01.jpg","day01.jpg","day01.jpg","day01.jpg","day01.jpg","day01.jpg","day01.jpg","day01.jpg","day01.jpg","sunset01.jpg","sunset01.jpg","night01.jpg","night01.jpg","night01.jpg","night01.jpg"];
var dayofweek = ["日)","月)","火)","水)","木)","金)","土)"];
var use24HourClock = true;
var time_block;
var clock_elem;
var date_elem;
var avail_height;
var font = "KosugiMaru-Regular";
var font_weight = "-Regular";

window.wallpaperPropertyListener = {
	applyUserProperties: function(properties) {
		if (properties.customTime) {
			let timeType = properties.customTime.value;
			use24HourClock = timeType;
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
	setInterval(dayCheck, 60000);//update every minute
}

function formatHours(hr) {
	var newHr = "";
	if(hr == 0) {
		newHr += use24HourClock ? "00" : "12";
	} else {
		newHr += ((use24HourClock ? '0' + d.getHours() : '0' + d.getHours() % 12) || 12).slice(-2);
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

	//Use new date value to update time and date
	clock_elem.innerHTML = '' + formatHours(d.getHours()) + ":" + ('0' + d.getMinutes()).slice(-2);

	date_elem.innerHTML = d.getFullYear() + "年" + (d.getMonth()+1) + "月" + d.getDate() + "日 (" + dayofweek[d.getDay()];
}

function dayCheck() {
	//Get new date value
	var dayTime = new Date();

	//Get currrent time
	var curHour = dayTime.getHours();

	//Using current time, determine whether sunrise, day, sunset, or night
	var imageUrl = "url(./files/" + backgroundList[curHour] + ")";
	document.body.style.backgroundImage = imageUrl;
}
