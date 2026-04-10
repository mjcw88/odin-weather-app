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