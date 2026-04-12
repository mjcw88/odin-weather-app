import { updateDisplay } from "./displayController.js";
import { saveToStorage } from "./storageController.js";

export async function fetchData(query) {
    const KEY = "HRMCPGZE4BZBZDD4FC4UXNJD6";

    try {
        const [responseMetric, responseUs] = await Promise.all([
            fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${query}?key=${KEY}&unitGroup=metric`),
            fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${query}?key=${KEY}&unitGroup=us`)
        ]);

        const dataMetric = await responseMetric.json();
        const dataUs = await responseUs.json();

        saveToStorage('celsius', dataMetric);
        saveToStorage('fahrenheit', dataUs);

        updateDisplay('celsius');
    } catch (error) {
        console.error(error);
    }
}
