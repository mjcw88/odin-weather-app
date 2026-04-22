import { updateDisplay } from "./displayController.js";
import { submitForm } from "./formController.js";

export const eventListeners = {
    init() { 
        const form = document.getElementById("search-form");

        form.addEventListener("submit", (e) => {
            e.preventDefault();
            submitForm(form);
        });
    }
}

export function formatClickEvent(btn) {
    btn.addEventListener("click", () => {
        const day = parseInt(document.getElementById("content").dataset.day);
        updateDisplay(btn.dataset.format, day);
    });
}

export function dayClickEvent(container) {
    container.addEventListener("click", () => {
        const format = document.getElementById("content").dataset.format;
        updateDisplay(format, parseInt(container.dataset.day));
    });
}