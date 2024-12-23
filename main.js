
let city = 'Syracuse,NY';

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
    const tempF = weatherData.currentConditions.temp;
    const tempC = covertToFarenheit(tempF);
    const conditions = weatherData.currentConditions.conditions;
    const feelsLikeF = weatherData.currentConditions.feelslike;
    const feelsLikeC = covertToFarenheit(feelsLikeF);
    const tempHigh = weatherData.days[0].tempmax;
    const tempLow = weatherData.days[0].tempmin;

    return createWeatherObj(address, tempF, tempC, conditions, feelsLikeF, feelsLikeC, tempHigh, tempLow);



}

const covertToFarenheit = function (tempF) {
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

getWeatherData(city).then(weatherData => {
    if (weatherData) {
        let processedData = processWeatherData(weatherData);
        console.log(processedData);
    } else {
        console.error("failed to get data");
    }
});



