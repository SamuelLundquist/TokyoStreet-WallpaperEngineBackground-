var dayofweek = ["日)","月)","火)","水)","木)","金)","土)"];
var usTime = false;
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

//Function used to load and preferences from Wallpaper Engine
window.wallpaperPropertyListener = {
	applyUserProperties: function(properties) {
		//Function used to hide and show time
		if (properties.showTime) {
			showTime = properties.showTime.value;
			if(!showTime) {
				time_block.style.visibility = "collapse";
			} else {
				time_block.style.visibility = "visible";
			}
		}
		//Function used to set the sunrise time
		if (properties.sunrise) {

			//Parse user input, mod to handle input outside of what is expected
			//Converts hours and minutes to just minutes
			let input = properties.sunrise.value.split(":");
			let hours = parseInt(input[0]) % 24;
			let minutes = parseInt(input[1]) % 60;
			let total_mins = 60 * hours + minutes;

			//If new input valid, update sunrise time
			if (total_mins > 0) {
				sunrise = total_mins;
				//Update current minute to -1, which forces update() to run
				//dayCheck() to properly display changes made to wallpaper
				currentMinute = -1;
			}
		}
		//Function used to set the sunset time
		if (properties.sunset) {

			//Parse user input, mod to handle input outside of what is expected
			//Converts hours and minutes to just minutes
			let input = properties.sunset.value.split(":");
			let hours = parseInt(input[0]) % 24;
			let minutes = parseInt(input[1]) % 60;
			let total_mins = 60 * hours + minutes;

			//If new input valid, update sunset time
			if (total_mins > 0 && total_mins > sunrise) {
				sunset = total_mins;
				//Update current minute to -1, which forces update() to run
				//dayCheck() to properly display changes made to wallpaper
				currentMinute = -1;
			}
		}
		//Function used to set the sunset/sunrise duration
		if (properties.sunriseTime) {

			//Parse user input, takes int and mods by 100, to handle excessive input
			let minutes = parseInt(properties.sunriseTime.value) % 100;

			//If new input valid, update sunrise duration
			if (minutes > 0) {
				sunrise_duration = minutes;
				//Update current minute to -1, which forces update() to run
				//dayCheck() to properly display changes made to wallpaper
				currentMinute = -1;
			}
		}
		//Function to determine clokc format, either 24hr or 12hr format
		if (properties.customTime) {
			let timeType = properties.customTime.value;
			use24HourClock = timeType;
		}
		//Function used to update the date format
		if (properties.dateFormat) {
			let date_format = properties.dateFormat.value;
			if(date_format == 1) //Japanese time format
			{
				usTime = false; //Non US time: year month day
				date_elem.style.fontSize = ".5em"; //Standard date font size
				dayofweek = ["日)","月)","火)","水)","木)","金)","土)"];
			}
			else if(date_format == 2) //Chinese time format
			{
				usTime = false; //Non US time: year month day
				date_elem.style.fontSize = ".5em"; //Standard date font size
				dayofweek = ["日)","一)","二)","三)","四)","五)","六)"];
			}
			else //English time format
			{
				usTime = true; //US time changes format to month day year
				date_elem.style.fontSize = ".45em"; //English format slightly longer, adjusts font accordingly
				dayofweek = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
			}
		}
		//Function used to update clock and date size
		if (properties.clockSize) {
			let sizePref = properties.clockSize.value;
			let font_size = sizePref + "em";

			//Time block includes clock and date, adjusts both of them simlutaneously
			time_block.style.fontSize = font_size;
		}
		//Function used to select and update font family
		if(properties.fontType) {
			let fontType = properties.fontType.value;

			// Some fonts have weights, the weight preference box in project.json
			// is only visible if a font that different weights are selected.
			// This includes fonts 4 - 7, which is why properties.fontType.value doesn't
			// just return the fontFamily name. This would be much more efficient,
			// but this function is only run on start or on font change.
			// Since this is the case, we don't get much of a performance boost
			// from simplifying this function.
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
		// Function to update the font weight
		if(properties.fontWeight) {
			let fontWeight = properties.fontWeight.value;
			//Update font weight preference
			font_weight = fontWeight;

			// Takes current font, removes the weight form the end of the string
			// adds the new font weight to the end of the string
			font = font.split("-")[0] + fontWeight;

			// Updates font
			time_block.style.fontFamily = font;
		}
	}
};

//Function to update clock and date location when window is rescaled
function rescaleWindow() {
	//Set clock position right above taskbar, or above watermark if taskbar hidden
	//If taskbar hidden, max will return screen.height * 0.02 which is above watermark of background picture
	//If not hidden, then max will return screen.height - avail_height + 10, which is right above taskbar
	avail_height = screen.availHeight;
	time_block.style.bottom = Math.max((screen.height - avail_height + 10), screen.height * 0.02) + "px";
}

// Function used to initialize the web wallpaper
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

	//Set update interval
	setInterval(update,1000);//update every second
}

//Function used to format hours for clock, takes an int and returns a string
function formatHours(hr) {
	var newHr = "";
	if(hr == 0) // For hour 0, replace with 12 for 12hr format
	{
		newHr += use24HourClock ? "00" : "12";
	}
	else // Otherwise get hour in two digit 24hr or 12hr format
	{
		newHr += ((use24HourClock ? '0' + hr : '0' + hr % 12) || 12).slice(-2);
	}
	return newHr;
}

// Function used to update the web wallpaper, called every second
function update() {

	//Get new date value
	var d = new Date();

	// If it has been a minute, run dayCheck()
	// Can also be triggered by a change to sunrise/sunset time or duration
	if(d.getMinutes() != currentMinute) {
		currentMinute = d.getMinutes();
		dayCheck();
	}

	// If clock and date are visible, updates the clock and date
	if(showTime) {

		//Check to see if window has changed, update clock position if changed
		if(screen.availHeight != avail_height) {
			rescaleWindow();
		}

		// Updates the clock div
		clock_elem.innerHTML = '' + formatHours(d.getHours()) + ":" + ('0' + d.getMinutes()).slice(-2);

		// Updates the date div
		if(usTime) // Month Day Year format
		{
			date_elem.innerHTML = (d.getMonth()+1) + "/" + d.getDate() + "/" + d.getFullYear() + " " + dayofweek[d.getDay()];
		}
		else // Year month day format
		{
			date_elem.innerHTML = d.getFullYear() + "年" + (d.getMonth()+1) + "月" + d.getDate() + "日 (" + dayofweek[d.getDay()];
		}
	}
}

// Function used to update the wallpaper background
function dayCheck() {

	// Get new date value
	let dayTime = new Date();

	// Get current time
	let curHour = dayTime.getHours();
	let curMin = dayTime.getMinutes();
	let mins = 60 * curHour + curMin;

	// Takes current time and determines what background should be displayed
	var imageUrl;
	if(mins < sunrise) {
		imageUrl = "url(./media/night01.jpg)";
	} else if(sunrise <= mins && mins < sunset && mins < sunrise + sunrise_duration) {
		imageUrl = "url(./media/sunset01.jpg)";
	} else if(mins < sunset) {
		imageUrl = "url(./media/day01.jpg)";
	} else if(sunset <= mins && mins < sunset + sunrise_duration) {
		imageUrl = "url(./media/sunset01.jpg)";
	} else {
		imageUrl = "url(./media/night01.jpg)";
	}

	//Update the wallpaper background
	document.body.style.backgroundImage = imageUrl;
}
