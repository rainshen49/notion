import { writeFile, readFile } from "fs/promises"
import { fileURLToPath } from 'url'
import path from 'node:path';

function getIconUrl(code) {
    return `https://weather.gc.ca/weathericons/${code}.gif`
}

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

async function fetchWeather() {
    const forecasts = await fetch("https://weather.gc.ca/api/app/en/Location/ON-143?type=city")
        .then(res => res.json()).then(res => res[0]["dailyFcst"]["daily"]);
    const saturdays = forecasts.filter(d => d.date.startsWith("Sat"))
    return saturdays

}

async function readTemplate() {
    return (await readFile(path.join(dirname, "index.tmpl.html"))).toString();
}

const [saturdays, template] = await Promise.all([fetchWeather(), readTemplate()])
const content = saturdays.map(day => `
<div class="weather-block">
    <div class="date-big">${day["periodLabel"]}</div>
    <div class="date-small">${day["periodLabel"].split(",")[0]}</div>
    <div class="summary">${day["summary"]}</div>
    <div class="temp">${day["temperature"]["periodHigh"] ?? day["temperature"]["periodLow"]}°
    </div>
    <div class="icon">
        <img src="${getIconUrl(day["iconCode"])}"></img>
    </div>
</div>`).join("\n")

const output = template.replace(`<!-- Content here -->`, content)
await writeFile(path.join(dirname, "index.html"), output)
