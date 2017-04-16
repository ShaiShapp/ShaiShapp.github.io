// Written by Shai Shapira in 2016, all rights reserved. Please do not use in any way without permission from me: http://shaishapira.com.

var canvas, ctx;

var cityNames = ["חיפה", "ירושלים", "תל אביב־יפו", "ראשון לציון", "פתח תקווה", "אשדוד", "נתניה", "באר־שבע", "חולון", "בני־ברק",
				"רמת־גן", "רחובות", "בת־ים", "אשקלון", "בית־שמש", "כפר סבא", "הרצליה", "מודיעין־מכבים־רעות", "חדרה", "נצרת",
				"רמלה", "לוד", "רעננה", "מודיעין עילית", "רהט", "גבעתיים", "קרית־אתא", "הוד השרון", "נהריה", "אום אל־פאחם",
				"קרית־גת", "אילת", "עכו", "ביתר עילית", "נס ציונה", "כרמיאל", "רמת השרון", "עפולה", "אלעד", "טבריה",
				"ראש העין", "נצרת עילית", "טייבה", "יבנה", "קרית מוצקין", "שפרעם", "קרית ביאליק", "קרית ים", "מעלה אדומים", "קרית אונו",
				"אור יהודה", "דימונה", "צפת", "תמרה", "נתיבות", "סכנין", "יהוד־מונוסון", "באקה אל־ע'רביה", "אופקים", "מגדל העמק",
				"גבעת שמואל", "טירה", "ערד", "נשר", "קרית שמונה", "שדרות", "כפר קאסם", "קרית מלאכי", "כפר יונה", "מעלות־תרשיחא",
				"יקנעם", "קלנסווה", "טירת הכרמל", "אריאל", "בית שאן", "אור עקיבא"];
var cityLocations = [[32.816667, 34.983333], [31.783333, 35.216667], [32.066667, 34.783333], [31.95, 34.8], [32.088828, 34.886333],
					[31.8, 34.65], [32.333333, 34.85], [31.258889, 34.799708], [32.016667, 34.766667], [32.083333, 34.833333],
					[32.083333, 34.816667], [31.897964, 34.808122], [32.016667, 34.75], [31.666667, 34.566667], [31.745686, 34.986647],
					[32.171389, 34.908333], [32.165278, 34.845833], [31.907653, 35.007614], [32.45, 34.916667], [32.701888, 35.294986],
					[31.933333, 34.866667], [31.948497, 34.889], [32.183333, 34.866667], [31.930556, 35.041667], [31.3925, 34.754444],
					[ 32.069722, 34.811667], [ 32.8, 35.1], [ 32.15, 34.883333], [ 33.005833, 35.098889], [ 32.519444, 35.153611],
					[ 31.606111, 34.771667], [ 29.55, 34.88], [ 32.927778, 35.081667], [ 31.697778, 35.115556], [ 31.933333, 34.8],
					[ 32.913717, 35.296089], [ 32.15, 34.833333], [ 32.606267, 35.288086], [ 32.052317, 34.951242], [ 32.7966, 35.535717],
					[ 32.095556, 34.956667], [ 32.716667, 35.333333], [ 32.266667, 35.010278], [ 31.883333, 34.733333], [ 32.833333, 35.083333],
					[ 32.805556, 35.169444], [ 32.823333, 35.093333], [ 32.833333, 35.066667], [ 31.775, 35.298056], [ 32.063611, 34.855278],
					[ 32.033333, 34.85], [ 31.066667, 35.033333], [ 32.965833, 35.498333], [ 32.853489, 35.197878], [ 31.416667, 34.583333],
					[ 32.866667, 35.3], [ 32.033333, 34.883333], [ 32.420328, 35.042181], [ 31.316667, 34.616667], [ 32.671389, 35.240556],
					[ 32.078119, 34.847561], [ 32.232222, 34.948333], [ 31.255956, 35.213156], [ 32.766667, 35.05], [ 33.2075, 35.619722],
					[ 31.522778, 34.595278], [ 32.1151, 34.9751], [ 31.733333, 34.733333], [ 32.317103, 34.935761], [ 33.016667, 35.270833],
					[ 32.659444, 35.11], [ 32.282317, 34.983408], [ 32.766667, 34.966667], [ 32.106, 35.187897], [ 32.5, 35.5],
					[ 32.5, 34.916667]];
var exampleLocations = [[380, 228], [460, 690]];
var translatedLocations = [];
var completedQuestions = [];
var numOfCities = -1;
var numOfCitiesRemaining = -1;
var selectedCityNameIndex = -1;
var selectedCityIndex = -1;
var displayedCityIndex = -1; // City whose name we want to show on the map

var markerRadius = 5;
var squareMarkerRadius = markerRadius * markerRadius;

// -------------------------------------------------------------

function clear() {
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function drawCircle(ctx, x, y, radius) {
	ctx.beginPath();
	ctx.arc(x, y, radius, 0, Math.PI*2, true);
	ctx.closePath();
	ctx.fill();
}

function drawOval(ctx, x, y, width, height) {
	ctx.beginPath();	
	ctx.moveTo(x, y + height / 2);
	ctx.quadraticCurveTo(x + width / 2, y, x + width, y + height / 2);
	ctx.quadraticCurveTo(x + width / 2, y + height, x, y + height / 2);
	ctx.stroke();
}

function drawButton(ctx, caption, x, y, width, height, hovered) {
	if (hovered) {
		ctx.fillStyle = 'rgb(200, 165, 230)';
		ctx.fillRect(x+3, y+3, width - 6, height - 6);
		ctx.fillStyle = 'rgb(20, 160, 20)';
		ctx.strokeRect(x, y, width, height);
		ctx.strokeRect(x + 2, y + 2, width - 4, height - 4);
		ctx.fillStyle = 'rgb(182, 237, 131)';
		ctx.strokeRect(x + 1, y + 1, width - 2, height - 2);
		ctx.fillStyle = 'rgb(0, 0, 0)';
		ctx.fillText(caption, x + width / 2, y + height / 2);
	} else {
		ctx.fillStyle = 'rgb(237, 231, 178)';
		ctx.fillRect(x+3, y+3, width - 6, height - 6);
		ctx.fillStyle = 'rgb(20, 160, 20)';
		ctx.strokeRect(x, y, width, height);
		ctx.strokeRect(x + 2, y + 2, width - 4, height - 4);
		ctx.fillStyle = 'rgb(162, 217, 111)';
		ctx.strokeRect(x + 1, y + 1, width - 2, height - 2);
		ctx.fillStyle = 'rgb(0, 0, 0)';
		ctx.fillText(caption, x + width / 2, y + height / 2);
	}
}

function drawScene() {
	clear(); // clear canvas
	for (var i = 0; i < numOfCities; i++)
	{
		if (completedQuestions[i])
		{
			ctx.fillStyle = 'rgb(0, 178, 0)';
			drawCircle(ctx, translatedLocations[i][0], translatedLocations[i][1], markerRadius);
		} else if (selectedCityIndex == i)
		{
			ctx.fillStyle = 'rgb(200, 0, 0)';
			drawCircle(ctx, translatedLocations[i][0], translatedLocations[i][1], markerRadius);
		} else
		{
			ctx.fillStyle = 'rgb(0, 0, 0)';
			drawCircle(ctx, translatedLocations[i][0], translatedLocations[i][1], markerRadius);
		}
	}
	/*if (displayedCityIndex >= 0)
	{
		ctx.fillStyle = 'rgb(0, 0, 0)';
		ctx.fillText(cityNames[displayedCityIndex], translatedLocations[displayedCityIndex][0], translatedLocations[displayedCityIndex][1] - 10);
	}*/
}

function translateLocation(latitude, longtitude)
{
	var example1Location = cityLocations[0];
	var example2Location = cityLocations[1];
	var latitude1 = example1Location[0];
	var longtitude1 = example1Location[1];
	var latitude2 = example2Location[0];
	var longtitude2 = example2Location[1];
	var example1TranslatedLocation = exampleLocations[0];
	var example2TranslatedLocation = exampleLocations[1];
	var x1 = example1TranslatedLocation[0];
	var y1 = example1TranslatedLocation[1];
	var x2 = example2TranslatedLocation[0];
	var y2 = example2TranslatedLocation[1];
	
	var xUnit = (x2 - x1) / (longtitude2 - longtitude1);
	var yUnit = (y2 - y1) / (latitude2 - latitude1);
	if (xUnit < 0) xUnit = -xUnit;
	if (yUnit < 0) yUnit = -yUnit;
	//var latDif = (latitude1 > latitude) ? latitude1 - latitude : latitude - latitude1;
	//var lonDif = (longtitude1 > longtitude) ? longtitude1 - longtitude : longtitude - longtitude1;
	var latDif = latitude1 - latitude;
	var lonDif = longtitude - longtitude1;
	//alert(latDif + " * " + yUnit +  ", " + lonDif + " * " + xUnit);
	var x = x1 + lonDif * xUnit;
	var y = y1 + latDif * yUnit;
	//alert(latitude + ", " + longtitude + " ; " + x + ", " + y);
	return [x, y];
}

// -------------------------------------------------------------

function mouseMove(e) {
	var rect = canvas.getBoundingClientRect(), root = document.documentElement;
	var mouseX = e.clientX - rect.left;
	var mouseY = e.clientY - rect.top;
}

function mouseUp(e) {
}

function mouseDown(e)
{
	document.getElementById('CityListMobileDiv').style.display ='none';
	var rect = canvas.getBoundingClientRect(), root = document.documentElement;
	var mouseX = e.clientX - rect.left;
	var mouseY = e.clientY - rect.top;
	for (var i = 0; i < numOfCities; i++)
	{
		var squareDistance = (mouseX - translatedLocations[i][0]) * (mouseX - translatedLocations[i][0]) + (mouseY - translatedLocations[i][1]) * (mouseY - translatedLocations[i][1]);
		//drawCircle(ctx, translatedLocations[i][0], translatedLocations[i][1], 10);
		if (squareDistance < squareMarkerRadius) selectCity(i);//alert(cityNames[i]);
	}
	//alert(mouseX + ", " + mouseY);
}

function keyDown(e) {
}

// initialization
function initGame() {
	canvas = document.getElementById('scene');

	if (canvas.addEventListener) {
		canvas.addEventListener('mousemove', mouseMove);
		canvas.addEventListener('mouseup', mouseUp);
		canvas.addEventListener('keydown', keyDown);
		canvas.addEventListener('mousedown', mouseDown);
	} else {
		canvas.attachEvent('mousemove', mouseMove);
		canvas.attachEvent('mouseup', mouseUp);
		canvas.attachEvent('keydown', keyDown);
		canvas.attachEvent('mousedown', mouseDown);
	}
	
	document.onkeydown = function(event) {return event.keyCode != 38 && event.keyCode != 40} ;

	canvas.focus();

	ctx = canvas.getContext('2d');

	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.font = "bold 14px Serif";
	
	var paramString = window.location.search;
	if (paramString.length > 0)
	{
		paramString = paramString.substring(1);
		if (paramString.startsWith("NumOfCities=")) numOfCities = paramString.substring(12);
	}
	
	if (numOfCities < 0) numOfCities = cityNames.length;
	numOfCitiesRemaining = numOfCities;
	
	for (var i = 0; i < numOfCities; i++)
	{
		var location = cityLocations[i];
		var latitude = location[0];
		var longtitude = location[1];
		translatedLocations[i] = translateLocation(latitude, longtitude);
		completedQuestions[i] = false;
	}
	
	// Sort alphabetically
	for (var i = 0; i < numOfCities; i++)
	{
		for (var j = i + 1; j < numOfCities; j++)
		{
			if (cityNames[j] < cityNames[i])
			{
				var temp = cityNames[i];
				cityNames[i] = cityNames[j];
				cityNames[j] = temp;
				temp = translatedLocations[i];
				translatedLocations[i] = translatedLocations[j];
				translatedLocations[j] = temp;
			}
		}
	}
	
	for (var i = 0; i < numOfCities; i++)
	{		
		var newLi = document.createElement("li");
		newLi.appendChild(document.createTextNode(cityNames[i]));
		newLi.style.cursor = "pointer";
		newLi.setAttribute("CityIndex", i);
		newLi.onclick = onCityNameClick;
		newLi.id = "CityList_City" + i;
		document.getElementById("CityList").appendChild(newLi);
		
		newLi = document.createElement("li");
		newLi.appendChild(document.createTextNode(cityNames[i]));
		newLi.style.cursor = "pointer";
		newLi.setAttribute("CityIndex", i);
		newLi.onclick = onCityNameMobileClick;
		newLi.id = "CityListMobile_City" + i;
		document.getElementById("CityListMobile").appendChild(newLi);
	}
	selectedCityNameIndex = Math.floor(Math.random() * numOfCities);
	document.getElementById("TargetLabel").innerHTML = cityNames[selectedCityNameIndex];

	setInterval(drawScene, 30); // loop drawScene
}

function onCityNameClick()
{
	//alert("Clicked on " + cityNames[this.getAttribute("CityIndex")]);
	if (selectedCityNameIndex >= 0 && !completedQuestions[selectedCityNameIndex])
	{
		var oldCityId = "CityList_City" + selectedCityNameIndex;
		document.getElementById(oldCityId).style.color = "black";
	}
	selectedCityNameIndex = this.getAttribute("CityIndex");
	var cityId = "CityList_City" + selectedCityNameIndex;
	document.getElementById(cityId).style.color = "red";
	document.getElementById("TargetLabel").innerHTML = document.getElementById(cityId).innerHTML;
}

function onCityNameMobileClick()
{
	//alert("Clicked on " + cityNames[this.getAttribute("CityIndex")]);
	if (selectedCityNameIndex >= 0 && !completedQuestions[selectedCityNameIndex])
	{
		var oldCityId = "CityList_City" + selectedCityNameIndex;
		document.getElementById(oldCityId).style.color = "black";
	}
	selectedCityNameIndex = this.getAttribute("CityIndex");
	var cityId = "CityList_City" + selectedCityNameIndex;
	document.getElementById(cityId).style.color = "red";
	document.getElementById("TargetLabel").innerHTML = document.getElementById(cityId).innerHTML;
	document.getElementById('CityListMobileDiv').style.display ='none';
}

function selectCity(cityId)
{
	selectedCityIndex = cityId;
	if (completedQuestions[selectedCityIndex])
	{
		displayCityName(selectedCityIndex)
	}
	if (selectedCityIndex == selectedCityNameIndex)
	{
		completedQuestions[selectedCityIndex] = true;
		numOfCitiesRemaining--;
		var cityId = "CityList_City" + selectedCityNameIndex;
		document.getElementById(cityId).style.color = "rgb(0, 178, 0)";
		displayedCityIndex = selectedCityIndex;
		displayCityName(selectedCityIndex);
		
		var chosenCityID = "CityListMobile_City" + selectedCityIndex;
		var chosenCityLI = document.getElementById(chosenCityID);
		chosenCityLI.parentNode.removeChild(chosenCityLI);
		
		if (numOfCitiesRemaining > 0)
		{
			selectedCityNameIndex = Math.floor(Math.random() * numOfCities);
			while (completedQuestions[selectedCityNameIndex])
			{
				selectedCityNameIndex++;
				if (selectedCityNameIndex >= numOfCities) selectedCityNameIndex = 0;
			}
			var cityId = "CityList_City" + selectedCityNameIndex;
			document.getElementById(cityId).style.color = "red";
			document.getElementById("TargetLabel").innerHTML = cityNames[selectedCityNameIndex];
		} else
		{
			alert("כל הכבוד!");
		}
	}
}

function displayCityName(cityIndex)
{
	document.getElementById("ReminderLabel").style.display = 'block';
	document.getElementById("ReminderLabel").style.left = "" + translatedLocations[cityIndex][0] + 'px';
	document.getElementById("ReminderLabel").style.top = "" + translatedLocations[cityIndex][1] + 'px';
	document.getElementById("ReminderLabel").innerHTML = cityNames[cityIndex];
	setTimeout(hideCityName, 1000);
}

function hideCityName()
{
	document.getElementById("ReminderLabel").style.display = 'none';
}

function toggleCityListMobile()
{
	var currentValue = document.getElementById('CityListMobileDiv').style.display;
	if (currentValue == 'none') document.getElementById('CityListMobileDiv').style.display ='block';
	else document.getElementById('CityListMobileDiv').style.display ='none';
}
