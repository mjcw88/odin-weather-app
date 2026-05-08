import { loadFromStorage } from "./storageController.js";
import { icons } from "./iconsController.js";
import { formatClickEvent, dayClickEvent } from "./eventsController.js";
import dayTimeBg from "./images/angela-loria-ZAy8srF4rRM-unsplash.jpg";
import nightTimeBg from "./images/clement-proust-rTZZYlBvkXo-unsplash.jpg";

//Helper Functions
export function getBackground(sunrise = "06:00:00", sunset = "18:00:00", offset = 0) {
    const now = new Date();
    let time = now.toISOString().slice(11, 19);

    let { hour, minutes, seconds } = parseAndOffsetTime(time, offset);

    hour = String(hour).padStart(2, "0");
    minutes = String(minutes).padStart(2, "0");
    seconds = String(seconds).padStart(2, "0");

    time = hour + ":" + minutes + ":" + seconds;

    if (time >= sunrise && time <= sunset) return dayTimeBg;
    return nightTimeBg;
}

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
    const normalized = ((degree % 360) + 360) % 360;
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    const index = Math.round(normalized / 45) % 8;
    return directions[index];
}

function parseAndOffsetTime(time, offset) {
    offset = parseInt(offset);
    let [hour, minutes, seconds] = time.split(":").map(Number);
    hour = ((hour + offset) % 24 + 24) % 24;
    return { hour, minutes, seconds };
}

function parseTime(time) {
    const [hour, minutes, seconds] = time.split(":").map(Number);
    return { hour, minutes, seconds };
}

export function updateDisplay(filename, weatherDay = 0) {
    const content = document.getElementById("content");
    content.innerHTML = "";

    const data = loadFromStorage(filename);

    if (!data) {
        const emptyContainer = createElement("p", "empty-container", "Error!");
        content.appendChild(emptyContainer);
        return;
    }

    const sunriseFull = data.currentConditions.sunrise;
    const sunsetFull = data.currentConditions.sunset;
    const timeZoneOffset = data.tzoffset;

    document.body.style.backgroundImage = `url(${getBackground(sunriseFull, sunsetFull, timeZoneOffset)})`
    content.dataset.format = filename;
    content.dataset.day = weatherDay;

    const tempFormat = filename === "celsius" ? "°C" : "°F";
    const speedFormat = filename === "celsius" ? "kph" : "mph";

    const mainContainer = createElement("div", "main-details-container", "");
    const locationContainer = createElement("div", "location-container", data.resolvedAddress);
    const dateSunTempContainer = createElement("div", "date-sunrise-temp-container", "");
    const dateSunContainer = createElement("div", "date-sunrise-container");
    const dateContainer = createElement("div", "date-condition-humidity-container", "");

    const date = new Date(data.days[weatherDay].datetime);
    const weekday = date.toLocaleDateString('en-GB', { weekday: 'long' });
    const month = date.toLocaleDateString('en-GB', { month: 'long' });
    const day = date.getDate();
    const todayFormatted = `${weekday} ${month} ${day}`;
    const dateSpan = createElement("span", "", todayFormatted);

    const description = weatherDay === 0 ? data.currentConditions.conditions : data.days[weatherDay].description;
    const descriptionSpan = createElement("span", "", description);

    const humidity = weatherDay === 0 ? data.currentConditions.humidity : data.days[weatherDay].humidity;
    const humiditySpan = createElement("span", "", `Humidity: ${humidity}%`)

    const currentTempWindPrecipContainer = createElement("div", "current-temp-wind-precip-container", "");
    const currentTempContainer = createElement("div", "current-temp-container", "");

    const icon = weatherDay === 0 ? data.currentConditions.icon : data.days[weatherDay].icon;
    const currentTempIcon = createElement("div", "weather-icon", getIcon(icon), true);

    const tempContainer = createElement("div", "temp-container", "");
    const temp = weatherDay === 0 ? data.currentConditions.temp : data.days[weatherDay].temp;
    const tempDiv = createElement("div", "current-temp", `${temp}${tempFormat}`);

    const feelsLike = weatherDay === 0 ? data.currentConditions.feelslike : data.days[weatherDay].feelslike;
    const feelsLikeTemp = createElement("div", "feels-like-temp", `Feels like ${feelsLike}${tempFormat}`);

    const precipWindContainer = createElement("div", "precip-wind-container", "");
    const precipDiv = createElement("div", "precip-container", "");
    const precipIcon = createElement("div", "precip-icon", getIcon("rain"), true);

    const precipProb = weatherDay === 0 ? data.currentConditions.precipprob : data.days[weatherDay].precipprob;
    const precipProbSpan = createElement("div", "precip-prob", `${precipProb}%`);

    const windDiv = createElement("div", "wind-container", "");
    const windIcon = createElement("div", "wind-icon", getIcon("wind"), true);

    const windDir = weatherDay === 0 ? data.currentConditions.winddir : data.days[weatherDay].winddir;
    const windSpeed = weatherDay === 0 ? data.currentConditions.windspeed : data.days[weatherDay].windspeed;
    const windContainer = createElement("div", "wind-speed-dir-container", "");
    const windSpeedDiv = createElement("div", "wind-speed", `${windSpeed}${speedFormat}`);
    const windDirDiv = createElement("div", "wind-dir", `${getWindDirection(parseFloat(windDir))}`);

    const tempBtnLocationContainer = createElement("div", "temp-btn-location-container", "");
    const tempBtnContainer = createElement("div", "temp-btn-container", "");
    const celsiusBtn = createElement("button", "celsius-btn", "Celsius");
    if (filename === "celsius") celsiusBtn.classList.add("btn-selected");
    const fahrenheitBtn = createElement("button", "fahrenheit-btn", "Fahrenheit");
    if (filename === "fahrenheit") fahrenheitBtn.classList.add("btn-selected");
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
    let { hour: currentHour, minutes: currentMinutes } = parseAndOffsetTime(currentTime, timeZoneOffset);

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

            const divContainer = createElement("div", "hour-container", "");
            const timeContainer = createElement("div", "hour-time", h.datetime.slice(0, 5));
            const iconContainer = createElement("div", "hour-icon", getIcon(h.icon), true);
            const tempContainer = createElement("div", "hour-temp", `${h.temp}${tempFormat}`);
            const precipContainer = createElement("div", "hour-precip", `${h.precipprob}%`);
            const windSpeed = createElement("div", "hour-wind-speed", `${h.windspeed}${speedFormat}`);
            const windDir = createElement("div", "hour-wind-dir", `${getWindDirection(parseFloat(h.winddir))}`);

            divContainer.append(timeContainer, iconContainer, tempContainer, precipContainer, windSpeed, windDir);
            timeInnerContainer.appendChild(divContainer);
        });
    });

    const TWO_WEEKS = 14;

    data.days.forEach((d, index) => {
        if (daysInnerContainer.children.length >= TWO_WEEKS) return;
        const divContainer = createElement("div", "day-container", "");
        divContainer.dataset.day = index;
        if (weatherDay === index) divContainer.classList.add("day-selected");
        dayClickEvent(divContainer);

        const today = new Date(d.datetime);
        const weekday = today.toLocaleDateString('en-GB', { weekday: 'short' });
        const dayContainer = createElement("div", "day-day", weekday);
        const iconContainer = createElement("div", "day-icon", getIcon(d.icon), true);
        const tempContainer = createElement("div", "day-temp", "");
        const highestTemp = createElement("span", "day-high-temp", `${d.tempmax}${tempFormat}`);
        const lowestTemp = createElement("span", "day-low-temp", `${d.tempmin}${tempFormat}`);

        tempContainer.append(highestTemp, lowestTemp);
        divContainer.append(dayContainer, iconContainer, tempContainer)
        daysInnerContainer.appendChild(divContainer);
    })

    dateSunContainer.append(dateContainer, sunContainer);
    dateContainer.append(dateSpan, descriptionSpan, humiditySpan);
    precipWindContainer.append(precipDiv, windDiv);
    dateSunTempContainer.append(dateSunContainer, currentTempWindPrecipContainer);
    currentTempWindPrecipContainer.append(currentTempContainer, precipWindContainer);
    precipDiv.append(precipIcon, precipProbSpan),
    windContainer.append(windSpeedDiv, windDirDiv);
    windDiv.append(windIcon, windContainer);
    tempContainer.append(tempDiv, feelsLikeTemp)
    currentTempContainer.append(currentTempIcon, tempContainer);
    tempBtnContainer.append(celsiusBtn, fahrenheitBtn);
    sunriseDiv.appendChild(sunriseTime);
    sunsetDiv.appendChild(sunsetTime);
    sunContainer.append(sunriseDiv, sunsetDiv);
    tempBtnLocationContainer.append(tempBtnContainer, locationContainer);
    mainContainer.append(tempBtnLocationContainer, dateSunTempContainer);
    timeContainer.appendChild(timeInnerContainer);
    daysContainer.appendChild(daysInnerContainer);
    content.append(mainContainer, timeContainer, daysContainer);
}