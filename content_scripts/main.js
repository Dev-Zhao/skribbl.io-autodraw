var gameCanvas = document.getElementById('canvasGame');

var instructionOverlay = document.createElement("div");
instructionOverlay.id = "instructionOverlay";
instructionOverlay.style.backgroundImage = "url('" + chrome.extension.getURL("images/instruction_overlay_background.gif") + "')";
instructionOverlay.classList.add("hide");
document.getElementById("containerCanvas").prepend(instructionOverlay);

var instructionOverlayText = document.createElement("h1");
instructionOverlayText.appendChild(document.createTextNode("Drop an image here to draw!"));
instructionOverlayText.style.textAlign = "center";
instructionOverlay.appendChild(instructionOverlayText);

document.addEventListener("dragstart", function (event) {
    // show overlay and hide game canvas
    instructionOverlay.classList.remove("hide");
    gameCanvas.style.opacity = 0;
});

document.addEventListener("dragend", function (event) {
    // Hide overlay and show canvas
    instructionOverlay.classList.add("hide");
    gameCanvas.style.opacity = 1;
});