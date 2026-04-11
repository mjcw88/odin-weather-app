import { updateDisplay } from "./displayController.js";
import { saveToStorage } from "./storageController.js";

export async function fetchData(query) {
    const KEY = "HRMCPGZE4BZBZDD4FC4UXNJD6";

    try {
        const responseMetric = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${query}?key=${KEY}&unitGroup=metric`)
        const dataMetric = await responseMetric.json();
        const filenameMetric = "celsius";
        saveToStorage(filenameMetric, dataMetric);

        const responseUs = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${query}?key=${KEY}&unitGroup=us`)
        const dataUs = await responseUs.json();
        const filenameFahrenheit = "fahrenheit";
        saveToStorage(filenameFahrenheit, dataUs);
        
        updateDisplay(filenameMetric);
    } catch (error) {
        console.error(error);
    }
}