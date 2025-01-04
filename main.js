
let searchForm = document.getElementById('search-form');
let toggle = document.getElementById('switch');
let processedData;
let city = 'Syracuse';
let scale = 'far';



//Toggle temp
toggle.addEventListener("click", function() {
    if (toggle.checked == true) {
        scale = 'cel';
        if (processedData) {
            updateWeatherDisplay(processedData);
        }
        
    } else {
        scale = 'far'
        if (processedData) {
            updateWeatherDisplay(processedData);
        }
    }
})


// Get search info on sumbit
searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let locationInput = document.getElementById('search');

    if (locationInput.value == "")  {
        alert("Ensure you input a location");
    } else {
        city = locationInput.value;
        console.log(toggle.value);

        getWeatherData(city).then(weatherData => {
            if (weatherData) {
                processedData = processWeatherData(weatherData);
                updateWeatherDisplay(processedData);
                console.log(processedData);
        
            } else {
                console.error("failed to get data");
            }
        });
    }
})

// Function to get all elements to update
function getWeatherElements() {
    return {
        location: document.querySelector('.location'),
        temp: document.querySelector('.temp'),
        conditions: document.querySelector('.conditions'),
        high: document.querySelector('.high'),
        low: document.querySelector('.low'),
    };
}

const getWeatherData = async (location) => {
    try {
        const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/?key=TCHHKGLGMEJC2GJ9Y93GQXQ7Z`);
        const weatherData = await response.json();
        console.log(weatherData);
        return weatherData;
    }
    catch (error) {
        console.error(error);
    }
}

const processWeatherData = function (weatherData) {
    if (!weatherData || !weatherData.days || !weatherData.days[0]) {
        console.error("Invalid weatherData structure");
        return null;
    }
    const address = weatherData.address;
    const tempF = Math.round(weatherData.currentConditions.temp); 
    const tempC = convertToCelcius(tempF);
    const conditions = weatherData.currentConditions.conditions;
    const feelsLikeF = weatherData.currentConditions.feelslike;
    const feelsLikeC = convertToCelcius(feelsLikeF);
    const tempHigh = Math.round(weatherData.days[0].tempmax);
    const tempLow = Math.round(weatherData.days[0].tempmin);
    return createWeatherObj(address, tempF, tempC, conditions, feelsLikeF, feelsLikeC, tempHigh, tempLow);

}

const convertToCelcius = function (tempF) {
    return Math.round((tempF - 32) * 5 / 9);
}

function createWeatherObj(address, tempF, tempC, conditions, feelsLikeF, feelsLikeC, tempHigh, tempLow) {
    return {
        address, 
        tempF, 
        tempC, 
        conditions, 
        feelsLikeF, 
        feelsLikeC, 
        tempHigh, 
        tempLow,
    };
    
}


const weatherElements = getWeatherElements();




function updateWeatherDisplay(data) {
    weatherElements.location.textContent = data.address;
    weatherElements.conditions.textContent = data.conditions;
   

    if (scale == 'far') {
        weatherElements.temp.innerHTML = data.tempF + '&deg;F';
        weatherElements.high.innerHTML = `H: ${data.tempHigh} &deg;`;
        weatherElements.low.innerHTML = `L: ${data.tempLow} &deg;`;
    } else {
        weatherElements.temp.innerHTML = data.tempC + '&deg;C';
        let tempHighC = convertToCelcius(data.tempHigh);
        let tempLowC = convertToCelcius(data.tempLow);
        weatherElements.high.innerHTML = `H: ${tempHighC} &deg;`;
        weatherElements.low.innerHTML = `L: ${tempLowC} &deg;`;

    }
}

document.addEventListener("DOMContentLoaded", function() {
    getWeatherData(city).then(weatherData => {
        if (weatherData) {
            processedData = processWeatherData(weatherData);
            updateWeatherDisplay(processedData);
        } else {
            console.error("Failed to fetch weather data on page load");
        }
    });
});

