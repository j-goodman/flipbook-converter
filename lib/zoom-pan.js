var canvas
var ctx
var selectedImage
var globalInterval
var selectObj = {}

let initialize = () => {
    canvas = document.getElementById('canvas')
    ctx = canvas.getContext('2d')
    let formSubmit = document.getElementById('image-submit')
    formSubmit.onclick = receiveFiles
    let startFrameButton = document.getElementById('start-frame-button')
    let endFrameButton = document.getElementById('end-frame-button')
    let animateButton = document.getElementById('draw-button')
    startFrameButton.addEventListener('click', () => {
        selectObj.startFrameSelect = true
        selectObj.endFrameSelect = false
    })
    endFrameButton.addEventListener('click', () => {
        selectObj.startFrameSelect = false
        selectObj.endFrameSelect = true
    })
    animateButton.addEventListener('click', animate)
}

let receiveFiles = () => {
    let fileSource = document.querySelector('input[type=file]')
    let file = fileSource.files[0]
    let image = document.createElement('img')
    selectedImage = image
    let reader  = new FileReader()

    reader.addEventListener('load', () => {
        image.src = reader.result
        image.addEventListener('load', () => {
            canvas.width = image.width
            canvas.height = image.height
            ctx.drawImage(image, 0, 0)
            document.getElementsByClassName('image-controls')[0].classList.remove('hidden')
        })
        canvas.addEventListener('mousedown', drawSquare)
        canvas.addEventListener('mousemove', moveSquare)
        document.addEventListener('mouseup', endSquare)
    }, false)
    
    if (file) {
        reader.readAsDataURL(file)
    }
}

let resetToImage = () => {
    ctx.beginPath()
    ctx.closePath()
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(selectedImage, 0, 0)
}

let drawSquare = event => {
    if (selectObj.animating) { return false }
    let canvasRect = canvas.getBoundingClientRect()
    let anchor = {
        x: event.clientX - canvasRect.x,
        y: event.clientY - canvasRect.y
    }
    selectObj.anchor = anchor
    selectObj.mousedown = true
}

let moveSquare = event => {
    if (selectObj.animating) { return false }
    let canvasRect = canvas.getBoundingClientRect()
    let anchor = selectObj.anchor
    if (selectObj.mousedown) {
        resetToImage()
        ctx.rect(
            anchor.x,
            anchor.y,
            event.clientX - canvasRect.x - anchor.x,
            event.clientY - canvasRect.y - anchor.y
        )
        ctx.stroke()
        selectObj.width = event.clientX - canvasRect.x - anchor.x
        selectObj.height = event.clientY - canvasRect.y - anchor.y
    }
}

let endSquare = () => {
    if (selectObj.animating) { return false }
    window.clearInterval(globalInterval)
    selectObj.mousedown = false
    if (selectObj.startFrameSelect) {
        selectObj.startFrame = {
            x: selectObj.anchor.x,
            y: selectObj.anchor.y,
            width: selectObj.width,
            height: selectObj.height,
        }
        document.getElementById('startframe-list').innerText = `Start frame: x: ${selectObj.startFrame.x}, y: ${selectObj.startFrame.y}, width: ${selectObj.startFrame.width}, height:  ${selectObj.startFrame.height}.`
    } else if (selectObj.endFrameSelect) {
        selectObj.endFrame = {
            x: selectObj.anchor.x,
            y: selectObj.anchor.y,
            width: (selectObj.height * selectObj.startFrame.width) / selectObj.startFrame.height,
            height: selectObj.height,
        }
        document.getElementById('endframe-list').innerText = `End frame: x: ${selectObj.endFrame.x}, y: ${selectObj.endFrame.y}, width: ${selectObj.endFrame.width}, height:  ${selectObj.endFrame.height}.`
    }
}

let animate = () => {
    if (
        !selectObj.startFrame ||
        !selectObj.startFrame.x || !selectObj.startFrame.y ||
        !selectObj.startFrame.width || !selectObj.startFrame.height ||
        !selectObj.endFrame ||
        !selectObj.endFrame.x || !selectObj.endFrame.y ||
        !selectObj.endFrame.width || !selectObj.endFrame.height
    ) {
        window.alert('Select a start frame and end frame to animate between.')
        return false
    }
    selectObj.animating = true
    let start = selectObj.startFrame
    let end = selectObj.endFrame
    canvas.width = (canvas.height * start.width) / start.height
    selectObj.frames = selectObj.frames ? selectObj.frames : []
    let totalFrames = 16
    let frame = 0
    let interval = window.setInterval(() => {
        if (frame >= totalFrames) {
            window.clearInterval(interval)
        }
        // let increment = staticIncrement * 2 * (
        //     (frames / 2 - Math.abs(frames / 2 - frame)) / (frames / 2)
        // )
        selectObj.frames.push({
            x: (start.x * ((totalFrames - frame) / totalFrames)) + (end.x * (frame / totalFrames)),
            y: (start.y * ((totalFrames - frame) / totalFrames)) + (end.y * (frame / totalFrames)),
            width: (start.width * ((totalFrames - frame) / totalFrames)) + (end.width * (frame / totalFrames)),
            height: (start.height * ((totalFrames - frame) / totalFrames)) + (end.height * (frame / totalFrames)),
        })
        frame += 1
    }, 60)
    window.setTimeout(() => {
        let frame = 0
        let interval = window.setInterval(() => {
            if (frame >= 16) {
                window.clearInterval(interval)
            }
            let object = selectObj.frames[frame]
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.drawImage(selectedImage, (selectedImage.width / object.width) * (0 - object.x), (selectedImage.height / object.height) * (0 - object.y), (selectedImage.width / object.width) * selectedImage.width, (selectedImage.height / object.height) * selectedImage.height)
            frame += 1
        }, 10000)
    }, 1500)
}

window.addEventListener ('load', initialize)