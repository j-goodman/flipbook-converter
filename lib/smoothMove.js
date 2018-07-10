function smoothMove (start, end, frames, frameRate, action) {
    // Eases a value from |start| to |end| in |frames| intervals, executing
    // function |action| each time.
    let frame = 0
    let totalIncrement = start
    let distance = end - start
    let staticIncrement = distance / frames
    if (window.movementInterval) {
        window.clearInterval(window.movementInterval)
    }
    window.movementInterval = window.setInterval(function () {
        let increment = staticIncrement * 2 * (
            (frames / 2 - Math.abs(frames / 2 - frame)) / (frames / 2)
        )
        if (frame++ > frames) {
            window.clearInterval(window.movementInterval)
        }
        totalIncrement += increment
        action(totalIncrement)
    }, frameRate)
}