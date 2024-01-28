import { writeFile } from "fs/promises"

await fetch("https://weather.gc.ca/api/app/en/Location/ON-143?type=city",
    { mode: "cors" })
    .then(res => res.json()).then(res => res[0]["dailyFcst"]["daily"])
    .then(forecast => {
        writeFile("weather.json", JSON.stringify(forecast, null, 2))
    });