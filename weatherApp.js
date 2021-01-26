//run this function when the window loads
window.addEventListener('load', ()=> {
    let weekday = new Array(7);
        weekday[0] = "Sunday";
        weekday[1] = "Monday";
        weekday[2] = "Tuesday";
        weekday[3] = "Wednesday";
        weekday[4] = "Thursday";
        weekday[5] = "Friday";
        weekday[6] = "Saturday";

    //this IIFE gets the day of the week and the date, and then sets the date
    (function() {
        let todaysDate = document.querySelector('.date');
        let d = new Date();
        let day = weekday[d.getDay()];
        todaysDate.textContent = day + ", " + (new Date()).toString().split(' ').splice(1,3).join(' ');
    })();

    //map from Mapbox API
    mapboxgl.accessToken = 'pk.eyJ1IjoiZWR3aW5rIiwiYSI6ImNra2JuM25ybzBhYjEycWt4eXlxZWNkbngifQ.-xT7LoGTSPbbtSf_m-apOQ';
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-79.4512, 43.6568],
        zoom: 13
    });

    //search box from Mapbox API
    var geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl
    });

    document.getElementById('geocoder').appendChild(geocoder.onAdd(map));

    //run after getting a result from the search box
    geocoder.on('result', function(e) {
        //console.log(e.result);
    
        //set the latitude and longitude coordinates based on the result of the search
        let long = e.result.center[0];
        let lat = e.result.center[1];

        let currentTemperature = document.querySelector('.current-temperature');
        let currentLocationName = document.querySelector('.current-location-name');
        let currentWeatherCondition = document.querySelector('.current-weather-condition');
        let currentTemperatureFeelsLike = document.querySelector('.current-temperature-feels-like');
        let currentTemperatureMaxMin = document.querySelector('.current-temperature-maxmin');
        
        //OpenWeatherMap API call for the current weather section
        const proxy = "https://cors-anywhere.herokuapp.com/";
        let api = `${proxy}https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=13a45786ef3705aaebce872627c0573b&units=imperial`;
        
        fetch(api)
            .then(response => {
                return response.json();
            })
            .then(data => {
                //console.log(data);

                //sets DOM elements from the API for the current day section
                currentTemperature.textContent = Math.round(data.main.temp) + "°";
                currentLocationName.textContent = data.name + ", " + data.sys.country;
                currentWeatherCondition.textContent = data.weather[0].description;
                currentTemperatureFeelsLike.textContent = "Feels like " + Math.round(data.main.feels_like) + "°";
                currentTemperatureMaxMin.textContent = Math.round(data.main.temp_max) + "° / " + Math.round(data.main.temp_min) + "°";

                //set the icon for the current weather
                const myIcon = data.weather[0].icon;
                setIcons(myIcon, document.querySelector('#current-icon'));
            })

        let forecastMaxMinOne = document.querySelector('#forecast-maxmin-one');
        let forecastMaxMinTwo = document.querySelector('#forecast-maxmin-two');
        let forecastMaxMinThree = document.querySelector('#forecast-maxmin-three');
        let forecastMaxMinFour = document.querySelector('#forecast-maxmin-four');
        let forecastMaxMinFive = document.querySelector('#forecast-maxmin-five');

        //OpenWeatherMap API call for 5-day forecast
        let apiForecast = `${proxy}https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=minutely,hourly&appid=13a45786ef3705aaebce872627c0573b&units=imperial`;
    
        fetch(apiForecast)
            .then(response => {
                return response.json();
            })
            .then(data => {
                //console.log(data);

                //sets the max and min temperatures for the 5-day forecast section
                forecastMaxMinOne.textContent = Math.round(data.daily[1].temp.max) + "° / " + Math.round(data.daily[1].temp.min) + "°";
                forecastMaxMinTwo.textContent = Math.round(data.daily[2].temp.max) + "° / " + Math.round(data.daily[2].temp.min) + "°";
                forecastMaxMinThree.textContent = Math.round(data.daily[3].temp.max) + "° / " + Math.round(data.daily[3].temp.min) + "°";
                forecastMaxMinFour.textContent = Math.round(data.daily[4].temp.max) + "° / " + Math.round(data.daily[4].temp.min) + "°";
                forecastMaxMinFive.textContent = Math.round(data.daily[5].temp.max) + "° / " + Math.round(data.daily[5].temp.min) + "°";
                
                //sets icons for the 5-day forecast section
                const forecastIconOne = data.daily[1].weather[0].icon;
                setIcons(forecastIconOne, document.querySelector('#forecast-icon-one'));
                const forecastIconTwo = data.daily[2].weather[0].icon;
                setIcons(forecastIconTwo, document.querySelector('#forecast-icon-two'));
                const forecastIconThree = data.daily[3].weather[0].icon;
                setIcons(forecastIconThree, document.querySelector('#forecast-icon-three'));
                const forecastIconFour = data.daily[4].weather[0].icon;
                setIcons(forecastIconFour, document.querySelector('#forecast-icon-four'));
                const forecastIconFive = data.daily[5].weather[0].icon;
                setIcons(forecastIconFive, document.querySelector('#forecast-icon-five'));
            })

        let forecastDayOne = document.querySelector('#forecast-day-one');
        let forecastDayTwo = document.querySelector('#forecast-day-two');
        let forecastDayThree = document.querySelector('#forecast-day-three');
        let forecastDayFour = document.querySelector('#forecast-day-four');
        let forecastDayFive = document.querySelector('#forecast-day-five');

        //sets the day names for the 5-day forecast section using the 'weekday' array
        let d = new Date();
        let dayCounter = d.getDay();
        //the 'forecastDays' array will store the names of the next five days from the current day
        let forecastDays = new Array(0);
        for (i = 0; i <= 4; i++) {
            if (dayCounter >= weekday.length - 1) {
                dayCounter = 0
            } else {
                dayCounter += 1
            }
            forecastDays.push(weekday[dayCounter]);
        }

        forecastDayOne.textContent = forecastDays[0];
        forecastDayTwo.textContent = forecastDays[1];
        forecastDayThree.textContent = forecastDays[2];
        forecastDayFour.textContent = forecastDays[3];
        forecastDayFive.textContent = forecastDays[4];
    });

    //this function takes the original icon from the OpenWeatherMap API and converts it to its corresponding Skycon using the 'Skycon' function, then sets the new icon
    function setIcons(icon, iconID) {
        const skycons = new Skycons({color: "black"});
        let currentIcon;

        if(icon === '01d'){
            currentIcon = "CLEAR_DAY";
        } else if(icon === '01n') {
            currentIcon = "CLEAR_NIGHT";
        } else if(icon === '02d') {
            currentIcon = "PARTLY_CLOUDY_DAY";
        } else if(icon === '02n') {
            currentIcon = "PARTLY_CLOUDY_NIGHT";
        } else if(icon === '03d' || icon === '03n' || icon === '04d' || icon === '04n') {
            currentIcon = "CLOUDY";
        } else if(icon === '09d' || icon === '09n' || icon === '10d' || icon === '10n' || icon === '11d' || icon === '11n') {
            currentIcon = "RAIN";
        } else if(icon === '13d' || icon === '13n') {
            currentIcon = "SNOW";
        } else if(icon === '50d' || icon === '50n') {
            currentIcon = "FOG";
        }

        skycons.play();
        return skycons.set(iconID, Skycons[currentIcon]);
    }
});
