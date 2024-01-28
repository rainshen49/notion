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
<tr>
    <th class="date-big">${day["periodLabel"]}</th>
    <th class="date-small">${day["periodLabel"].split(",")[0]}</th>
    <td class="summary">${day["summary"]}</td>
    <td class="temp">${day["temperature"]["periodHigh"] ?? day["temperature"]["periodLow"]} ℃
    </td>
    <td class="icon">
    <img src="${getIconUrl(day["iconCode"])}"></img>
    </td>
<tr>`).join("\n")

const output = template.replace(`<!-- Content here -->`, content)
await writeFile(path.join(dirname, "index.html"), output)