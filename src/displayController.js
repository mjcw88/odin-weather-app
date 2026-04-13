import { loadFromStorage } from "./storageController.js";
import { icons } from "./iconsController.js";

//Helper Functions
function createElement(element, className, textContent, isSVG = false) {
    const el = document.createElement(element);
    if (className) {
        const prop = element === "button" ? "id" : "className";
        el[prop] = className;
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

function parseTime(time) {
    const [hour, minutes, seconds] = time.split(":").map(Number);
    return { hour, minutes, seconds };
}

export function updateDisplay(filename) {
    const content = document.getElementById("content");
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

    const today = new Date(data.days[0].datetime);
    const weekday = today.toLocaleDateString('en-GB', { weekday: 'long' });
    const month = today.toLocaleDateString('en-GB', { month: 'long' });
    const day = today.getDate();
    const todayFormatted = `${weekday} ${month} ${day}`;
    const dateSpan = createElement("span", "", todayFormatted);

    const conditionSpan = createElement("span", "", data.currentConditions.conditions);
    const humiditySpan = createElement("span", "", `Humidity: ${data.currentConditions.humidity}%`)
    const currentWeatherContainer = createElement("div", "current-weather-container", "");
    const currentTempContainer = createElement("div", "current-weather-temp-container", "");
    const tempPrecipWindContainer = createElement("div", "temp-precip-wind-container", "");
    const tempContainer = createElement("div", "", "");
    const currentTemp = createElement("div", "current-temp", "");
    const weatherSpan = createElement("span", "weather-icon", getIcon(data.currentConditions.icon), true);
    const tempSpan = createElement("span", "", `${data.currentConditions.temp}°C`); // Needs an if statement to flip to F
    const feelsLikeTemp = createElement("div", "", `Feels like ${data.currentConditions.feelslike}°C`); // Needs an if statement to flip to F
    const precipDiv = createElement("div", "", "");
    const precipIcon = createElement("span", "", getIcon("rain"), true);
    const precipProb = createElement("span", "", `${data.currentConditions.precipprob}%`);
    const windDiv = createElement("div", "", "");
    const windIcon = createElement("span", "", getIcon("wind"), true);
    const windProb = createElement("span", "", `${getWindDirection(parseFloat(data.currentConditions.winddir))}, ${data.currentConditions.windspeed}kph`); // Needs an if statement to flip to mph
    const tempBtnContainer = createElement("div", "temp-btn-container", "");
    const celsiusBtn = createElement("button", "celsius-btn", "Celsius");
    const fahrenheitBtn = createElement("button", "fahrenheit-btn", "Fahrenheit");
    const sunContainer = createElement("div", "sunrise-sunset-container", "");
    const sunrise = createElement("div", "", `Sunrise: `);
    const sunriseTime = createElement("strong", "", data.currentConditions.sunrise.slice(0, 5));
    const sunset = createElement("div", "", `Sunset: `);
    const sunsetTime = createElement("strong", "", data.currentConditions.sunset.slice(0, 5));
    const timeContainer = createElement("div", "time-container", "");
    const timeInnerContainer = createElement("div", "time-inner-container", "");
    const daysContainer = createElement("div", "days-container", "");
    const daysInnerContainer = createElement("div", "days-inner-container", "");

    const currentTime = new Date().toLocaleTimeString('en-GB');
    const halfPast = 30;
    let { hour: currentHour, minutes: currentMinutes } = parseTime(currentTime);
    if (currentMinutes >= halfPast) currentHour++;

    const TWENTY_FOUR_HOURS = 24;
    data.days.forEach(d => {
        d.hours.forEach(h => {
            if (timeInnerContainer.children.length >= TWENTY_FOUR_HOURS) return;
            const day = new Date(d.datetime);
            if (day.valueOf() === today.valueOf()) {
                let { hour } = parseTime(h.datetime);
                if (currentHour > hour) return;
            }

            const divContainer = createElement("div", "", "");
            const timeContainer = createElement("div", "", h.datetime.slice(0, 5));
            const iconContainer = createElement("div", "", getIcon(h.icon), true);
            const tempContainer = createElement("div", "", `${h.temp}°C`);
            const precipContainer = createElement("div", "", `${h.precipprob}%`);
            const windContainer = createElement("div", "", `${getWindDirection(parseFloat(h.winddir))}, ${h.windspeed}kph`); // Needs an if statement to flip to mph

            divContainer.append(timeContainer, iconContainer, tempContainer, precipContainer, windContainer );
            timeInnerContainer.appendChild(divContainer);
        })
    })

    const TWO_WEEKS = 14;
    data.days.forEach(d => {
        if (daysInnerContainer.children.length >= TWO_WEEKS) return;
        const divContainer = createElement("div", "", "");
        const today = new Date(d.datetime);
        const weekday = today.toLocaleDateString('en-GB', { weekday: 'short' });
        const dayContainer = createElement("div", "", weekday);
        const iconContainer = createElement("div", "", getIcon(d.icon), true);
        const tempContainer = createElement("div", "", "");
        const highestTemp = createElement("span", "", `${d.tempmax}°C`); // Needs an if statement to flip to F
        const lowestTemp = createElement("span", "", `${d.tempmin}°C`); // Needs an if statement to flip to F

        tempContainer.append(highestTemp, lowestTemp);
        divContainer.append(dayContainer, iconContainer, tempContainer)
        daysInnerContainer.appendChild(divContainer);
    })

    dateContainer.append(dateSpan, conditionSpan, humiditySpan);
    currentWeatherContainer.append(currentTempContainer, sunContainer);
    currentTempContainer.append(tempPrecipWindContainer, tempBtnContainer);
    precipDiv.append(precipIcon, precipProb),
    windDiv.append(windIcon, windProb);
    tempPrecipWindContainer.append(tempContainer, precipDiv, windDiv);
    tempContainer.append(currentTemp, feelsLikeTemp);
    currentTemp.append(weatherSpan, tempSpan);
    tempBtnContainer.append(celsiusBtn, fahrenheitBtn);
    sunrise.appendChild(sunriseTime);
    sunset.appendChild(sunsetTime);
    sunContainer.append(sunrise, sunset);
    mainContainer.append(locationContainer, dateContainer, currentWeatherContainer);
    timeContainer.appendChild(timeInnerContainer);
    daysContainer.appendChild(daysInnerContainer);
    content.append(mainContainer, timeContainer, daysContainer);
}