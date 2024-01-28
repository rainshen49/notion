import { writeFile } from "fs/promises"
import { fileURLToPath } from 'url'
import path from 'node:path';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
await fetch("https://weather.gc.ca/api/app/en/Location/ON-143?type=city",
    { mode: "cors" })
    .then(res => res.json()).then(res => res[0]["dailyFcst"]["daily"])
    .then(forecast => {
        writeFile(path.join(dirname, "weather.json"), JSON.stringify(forecast, null, 2))
    });