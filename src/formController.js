import { fetchData } from "./apiController.js";

export function submitForm(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    const query = data.q;

    fetchData(query);
}