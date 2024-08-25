import { writeFile, readFile } from "fs/promises"
import { fileURLToPath } from 'url'
import path from 'node:path';

function getIconUrl(code) {
    return `https://weather.gc.ca/weathericons/${code}.gif`
}

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

async function fetchWeather() {
    const forecasts = await fetch("https://weather.gc.ca/api/app/en/Location/43.655,-79.383?type=city")
        .then(res => res.json()).then(res => res[0]["dailyFcst"]["daily"]);
    const saturdays = forecasts.filter(d => d.date.startsWith("Sat"))
    return saturdays
}

function getNextSaturday() {
    const today = new Date();
    const desiredDay = 6; // 0 for Sunday, 1 for Monday, ..., 6 for Saturday

    // Get the days difference between today and the desired day
    const difference = (desiredDay + 7 - today.getDay()) % 7;

    // Add the difference to today's date to get the next desired day
    const nextSaturday = new Date(today.getTime() + difference * 24 * 60 * 60 * 1000);

    return nextSaturday;
}

async function fetchSunset(date) {
    // Toronto
    const latitude = 43.70011
    const longitude = -79.4163
    const url = `https://api.sunrisesunset.io/json?lat=${latitude}&lng=${longitude}&date=${date}`

    const data = await fetch(url)
        .then(response => response.json())
    const sunset = data["results"]["sunset"]
    return sunset.split(" ")[0].split(":").slice(0, 2).join(":") // Only keep the hour & minute
}

async function readTemplate() {
    return (await readFile(path.join(dirname, "index.tmpl.html"))).toString();
}

const nextSaturday = getNextSaturday().toISOString().slice(0, 10)

const [saturdays, template, sunset] = await Promise.all([fetchWeather(), readTemplate(), fetchSunset(nextSaturday)])

const content = saturdays.map((day, i) => `
<div class="weather-block">
    <div class="date-big">${i == 1 ? `Sunset ${sunset}` : day["periodLabel"]}</div>
    <div class="date-small">${i == 1 ? `Sunset ${sunset}` : day["periodLabel"].split(",")[0]}</div>
    <div class="summary">${day["summary"]}</div>
    <div class="temp">${day["temperature"]["periodHigh"] ?? day["temperature"]["periodLow"]}°
    </div>
    <div class="icon">
        <img src="${getIconUrl(day["iconCode"])}"></img>
    </div>
</div>`).join("\n")

const output = template.replace(`<!-- Content here -->`, content)
await writeFile(path.join(dirname, "index.html"), output)
