import { loadFromStorage } from "./storageController.js";
import { icons } from "./iconsController.js";
import { formatClickEvent, dayClickEvent } from "./eventsController.js";

//Helper Functions
function createElement(element, className, textContent, isSVG = false) {
    const el = document.createElement(element);
    if (className) {
        const prop = element === "button" ? "id" : "className";
        el[prop] = className;
    }

    if (element === "button") {
        el.dataset.format = textContent.toLowerCase();
        formatClickEvent(el);
    }

    if (isSVG) {
        el.innerHTML = textContent;
    } else if (textContent) {
        el.textContent = textContent;
    }
    
    return el;
}

function getIcon(filename) {
    return icons.find(i => i.name === filename).svg;
}

function getWindDirection(degree) {
    const directions = [
        { max: 22.5,  label: "N"  },
        { max: 67.5,  label: "NE" },
        { max: 112.5, label: "E"  },
        { max: 157.5, label: "SE" },
        { max: 202.5, label: "S"  },
        { max: 247.5, label: "SW" },
        { max: 292.5, label: "W"  },
        { max: 337.5, label: "NW" },
    ];

    return directions.find(d => degree < d.max)?.label ?? "N";
}

function parseAndOffsetTime(time, offset) {
    let [hour, minutes, seconds] = time.split(":").map(Number);

    // Apply offset and wrap to keep hour in 0–23 range
    // The + 24 handles negative results
    hour = ((hour + offset) % 24 + 24) % 24;

    return { hour, minutes, seconds };
}

function parseTime(time) {
    const [hour, minutes, seconds] = time.split(":").map(Number);
    return { hour, minutes, seconds };
}

export function updateDisplay(filename, weatherDay = 0) {
    const tempFormat = filename === "celsius" ? "°C" : "°F"
    const speedFormat = filename === "celsius" ? "kph" : "mph"

    const content = document.getElementById("content");
    content.dataset.format = filename;
    content.dataset.day = weatherDay;
    content.innerHTML = "";

    const data = loadFromStorage(filename);

    if (!data) {
        const emptyContainer = createElement("div", "empty-container", "Error!");
        content.appendChild(emptyContainer);
        return;
    }

    const mainContainer = createElement("div", "main-details-container", "");
    const locationContainer = createElement("div", "location-container", data.resolvedAddress);
    const dateContainer = createElement("div", "date-condition-humidity-container", "");

    const date = new Date(data.days[weatherDay].datetime);
    const weekday = date.toLocaleDateString('en-GB', { weekday: 'long' });
    const month = date.toLocaleDateString('en-GB', { month: 'long' });
    const day = date.getDate();
    const todayFormatted = `${weekday} ${month} ${day}`;
    const dateSpan = createElement("span", "", todayFormatted);

    const conditions = weatherDay === 0 ? data.currentConditions.conditions : data.days[weatherDay].conditions;
    const conditionSpan = createElement("span", "", conditions);

    const humidity = weatherDay === 0 ? data.currentConditions.humidity : data.days[weatherDay].humidity;
    const humiditySpan = createElement("span", "", `Humidity: ${humidity}%`)

    const currentWeatherContainer = createElement("div", "current-weather-container", "");
    const currentTempContainer = createElement("div", "current-weather-temp-container", "");
    const tempPrecipWindContainer = createElement("div", "temp-precip-wind-container", "");
    const tempContainer = createElement("div", "", "");
    const currentTemp = createElement("div", "current-temp", "");

    const icon = weatherDay === 0 ? data.currentConditions.icon : data.days[weatherDay].icon;
    const weatherSpan = createElement("span", "weather-icon", getIcon(icon), true);

    const temp = weatherDay === 0 ? data.currentConditions.temp : data.days[weatherDay].temp;
    const tempSpan = createElement("span", "", `${temp}${tempFormat}`);

    const feelsLike = weatherDay === 0 ? data.currentConditions.feelslike : data.days[weatherDay].feelslike;
    const feelsLikeTemp = createElement("div", "", `Feels like ${feelsLike}${tempFormat}`);

    const precipDiv = createElement("div", "", "");
    const precipIcon = createElement("span", "", getIcon("rain"), true);

    const precipProb = weatherDay === 0 ? data.currentConditions.precipprob : data.days[weatherDay].precipprob;
    const precipProbSpan = createElement("span", "", `${precipProb}%`);

    const windDiv = createElement("div", "", "");
    const windIcon = createElement("span", "", getIcon("wind"), true);

    const windDir = weatherDay === 0 ? data.currentConditions.winddir : data.days[weatherDay].winddir;
    const windSpeed = weatherDay === 0 ? data.currentConditions.windspeed : data.days[weatherDay].windspeed;
    const windProbSpan = createElement("span", "", `${getWindDirection(parseFloat(windDir))}, ${windSpeed}${speedFormat}`);

    const tempBtnContainer = createElement("div", "temp-btn-container", "");
    const celsiusBtn = createElement("button", "celsius-btn", "Celsius");
    const fahrenheitBtn = createElement("button", "fahrenheit-btn", "Fahrenheit");
    const sunContainer = createElement("div", "sunrise-sunset-container", "");
    const sunriseDiv = createElement("div", "", `Sunrise: `);
    const sunrise = weatherDay === 0 ? data.currentConditions.sunrise.slice(0, 5) : data.days[weatherDay].sunrise.slice(0, 5);
    const sunriseTime = createElement("strong", "", sunrise);

    const sunsetDiv = createElement("div", "", `Sunset: `);
    const sunset = weatherDay === 0 ? data.currentConditions.sunset.slice(0, 5) : data.days[weatherDay].sunset.slice(0, 5);
    const sunsetTime = createElement("strong", "", sunset);

    const timeContainer = createElement("div", "time-container", "");
    const timeInnerContainer = createElement("div", "time-inner-container", "");
    const daysContainer = createElement("div", "days-container", "");
    const daysInnerContainer = createElement("div", "days-inner-container", "");

    const currentTime = new Date().toISOString().slice(11, 19);
    const halfPast = 30;
    let { hour: currentHour, minutes: currentMinutes } = parseAndOffsetTime(currentTime, parseInt(data.tzoffset));

    if (currentMinutes >= halfPast) currentHour++;
    const TWENTY_FOUR_HOURS = 24;

    const today = new Date(data.days[0].datetime);

    data.days.slice(weatherDay).forEach((d) => {
        d.hours.forEach(h => {
            if (timeInnerContainer.children.length >= TWENTY_FOUR_HOURS) return;

            if (new Date(d.datetime).valueOf() === today.valueOf()) {
                const { hour } = parseTime(h.datetime);
                if (currentHour > hour) return;
            }

            const divContainer = createElement("div", "", "");
            const timeContainer = createElement("div", "", h.datetime.slice(0, 5));
            const iconContainer = createElement("div", "", getIcon(h.icon), true);
            const tempContainer = createElement("div", "", `${h.temp}${tempFormat}`);
            const precipContainer = createElement("div", "", `${h.precipprob}%`);
            const windContainer = createElement("div", "", `${getWindDirection(parseFloat(h.winddir))}, ${h.windspeed}${speedFormat}`);
            divContainer.append(timeContainer, iconContainer, tempContainer, precipContainer, windContainer);
            timeInnerContainer.appendChild(divContainer);
        });
    });

    const TWO_WEEKS = 14;
    data.days.forEach((d, index) => {
        if (daysInnerContainer.children.length >= TWO_WEEKS) return;
        const divContainer = createElement("div", "", "");
        divContainer.dataset.day = index;
        dayClickEvent(divContainer);

        const today = new Date(d.datetime);
        const weekday = today.toLocaleDateString('en-GB', { weekday: 'short' });
        const dayContainer = createElement("div", "", weekday);
        const iconContainer = createElement("div", "", getIcon(d.icon), true);
        const tempContainer = createElement("div", "", "");
        const highestTemp = createElement("span", "", `${d.tempmax}${tempFormat}`);
        const lowestTemp = createElement("span", "", `${d.tempmin}${tempFormat}`);

        tempContainer.append(highestTemp, lowestTemp);
        divContainer.append(dayContainer, iconContainer, tempContainer)
        daysInnerContainer.appendChild(divContainer);
    })

    dateContainer.append(dateSpan, conditionSpan, humiditySpan);
    currentWeatherContainer.append(currentTempContainer, sunContainer);
    currentTempContainer.append(tempPrecipWindContainer, tempBtnContainer);
    precipDiv.append(precipIcon, precipProbSpan),
    windDiv.append(windIcon, windProbSpan);
    tempPrecipWindContainer.append(tempContainer, precipDiv, windDiv);
    tempContainer.append(currentTemp, feelsLikeTemp);
    currentTemp.append(weatherSpan, tempSpan);
    tempBtnContainer.append(celsiusBtn, fahrenheitBtn);
    sunriseDiv.appendChild(sunriseTime);
    sunsetDiv.appendChild(sunsetTime);
    sunContainer.append(sunriseDiv, sunsetDiv);
    mainContainer.append(locationContainer, dateContainer, currentWeatherContainer);
    timeContainer.appendChild(timeInnerContainer);
    daysContainer.appendChild(daysInnerContainer);
    content.append(mainContainer, timeContainer, daysContainer);
}