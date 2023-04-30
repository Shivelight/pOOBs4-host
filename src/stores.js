import { writable } from "svelte/store";

export const goldhenBinloader = writable(false);
let prefs = JSON.parse(localStorage.getItem("preferences")) ?? {};
export const preferences = writable(prefs);
preferences.subscribe((value) => {
  localStorage.preferences = JSON.stringify(value);
});
