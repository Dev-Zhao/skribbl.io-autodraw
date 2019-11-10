// The canvas that you draw on for Skribbl.io
let gameCanvas = document.getElementById('canvasGame');
// The container of the game canvas
let canvasContainer = document.getElementById('containerCanvas');

let toolbar = new Toolbar();
let artist = createArtist(toolbar);
let commandsProcessor = new CommandsProcessor([]);
let processingImage = false;

createInstructionOverlay();
let documentDragEventsHandler = createDocumentDragEventsHandler();
setUpDragEventsListeners();

function createInstructionOverlay() {
    // Instruction overlay tells the user where to drop the image to draw it
    let instructionOverlay = document.createElement('div');
    instructionOverlay.id = 'instruction-overlay';
    instructionOverlay.style.backgroundImage = 'url("' + chrome.extension.getURL("images/instruction_overlay_background.gif") + '")';
    canvasContainer.prepend(instructionOverlay);

    let instructionOverlayHeading = document.createElement('h1');
    instructionOverlayHeading.id = "instruction-overlay-heading";

    instructionOverlay.appendChild(instructionOverlayHeading);
};

function showInstructionOverlay(text) {
    let instructionOverlayHeading = document.getElementById("instruction-overlay-heading");
    instructionOverlayHeading.innerHTML = text;
    canvasContainer.classList.add('show-instruction-overlay');
};

function hideInstructionOverlay() {
    canvasContainer.classList.remove('show-instruction-overlay');
};

function createDocumentDragEventsHandler() {
    // Using a closure because it makes variables only accessible by the inner function and it stays alive between function calls
    // 'Closure' - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures#Closure
    let showOverlay = false;
    let timeout = null;

    // 'Detect Drag event entering and leaving window' - https://stackoverflow.com/a/14248483
    return function documentDragEventsHandler(event) {
        // Show overlay when 'dragenter' or 'dragover' occurs on anything in the document
        // 'dragenter' - something is dragged and enters an element on the page
        // 'dragover' - something is dragged and it's over an element on the page, will occur once every few hundred milliseconds while the dragged item is over the element
        if (event.type == 'dragenter' || event.type == 'dragover') {
            showOverlay = true;
            showInstructionOverlay("Drop an image here to draw!");
        }
        // If 'dragleave' occurs, it might mean that the dragged item has left the page. We set showOverlay to false, and check if it's still false after a small period of time. 
        // If no 'dragenter' or 'dragover' events occur during this period, it will remain false. This means the dragged item has left the page
        else if (event.type == 'dragleave') {
            showOverlay = false;

            // Clear existing timeout before setting next one. This is because if multiple dragleave happens in a short period of time, 
            // we would have many unnecessary timeouts, since they are all doing the samething.
            clearTimeout(timeout);

            timeout = setTimeout(() => {
                if (!showOverlay) {
                    hideInstructionOverlay();
                }
            }, 200);
        }
    };
};

function gameCanvasDragEventsHandler(event) {
    if (event.type == 'dragover') {
        // Must stop the default action of 'dragover' for 'drop' event to fire
        event.preventDefault();
    }
    else if (event.type == 'drop') { // Something is dropped into the game canvas
        hideInstructionOverlay();

        let imgSrc = dataTransferHelper.getSrcFromImgFile(event.dataTransfer) || dataTransferHelper.getSrcFromImgElement(event.dataTransfer);

        if (imgSrc) {
            drawImage(imgSrc);
        }

        // Prevent browser from loading the file that is dropped
        event.preventDefault();
    }
};

function setUpDragEventsListeners() {
    document.addEventListener('dragenter', documentDragEventsHandler);
    document.addEventListener('dragover', documentDragEventsHandler);
    document.addEventListener('dragleave', documentDragEventsHandler);

    gameCanvas.addEventListener('dragover', gameCanvasDragEventsHandler);
    gameCanvas.addEventListener('drop', gameCanvasDragEventsHandler);
}

function removeDragEventsListeners(){
    document.removeEventListener('dragenter', documentDragEventsHandler);
    document.removeEventListener('dragover', documentDragEventsHandler);
    document.removeEventListener('dragleave', documentDragEventsHandler);

    gameCanvas.removeEventListener('dragover', gameCanvasDragEventsHandler);
    gameCanvas.removeEventListener('drop', gameCanvasDragEventsHandler);
}

function drawImage(imgSrc) {
    if (!processingImage){
        showInstructionOverlay("Processing Image...");
        removeDragEventsListeners();

        imageHelper.loadImage(imgSrc).then((img) => {
            Promise.all([storage.getData("drawMode"), storage.getData("brushNum")]).then((data) => {
                drawCommands = artist.draw(img, {
                    drawMode: data[0],
                    brushNum: data[1]
                });

                hideInstructionOverlay();
                setUpDragEventsListeners();
                processingImage = false;
    
                commandsProcessor.setCommands(drawCommands);
    
                commandsProcessor.process(10, () => {
                    return toolbar.isActive;
                });
            });
        }).catch(() => {
            showInstructionOverlay("Whoops.. Image failed to load.");

            setTimeout(() => {
                hideInstructionOverlay();
                setUpDragEventsListeners();
                processingImage = false;
            }, 2000);
        });
    }
};