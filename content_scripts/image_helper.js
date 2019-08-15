let imageHelper = {
    // User may drag and drop an image from their computer
    getSrcFromImgFile: function (dataTransfer) {
        let imgSrc = null;

        // Check if there is a file
        if (dataTransfer.files.length) {
            // Check if file is an image
            if (dataTransfer.files[0].type.startsWith('image')) {
                // Create URL so it can be used with <img> elements
                // 'How to load image from user' - https://stackoverflow.com/a/51760964
                // 'Using URL.createObjectURL()' - https://chrisrng.svbtle.com/using-url-createobjecturl
                imgSrc = URL.createObjectURL(dataTransfer.files[0]);
            }
        }

        return imgSrc;
    },

    // User may drag and drop an image from the web
    getSrcFromImgElement: function (dataTransfer) {
        let imgSrc = null;

        let data = dataTransfer.getData('text/html');
        if (data) {
            // Although the data is in 'text/HTML' format, it's still just text 
            // This converts the text into DOM elements we can interact with
            // 'Converting HTML string into DOM elements' - https://stackoverflow.com/a/3104251
            let wrapper = document.createElement('div');
            wrapper.innerHTML = data;

            // We extract the element that was just converted from text and check if it's an <img> element
            let element = wrapper.firstChild;
            if (element && element.tagName == "IMG") {
                imgSrc = element.src;
            }
        }

        return imgSrc;
    },

    scaleImage: function (img, size, scaleMode) {
        let canvas = document.createElement('canvas');

        // 'Scaling an image to fit on canvas' - https://stackoverflow.com/a/23105310
        // See it live: https://codepen.io/charliezhao0916/pen/oKayxE
        let wRatio = size.width / img.width;
        let hRatio = size.height / img.height;

        let ratio;
        let scaledImageWidth;
        let scaledImageHeight;

        switch (scaleMode) {
            // Suppose image original size is 200 x 300, and size parameter is 800 x 600
            // wRatio: 800/200 = 4, hRatio: 600 / 300 = 2
            case 'scaleToFit':
                // Determine which ratio is smaller. For the example, the hRatio would be smaller. 
                // The image width/height will be multiplied by this ratio, so the image size is now 400x600
                // Note: the image size will always be equal or smaller than the size parameter --> scaled to fit
                ratio = Math.min(wRatio, hRatio);

                scaledImageWidth = img.width * ratio;
                scaledImageHeight = img.height * ratio;

                // The image size is smaller than the size parameter, so we set canvas size to the image size to remove empty space
                canvas.width = scaledImageWidth;
                canvas.height = scaledImageHeight;
                break;
            case 'scaleToFill':
                // Determine which ratio is larger. For the example, the wRatio would be larger. 
                // The image width/height will be multiplied by this ratio, so the image size is now 800 x 1200
                // Note: the image size will always be equal or larger than the size parameter --> scaled to fill
                ratio = Math.max(wRatio, hRatio);

                scaledImageWidth = img.width * ratio;
                scaledImageHeight = img.height * ratio;

                // The image size is larger than the size parameter, so we set canvas size to the size parameter.
                // Some parts of the image will be cut off, but we are limited to the size parameter.
                canvas.width = size.width;
                canvas.height = size.height;
                break;
        }

        // This determines from where on the canvas we are drawing the image
        // It is set so that we are always centering the image on the canvas
        let dx = (canvas.width - scaledImageWidth) / 2;
        let dy = (canvas.height - scaledImageHeight) / 2;

        let canvasContext = canvas.getContext('2d');
        canvasContext.drawImage(img, dx, dy, scaledImageWidth, scaledImageHeight);

        return canvasContext.getImageData(0, 0, canvas.width, canvas.height);
    }
};

/*
        let imgProcessor = createImageProcessor(img);
        let imageData = imgProcessor.processImage({scaleImage: true, scaleMode: 'scaleToFill', size: {width: 500, height: 300}});
        let cache = {};
        let colorPalette = createColorPalette(toolbar.getColors(), cache);
        let data = imageData.data;

        let rect = gameCanvas.getBoundingClientRect();
        let x = 0;
        let y = 0;
        toolbar.setBrushThickness(20.2);
        for (let i = 0; i < 1000; i += 4) {
            let currentColor = { r: data[i], g: data[i+1], b: data[i+2]};
            let closestColor = colorPalette.getNearestColor(currentColor);

            toolbar.setColor(JSON.stringify(closestColor));


            let evt = new MouseEvent ("mousedown", {bubbles: true, clientX: rect.x+x, clientY: rect.y+y, button: 0});
            gameCanvas.dispatchEvent(evt);
            let evt2 = new MouseEvent ("mouseup", {bubbles: true, clientX: rect.x+x, clientY: rect.y+y, button: 0});
            gameCanvas.dispatchEvent(evt2);

           x++;
           if (x > 800){
               y++;
               x = 0;
           }
       }
*/