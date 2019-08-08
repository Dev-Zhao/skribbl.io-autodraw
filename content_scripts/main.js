// This is the canvas that you draw on for Skribbl.io
let gameCanvas = document.getElementById('canvasGame');
// The container of the game canvas
let canvasContainer = document.getElementById('containerCanvas');

let setUpInstructionOverlay = function () {
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

// Show overlay when 'dragenter' or 'dragover' occurs on the entire document (every element)
// 'dragenter' - something is dragged and enters any element on the page
// 'dragover' - something is dragged and it's over an element on the page, will occur every few hundred milliseconds for as long as the dragged item is over the element
let showOverlay = true;
let timeout = -1;
document.addEventListener('dragenter', function (event) {
    showOverlay = true;
    showInstructionOverlay();
});

document.addEventListener('dragover', function (event) {
    showOverlay = true;
    showInstructionOverlay();
});

// If the dragged item leaves an element, we set showOverlay to false, and check if it's still false after a small period of time.
// If it's still false then the dragged item has left the page and we hide the overlay.
// 'Detect Drag event entering and leaving window' - https://stackoverflow.com/a/14248483
document.addEventListener('dragleave', function (event) {
    showOverlay = false;
    
    // Clear existing timeout before setting next one. This is because if multiple dragleave happens in a short period of time, 
    // we would have many unnecessary timeouts, since they are all doing the samething.
    clearTimeout(timeout);

    timeout = setTimeout(function () {
        if (!showOverlay) {
            hideInstructionOverlay();
        }
    }, 200);
});

gameCanvas.addEventListener('dragover', function (event) {
    // Must stop the default action of 'dragover' for 'drop' event to fire
    event.preventDefault();
});

gameCanvas.addEventListener('drop', function (event) {

    // When the dragged item is dropped into the game canvas, we hide the overlay
    hideInstructionOverlay();

    // Prevent browser from loading the file that you drop
    event.preventDefault();
});

setUpInstructionOverlay();