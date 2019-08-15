let createToolbar = function () {
    // 'Get Color Component from RGB String' - https://stackoverflow.com/questions/10970958/get-a-color-component-from-an-rgb-string-in-javascript
    // Example rgbString: 'rgb(255, 0, 6)' - This can be obtained from element.style.backgroundColor
    // rgbString.substring(4, rgb.length - 1): '255, 0, 6'
    // .replace(/ /g, ''): '255,0,6'
    // .split(','): ['255', '0', '6']
    // Result: { r: 255, g: 0, b: 6 }
    let toColorObject = function (rgbString) {
        let rgb = rgbString.substring(4, rgbString.length - 1).replace(/ /g, '').split(',');
        return { r: parseInt(rgb[0]), g: parseInt(rgb[1]), b: parseInt(rgb[2]) };
    }

    let toolbarElement = document.querySelector('.containerToolbar');

    let colorElementsContainer = toolbarElement.querySelector('.containerColorbox');
    let colorElements = Array.prototype.slice.call(colorElementsContainer.querySelectorAll('.colorItem'));
    let colorElementsLookup = {}; // The lookup will look like this: { '{"r":0-255,"g":0-255,"b":0-255}' : colorElement, ... }
    let colors = []; // This will look like [ {r: 0-255, g: 0-255, b: 0-255}, ... ] 
    colorElements.forEach(function (element) {
        let color = toColorObject(element.style.backgroundColor);
        colorElementsLookup[JSON.stringify(color)] = element;
        colors.push(color);
    });

    let toolElementsContainer = toolbarElement.querySelector('.containerTools');
    let toolElementsLookup = {
        penTool: toolElementsContainer.children[0],
        eraseTool: toolElementsContainer.children[1],
        fillTool: toolElementsContainer.children[2]
    }

    let brushElementsContainer = toolbarElement.querySelector('div.containerBrushSizes');
    let brushElementsLookup = {
        4: brushElementsContainer.children[0],
        9.4: brushElementsContainer.children[1],
        20.2: brushElementsContainer.children[2],
        40: brushElementsContainer.children[3]
    }

    let clearCanvasButton = document.getElementById('buttonClearCanvas');

    // All of these toolbar elements are provided by Skribbl.io, if we want to use them, we need to click on the appropriate element.
    // The toolbar only appears if it's the player's turn to draw.
    return {
        getColors: function (){
            return colors;
        },

        setColor: function (color) {
            colorElementsLookup[color].click();
        },

        useTool: function (tool) {
            toolElementsLookup.click();
        },

        getBrushThicknesses: function (size){
            return [4, 9.4, 20.2, 40];
        },

        setBrushThickness: function (size) {
            brushElementsLookup[size].click();
        },

        clearCanvas: function () {
            clearCanvasButton.click();
        },

        isActive: function () {
            // If toolbar is not active, then Skribbl.io gives it a 'display: none'
            return (toolbarElement.style.display != 'none');
        }
    };
};