import { loadFromStorage } from "./storageController";

export function updateDisplay(filename) {
    const data = loadFromStorage(filename);

    const content = document.getElementById("content");
    content.innerHTML = "";

    const daysContainer = document.createElement("div");
    daysContainer.className = "days-container";

    data.days.forEach((day) => {
        const divContainer = document.createElement("div");

        const iconContainer = document.createElement("div");
        iconContainer.textContent = day.icon;

        const dayContainer = document.createElement("div");
        dayContainer.textContent = day.datetime;

        const tempContainer = document.createElement("div");
        tempContainer.textContent = `${day.temp}°C`;

        divContainer.append(iconContainer, dayContainer, tempContainer);
        daysContainer.appendChild(divContainer);
    })

    content.appendChild(daysContainer);
}