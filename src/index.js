// Module imports
import "./styles.css";
import { eventListeners } from "./eventsController.js";
import { updateDisplay } from "./displayController.js";
import { clearStorage } from "./storageController.js";
import { getBackground } from "./displayController.js";

// initialisation
eventListeners.init();
clearStorage.init();
document.body.style.backgroundImage = `url(${getBackground()})`