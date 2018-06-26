let receiveFiles = () => {
    let preview = document.getElementById('preview-section')
    let convertButton = document.getElementById('multi-image-convert')
    let fileSource = document.querySelector('input[type=file]')
    let images = []
    
    preview.innerHTML = ''

    Array.from(fileSource.files).map(file => {
        let previewImage = document.createElement('img')
        let output = document.createElement('img')
        let reader  = new FileReader()
        
        reader.addEventListener('load', () => {
            previewImage.src = reader.result
            output.src = reader.result
        }, false)
        
        if (file) {
            reader.readAsDataURL(file)
        }
        
        preview.appendChild(previewImage)
        images.push(output)
    })
    
    convertButton.addEventListener('click', () => {
        makeFilmStrip(images)
    })
}

let sum = (total, num) => {
    return total + num;
}

let makeFilmStrip = images => {
    let canvas = document.getElementById('output-canvas')
    let ctx = canvas.getContext('2d')
    window.images = images
    canvas.height = images[0].height
    canvas.width = images.map(img => { return img.width }).reduce(sum)
    images.map((image, index) => {
        let x = images.map((img, ind) => { return ind >= index ? 0 : img.width }).reduce(sum)
        ctx.drawImage(image, x, 0)
    })
    document.getElementById('download-info').innerText = 'Right click canvas (above) to download filmstrip as image.'
}

window.addEventListener ('load', () => {
     let formSubmit = document.getElementById('multi-image-submit')
     formSubmit.onclick = receiveFiles
})