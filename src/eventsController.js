import { updateDisplay } from "./displayController.js";
import { submitForm } from "./formController.js";

const query = document.getElementById("search-query");
const queryError = document.getElementById("query-error");

const isQueryValid = () => {
    return query.value !== "";
}

const setSearchClass = (isValid) => {
    query.className = isValid ? "valid" : "invalid";

    if (!isValid) {
        const TIME_OUT = 3000;

        setTimeout(() => {
            query.removeAttribute("class");
        }, TIME_OUT);
    }
};

const updateSearchError = (isValid) => {
    if (isValid) {
        queryError.textContent = "";
        queryError.removeAttribute("class");
        queryError.style.display = "none";
    } else {
        const TIME_OUT = 3000;

        queryError.textContent = "Please enter a location!";
        queryError.setAttribute("class", "active");
        queryError.style.display = "block";

        setTimeout(() => {
            queryError.textContent = "";
            queryError.removeAttribute("class");
            queryError.style.display = "none";
        }, TIME_OUT);
    }
};

const handleQueryInput = () => {
    const queryValid = isQueryValid();
    setSearchClass(queryValid);
    updateSearchError(queryValid);
};

const handleSubmit = (e) => {
    e.preventDefault();

    const form = e.target;
    const queryValid = isQueryValid();
    setSearchClass(queryValid);
    updateSearchError(queryValid);

    if (!queryValid) return;

    submitForm(form);
}

export const eventListeners = {
    init() { 
        const form = document.getElementById("search-form");
        form.addEventListener("submit", handleSubmit);
        query.addEventListener("input", handleQueryInput);
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