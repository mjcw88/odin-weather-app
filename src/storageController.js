export const clearStorage = {
    init() { 
        localStorage.clear();
    }
}

function storageAvailable(type) {
    let storage;
    try {
        storage = window[type];
        const x = "__storage_test__";
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    } catch (e) {
        return (
            e instanceof DOMException &&
            e.name === "QuotaExceededError" &&
            // acknowledge QuotaExceededError only if there's something already stored
            storage &&
            storage.length !== 0
        );
    }
}

export function saveToStorage(filename, data) {
    if (storageAvailable("localStorage")) {
        localStorage.setItem(filename, JSON.stringify(data));
    } else {
        console.error("localStorage unavailable");
    }
}

export function loadFromStorage(filename) {
    if (storageAvailable("localStorage")) {
        return JSON.parse(localStorage.getItem(filename));
    } else {
        console.error("localStorage unavailable");
        return null;
    }
}