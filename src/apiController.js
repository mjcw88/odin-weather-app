import { updateDisplay } from "./displayController.js";
import { saveToStorage } from "./storageController.js";

function parseData(data) {
    const { resolvedAddress, tzoffset, currentConditions: { conditions, humidity, icon, temp, feelslike, precipprob, winddir, windspeed, sunrise, sunset }, days } = data;
    const parsedData = { 
        resolvedAddress,
        tzoffset, 
        currentConditions: {
            conditions, 
            humidity, 
            icon, 
            temp, 
            feelslike, 
            precipprob, 
            winddir, 
            windspeed, 
            sunrise, 
            sunset 
        },
        days: days.map(({ datetime, description, humidity, icon, temp, feelslike, precipprob, winddir, windspeed, sunrise, sunset, tempmax, tempmin, hours }) => ({ 
            datetime,
            description,
            humidity,
            icon,
            temp,
            feelslike,
            precipprob,
            winddir,
            windspeed,
            sunrise,
            sunset,
            tempmax,
            tempmin,
            hours: hours.map(({ datetime, icon, temp, humidity, conditions, precipprob, winddir, windspeed }) => ({
                datetime,
                icon,
                temp,
                humidity,
                conditions,
                precipprob,
                winddir,
                windspeed,
            }))
        }))
    };

    return parsedData;
}

export async function fetchData(query) {
    const KEY = "HRMCPGZE4BZBZDD4FC4UXNJD6";
    const content = document.getElementById("content");
    const loader = document.getElementById("loader");
    
    content.innerHTML = "";
    loader.style.display = "block";

    try {
        const [responseMetric, responseUs] = await Promise.all([
            fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${query}?key=${KEY}&unitGroup=metric`),
            fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${query}?key=${KEY}&unitGroup=us`)
        ]);

        if (!responseMetric.ok || !responseUs.ok) {
            const errorText = await responseMetric.ok 
                ? responseUs.text() 
                : responseMetric.text();
            throw new Error(`Location not found: ${errorText}`);
        }

        const dataMetric = await responseMetric.json();
        const dataUs = await responseUs.json();

        const parsedMetric = parseData(dataMetric);
        const parsedUs = parseData(dataUs);

        const filenameMetric = "celsius";
        const filenameUs = "fahrenheit";

        saveToStorage(filenameMetric, parsedMetric);
        saveToStorage(filenameUs, parsedUs);

        loader.style.display = "none";
        updateDisplay(filenameMetric);
    } catch (error) {
        loader.style.display = "none";
        content.innerHTML = `<p class="no-results">No results found for "${query}".</p>`;
        console.error(error);
    }
}