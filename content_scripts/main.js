// The canvas that you draw on for Skribbl.io
let gameCanvas = document.getElementById('canvasGame');
// The container of the game canvas
let canvasContainer = document.getElementById('containerCanvas');

let createInstructionOverlay = function () {
    let instructionOverlay = document.createElement('div');
    instructionOverlay.id = 'instruction-overlay';
    instructionOverlay.style.backgroundImage = 'url("' + chrome.extension.getURL("images/instruction_overlay_background.gif") + '")';
    canvasContainer.prepend(instructionOverlay);

    let instructionOverlayText = document.createElement('h1');
    instructionOverlayText.appendChild(document.createTextNode('Drop an image here to draw!'));
    instructionOverlay.appendChild(instructionOverlayText);
};

let showInstructionOverlay = function () {
    canvasContainer.classList.add('show-instruction-overlay');
};

let hideInstructionOverlay = function () {
    canvasContainer.classList.remove('show-instruction-overlay');
};

// 'Load an image using Promise()' - https://stackoverflow.com/a/52060802
// 'Promise' - https://javascript.info/promise-basics
let loadImage = function (imgSrc) {
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
};

let drawImage = function (imgSrc) {
    loadImage(imgSrc).then(function (img) {
    });
};

let createDocumentDragEventsHandler = function () {
    // Using a closure because it makes variables only accessible by the inner function and it stays alive between function calls
    // 'Closure' - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures#Closure
    let showOverlay = false;
    let timeout = null;

    // 'Detect Drag event entering and leaving window' - https://stackoverflow.com/a/14248483
    return function documentDragEventsHandler(event) {
        // Show overlay when 'dragenter' or 'dragover' occurs on the entire document (every element)
        // 'dragenter' - something is dragged and enters any element on the page
        // 'dragover' - something is dragged and it's over an element on the page, will occur once every few hundred milliseconds while the dragged item is over the element
        if (event.type == 'dragenter' || event.type == 'dragover') {
            showOverlay = true;
            showInstructionOverlay();
        }
        // If 'dragleave' occurs, it could mean that the dragged item has left the page. We set showOverlay to false, and check if it's still false after a small period of time. 
        // If no 'dragenter' or 'dragover' events occur during this period, it will be false, which will only be the case if the dragged item has left the page
        else if (event.type == 'dragleave') {
            showOverlay = false;

            // Clear existing timeout before setting next one. This is because if multiple dragleave happens in a short period of time, 
            // we would have many unnecessary timeouts, since they are all doing the samething.
            clearTimeout(timeout);

            timeout = setTimeout(function () {
                if (!showOverlay) {
                    hideInstructionOverlay();
                }
            }, 200);
        }
    };
};

let gameCanvasDragEventsHandler = function (event) {
    if (event.type == 'dragover') {
        // Must stop the default action of 'dragover' for 'drop' event to fire
        event.preventDefault();
    }
    else if (event.type == 'drop') {
        // When the dragged item is dropped into the game canvas, hide the overlay
        hideInstructionOverlay();

        let imgSrc = imageHelper.getSrcFromImgFile(event.dataTransfer) || imageHelper.getSrcFromImgElement(event.dataTransfer);

        if (imgSrc) {
            drawImage(imgSrc);
        }

        // Prevent browser from loading the file that is dropped
        event.preventDefault();
    }
};

let documentDragEventsHandler = createDocumentDragEventsHandler();
document.addEventListener('dragenter', documentDragEventsHandler);
document.addEventListener('dragover', documentDragEventsHandler);
document.addEventListener('dragleave', documentDragEventsHandler);

gameCanvas.addEventListener('dragover', gameCanvasDragEventsHandler);
gameCanvas.addEventListener('drop', gameCanvasDragEventsHandler);

createInstructionOverlay();