import { updateDisplay } from "./displayController.js";
import { saveToStorage } from "./storageController.js";

function parseData(data) {
    console.log(data);

    const { resolvedAddress, tzoffset, currentConditions: { conditions, humidity, icon, temp, feelslike, precipprob, winddir, windspeed, sunrise, sunset } } = data;
    const parseData = { 
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
        }
    };

    console.log(parseData);

    return data;
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

        const dataMetric = await responseMetric.json();
        const dataUs = await responseUs.json();

        parseData(dataMetric);
        parseData(dataUs);

        const filenameMetric = "celsius";
        const filenameUs = "fahrenheit";

        saveToStorage(filenameMetric, dataMetric);
        saveToStorage(filenameUs, dataUs);

        loader.style.display = "none";
        updateDisplay(filenameMetric);
    } catch (error) {
        console.error(error);
    }
}