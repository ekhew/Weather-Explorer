window.addEventListener('load', ()=> {
    let long;
    let lat;
    let temperatureCurrent = document.querySelector('.temperature-current');
    let locationName = document.querySelector('.location-name');
    let weatherCondition = document.querySelector('.weather-condition');
    let temperatureFeelsLike = document.querySelector('.temperature-feels-like');
    let temperatureDegreeMax = document.querySelector('.temperature-degree-max');
    let temperatureDegreeMin = document.querySelector('.temperature-degree-min');
    let forecastDayOne = document.querySelector('#forecast-day-one');
    let forecastDayTwo = document.querySelector('#forecast-day-two');
    let forecastDayThree = document.querySelector('#forecast-day-three');
    let forecastDayFour = document.querySelector('#forecast-day-four');
    let forecastDayFive = document.querySelector('#forecast-day-five');

    let weekday = new Array(7);
        weekday[0] = "Sunday";
        weekday[1] = "Monday";
        weekday[2] = "Tuesday";
        weekday[3] = "Wednesday";
        weekday[4] = "Thursday";
        weekday[5] = "Friday";
        weekday[6] = "Saturday";

    //this IIFE gets the day of the week and the date
    (function() {
        let todaysDate = document.querySelector('.date');
        let d = new Date();
        let day = weekday[d.getDay()];
        todaysDate.textContent = "Today is " + day + ", " + (new Date()).toString().split(' ').splice(1,3).join(' ');
    })();

    //get user's location (latitude and longitude) and uses it to get the correct data from the API
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            long = position.coords.longitude;
            lat = position.coords.latitude;

            //API call for current weather
            const proxy = "https://cors-anywhere.herokuapp.com/";
            const api = `${proxy}https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=13a45786ef3705aaebce872627c0573b&units=imperial`;
            
            fetch(api)
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    //console.log(data);
                    //set DOM elements from the API
                    temperatureCurrent.textContent = Math.round(data.main.temp) + "°";
                    locationName.textContent = data.name + ", " + data.sys.country;
                    weatherCondition.textContent = data.weather[0].description;
                    temperatureFeelsLike.textContent = "Feels like " + Math.round(data.main.feels_like) + "°";
                    temperatureDegreeMax.textContent = Math.round(data.main.temp_max) + "°";
                    temperatureDegreeMin.textContent = Math.round(data.main.temp_min) + "°";

                    //set the icon
                    const myIcon = data.weather[0].icon;
                    setIcons(myIcon, document.querySelector('#myIcon'));
                })

            //API call for 5-day forecast
            const apiForecast = `${proxy}https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=minutely,hourly&appid=13a45786ef3705aaebce872627c0573b&units=imperial`;
        
            fetch(apiForecast)
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    console.log(data);
                    const myIconOne = data.daily[1].weather[0].icon;
                    setIcons(myIconOne, document.querySelector('#myIcon-one'));
                    const myIconTwo = data.daily[2].weather[0].icon;
                    setIcons(myIconTwo, document.querySelector('#myIcon-two'));
                    const myIconThree = data.daily[3].weather[0].icon;
                    setIcons(myIconThree, document.querySelector('#myIcon-three'));
                    const myIconFour = data.daily[4].weather[0].icon;
                    setIcons(myIconFour, document.querySelector('#myIcon-four'));
                    const myIconFive = data.daily[5].weather[0].icon;
                    setIcons(myIconFive, document.querySelector('#myIcon-five'));
                })

            //prints out the next five forecast days
            let d = new Date();
            let dayCounter = d.getDay();
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
    } else {
        h1.textContent = "Error: Location not available!";
    }

    //this function takes the original icon from the API and converts it to its corresponding Skycon, then sets the new icon
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