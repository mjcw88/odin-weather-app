// Module imports
import "./styles.css";
import { eventListeners } from "./eventsController.js";
import { updateDisplay } from "./displayController.js";
import { clearStorage } from "./storageController.js";

// initialisation
eventListeners.init();
// clearStorage.init();

// Placeholder whilst rendering data
updateDisplay("celsius");