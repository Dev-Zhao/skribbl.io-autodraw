let imageHelper = {
    // 'Load an image using Promise()' - https://stackoverflow.com/a/52060802
    // 'Promise' - https://javascript.info/promise-basics
    loadImage: function (imgSrc) {
        return new Promise(function (resolve, reject) {
            let img = new Image();

            img.addEventListener('load', function () {
                resolve(img);
            });

            img.addEventListener('error', reject);

            // When you draw on a canvas with any data loaded from another origin without CORS, canvas becomes tainted.
            // Any attempts to retrieve image data from canvas will cause an exception.
            // 'Allowing cross-origin use of images and canvas' - 'https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image
            img.crossOrigin = "Anonymous"; // Fetch image using CORS without credentials - https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#Attributes
            img.src = imgSrc;
        });
    },

    scaleImage: function (img, options) {
        // Setting options or using default values if they don't exist
        let size = {
            width: options.width || 800,
            height: options.height || 600,
        };
        let scaleMode = options.scaleMode || 'scaleToFit';

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

        // Draw the image on the canvas, this is where the scaling happens
        // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
        let canvasContext = canvas.getContext('2d');
        canvasContext.drawImage(img, dx, dy, scaledImageWidth, scaledImageHeight);

        return canvasContext.getImageData(0, 0, canvas.width, canvas.height);
    },

    getPixelColor: function(imageData, x, y){
        const data = imageData.data;

        // Suppose you have a 2x2 image:
        // RED PIXEL  (x:0, y:0) |       GREEN PIXEL (x:1, y:0)
        // BLUE PIXEL (x:0, y:1) | TRANSPARENT PIXEL (x:1, y:1)
        // The data array is 1-dimensional, and it looks like this:
        // [ 255, 0, 0, 255, 0, 255, 0, 255, 0, 0, 255, 255, 0, 0, 0, 0 ]  
        // |   1ST PIXEL   |   2ND PIXEL   |   3RD PIXEL   | 4TH  PIXEL |
        // Each pixel has 4 values which corresponds to rgba
        // Notice the index for the first pixel's values starts at 0, second pixel: 4, third: 8, fourth: 12
        // This can be calculated using the formula: 4*y*imageWidth + 4*x
        let i = 4 * y * imageData.width + 4 * x; // r: data[i], g: data[i+1], b: data[i+2], a: data[i+3]

        return new Color(data[i], data[i+1], data[i+2], data[i+3]);
    },

    // 'Get average color from area of image' - https://stackoverflow.com/a/44557266
    // To get the pixel data (array) from an area of the image, the solution uses: context.getImageData(x, y, width, height).data
    // This is very slow, it's much faster to get the pixel data (array) of the entire image and use indexes to get the values for the specific pixels you want
    getAverageColor: function (imageData, startX, startY, width, height) {
        let totals = { r: 0, g: 0, b: 0, weight: 0, numPixels: 0};

        for (let y = startY; y < startY + height; y++) {
            for (let x = startX; x < startX + width; x++) {
                let color = this.getPixelColor(imageData, x, y);

                // Use the alpha channel as the weight, the more transparent the pixel, the less we care about its rgb values
                let weight = color.a / 255;
                totals.r += color.r * weight;
                totals.g += color.g * weight;
                totals.b += color.b * weight;
                totals.weight += weight;
                totals.numPixels++;         
            }
        }

        let averageColor = new Color(
            // The | operator stands for bitwise OR, OR 0 will truncate any decimals
            // 'Using bitwise OR 0 to floor a number' - https://stackoverflow.com/questions/7487977/using-bitwise-or-0-to-floor-a-number
            totals.r / totals.weight | 0, // r
            totals.g / totals.weight | 0, // g
            totals.b / totals.weight | 0, // b
            totals.weight / totals.numPixels, // a
        );

        return averageColor;
    },
};