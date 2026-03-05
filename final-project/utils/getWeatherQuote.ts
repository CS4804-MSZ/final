import { weatherQuotes } from "./weatherQuotes";

export function getWeatherQuote(tempF: number, precipMM: number) {

    if (precipMM > 20) {
        return random(weatherQuotes.heavyRain);
    }

    if (precipMM > 2) {
        return random(weatherQuotes.drizzle);
    }

    if (tempF <= 32) {
        return random(weatherQuotes.freezing);
    }

    if (tempF < 50) {
        return random(weatherQuotes.cold);
    }

    if (tempF < 65) {
        return random(weatherQuotes.cool);
    }

    if (tempF < 80) {
        return random(weatherQuotes.warm);
    }

    return random(weatherQuotes.hot);
}

function random(arr: string[]) {
    return arr[Math.floor(Math.random() * arr.length)];
}