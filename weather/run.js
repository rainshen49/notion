import { writeFile, readFile } from "fs/promises"
import { fileURLToPath } from 'url'
import path from 'node:path';

function getIconUrl(code) {
    return `https://weather.gc.ca/weathericons/${code}.gif`
}

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const forecasts = await fetch("https://weather.gc.ca/api/app/en/Location/ON-143?type=city",
    { mode: "cors" })
    .then(res => res.json()).then(res => res[0]["dailyFcst"]["daily"]);
const indexHtml = await readFile(path.join(dirname, "index.tmpl.html"));

const saturdays = forecasts.filter(d => d.date.startsWith("Sat"))
const content = saturdays.map(day => `
<tr>
    <th class="date">${day["periodLabel"]}</th>
    <td class="summary">${day["summary"]}</td>
    <td class="temp">${day["temperature"]["periodHigh"] ?? day["temperature"]["periodLow"]} ℃
    </td>
    <td class="icon">
    <img src="${getIconUrl(day["iconCode"])}"></img>
    </td>
<tr>`).join("\n")

const output = indexHtml.toString().replace(`<!-- Content here -->`, content)
await writeFile(path.join(dirname, "index.html"), output)