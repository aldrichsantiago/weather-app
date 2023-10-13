const tempText = document.getElementById("temp-text")
const description = document.getElementById("weather-description")
const searchBox = document.getElementById("search-box")
const searchForm = document.getElementById("search-form")
const cityName = document.getElementById("city-name")
const weatherImg = document.getElementById("weather-image")


const data = 
{
    "coord": {
        "lon": 120.9783,
        "lat": 14.5949
    },
    "weather": [
        {
            "id": 803,
            "main": "Clouds",
            "description": "broken clouds",
            "icon": "04d"
        }
    ],
    "base": "stations",
    "main": {
        "temp": 304.42,
        "feels_like": 311.42,
        "temp_min": 303.78,
        "temp_max": 305.45,
        "pressure": 1008,
        "humidity": 75
    },
    "visibility": 10000,
    "wind": {
        "speed": 12.96,
        "deg": 212,
        "gust": 17.88
    },
    "clouds": {
        "all": 75
    },
    "dt": 1691040782,
    "sys": {
        "type": 2,
        "id": 2008256,
        "country": "PH",
        "sunrise": 1691012378,
        "sunset": 1691058296
    },
    "timezone": 28800,
    "id": 7521311,
    "name": "National Capital Region",
    "cod": 200
}

const API_KEY = "e7bc88da475ed56bd7eb220b69e74999";
let lat = 0;
let lon = 0;
let cityname = "";
let temp = 0;
let iconImg = "";
let textDescription = "";

const removeSpaces = (e) => {
    if(e === " " || e === ""){} 
    return e;
}

const capitalizeFirstLetter = (e) => {
    return e.charAt(0).toUpperCase() + e.slice(1).toLowerCase();
}

const formatInputString = (city) => {
    // manilA ==> Manila;   san leonardo ==> San+Leonardo
    city = city.trim();
    let cityArr = city.split(" ");
    cityArr = cityArr.filter(removeSpaces);
    cityArr = cityArr.map(capitalizeFirstLetter);
    city = cityArr.join("+");
    console.log(city);
    return city;
}

const computeTemp = (weatherData) => {
    temp = weatherData.main.temp;
    temp = temp - 273.15;
    temp = temp.toFixed(2);
    tempText.innerText = temp.toString() + "°C";
}

const getDesription = (weatherData) => {
    const { weather } = weatherData;
    iconImg = weather[0].icon;
    textDescription = capitalizeFirstLetter(weather[0].description);
    description.innerText = textDescription;
    weatherImg.src = `https://openweathermap.org/img/wn/${iconImg}@2x.png`

}

searchForm.addEventListener("submit", event => {
    event.preventDefault();
    cityname = formatInputString(searchBox.value);
    fetchWeather();
    searchBox.blur();
});


const fetchWeather = async () => {
    try {
        const geoResponse = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityname},ph&limit=1&appid=${API_KEY}`)
        const geoResponseData = await geoResponse.json();
        console.log(geoResponseData);
        lon = geoResponseData[0].lon
        lat = geoResponseData[0].lat
        cityname = geoResponseData[0].name
        
    } catch (error) {
        console.log(error);
        alert("An Error Occured");
        return;
    }

    try {
        const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`)
        const weatherResponseData = await weatherResponse.json();
        console.log(weatherResponseData);
        computeTemp(weatherResponseData);
        getDesription(weatherResponseData);
        cityName.innerText = weatherResponseData.name + ", PH";
    } catch (error) {
        console.log(error);
        alert("An Error Occured");

        return;
    }
    
}

