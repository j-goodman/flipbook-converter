window.receiveFiles = () => {
    let preview = document.getElementById('preview-section')
    let fileSource = document.querySelector('input[type=file]')

    Array.from(fileSource.files).map(file => {
        let output = document.createElement('img')
        let reader  = new FileReader()
        
        reader.addEventListener('load', () => {
            output.src = reader.result
        }, false)
        
        if (file) {
            reader.readAsDataURL(file)
        }
        
        preview.appendChild(output)
    })
}

window.addEventListener ('load', () => {
     let formSubmit = document.getElementById('multi-image-submit')
     formSubmit.onclick = receiveFiles
})