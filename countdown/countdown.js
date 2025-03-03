const hourEl = document.getElementById("hour")
const minuteEl = document.getElementById("minute")
const secondEl = document.getElementById("second")
const videoEl = document.getElementById("fireworks")
const title = document.getElementsByClassName("title")[0]

function closeVideo() {
    videoEl.pause()
    videoEl.parentElement.classList.add("hidden")
}

const timer = setInterval(() => {
    const now = new Date().getTime()
    let diff = goal - now

    if (diff <= 0) {
        clearInterval(timer)
        videoEl.parentElement.classList.remove("hidden")
        title.textContent = "🎂 Happy Birthday 🥳"
        videoEl.play()
        return
    }

    if (diff <= 10000) {
        secondEl.classList.add("close")
        // TODO: play countdown music
    }

    const hours = Math.floor(diff / 3600000)
    diff -= 3600000 * hours
    const minutes = Math.floor(diff / 60000)
    diff -= 60000 * minutes
    const seconds = Math.floor(diff / 1000)

    hourEl.textContent = `${hours < 10 ? "0" : ""}${hours}`
    minuteEl.textContent = `${minutes < 10 ? "0" : ""}${minutes}`
    secondEl.textContent = `${seconds < 10 ? "0" : ""}${seconds}`
}, 100)