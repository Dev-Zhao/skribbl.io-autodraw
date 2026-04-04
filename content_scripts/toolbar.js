class Toolbar{
    constructor(){
        this._toolbarElement = document.getElementById('game-toolbar');

        let colorElementsContainer = this._toolbarElement.querySelector('.colors');
        let colorElements = Array.prototype.slice.call(colorElementsContainer.querySelectorAll('.color'));
        this._colorElementsLookup = {}; // The lookup will look like this: { '{"r":0-255,"g":0-255,"b":0-255}' : colorElement, ... }
        this._colors = []; // This will look like [ {r: 0-255, g: 0-255, b: 0-255}, ... ]
        colorElements.forEach((element) => {
            // element.style.backgroundColor is an RGB string: 'rgb(0-255, 0-255, 0-255)'
            // We need to convert it to a color object to use it
            let color = Color.getColorFromRGBString(element.style.backgroundColor);
            this._colorElementsLookup[color.JSONString] = element;
            this._colors.push(color);
        });

        // Used to store a color and its nearest color that's available in game.
        // This means we only have to calculate the nearest color for a given color once.
        this._nearestColorLookup = {};

        let toolElementsContainer = this._toolbarElement.querySelector('.toolbar-group-tools');
        this._toolElementsLookup = {
            brush: toolElementsContainer.children[0],
            eraser: null,
            fill: toolElementsContainer.children[1]
        }

        let brushElementsContainer = this._toolbarElement.querySelector('.sizes .container');
        this._brushElementsLookup = {
            0 : {
                brushDiameterforDots: 4,
                brushDiameterforLines: 2.7,
                brushElement: brushElementsContainer.children[1]
            },
            1 : {
                brushDiameterforDots: 9,
                brushDiameterforLines: 6,
                brushElement: brushElementsContainer.children[2]
            },
            2 : {
                brushDiameterforDots: 20,
                brushDiameterforLines: 17,
                brushElement: brushElementsContainer.children[3]
            },
            3 : {
                brushDiameterforDots: 40,
                brushDiameterforLines: 37,
                brushElement: brushElementsContainer.children[4]
            },
        };

        this._clearCanvasButton = document.querySelector('.toolbar-group-actions .tool[data-tooltip="Clear"]');
    }

    get colors(){
        return this._colors;
    }

    get isActive(){
        let canvas = document.querySelector('#game-canvas canvas');
        if (!canvas) return false;
        let cursor = canvas.style.cursor;
        return cursor !== '' && cursor !== 'default' && cursor !== 'not-allowed';
    }

    getNearestAvailableColor(color){ // get nearest color that's available in game.
        let shortestDistance = Number.MAX_SAFE_INTEGER;
        let key = color.JSONString;
        let nearestColor;

        if (color.a == 0){
            nearestColor = new Color(0, 0, 0, 0);
        }
        else if (key in this._nearestColorLookup) {
            // look for the nearest color in the lookup. This is what the lookup looks like:
            // { (color in JSON string format) : (nearest color that's available in game) }
            nearestColor = this._nearestColorLookup[key];
        }
        else { // nearest color could not found in lookup
            for (let i = 0; i < this._colors.length; i++) {
                let distance = Color.distance(color, this._colors[i]);

                if (distance < shortestDistance) {
                    shortestDistance = distance;
                    nearestColor = this._colors[i];
                }
            }

            // Store the nearest color in the lookup
            this._nearestColorLookup[key] = nearestColor;
        }

        return nearestColor;
    }

    // All of these toolbar elements are provided by Skribbl.io, if we want to use them, we need to click on the appropriate element.
    // The toolbar only appears if it's the player's turn to draw.
    setColor(color) {
        const element = this._colorElementsLookup[color.JSONString];
        const eventInit = {
            bubbles: true,
            cancelable: true,
            button: 0,
            buttons: 1,
            pointerId: 1,
            isPrimary: true,
            pointerType: 'mouse'
        };
        element.dispatchEvent(new PointerEvent('pointerdown', eventInit));
        element.dispatchEvent(new MouseEvent('mousedown', eventInit));
        element.dispatchEvent(new PointerEvent('pointerup', { ...eventInit, buttons: 0 }));
        element.dispatchEvent(new MouseEvent('mouseup', { ...eventInit, buttons: 0 }));
        element.dispatchEvent(new MouseEvent('click', { ...eventInit, buttons: 0 }));
    }

    useTool(toolName) {
        const element = this._toolElementsLookup[toolName];
        const eventInit = {
            bubbles: true,
            cancelable: true,
            button: 0,
            buttons: 1,
            pointerId: 1,
            isPrimary: true,
            pointerType: 'mouse'
        };
        element.dispatchEvent(new PointerEvent('pointerdown', eventInit));
        element.dispatchEvent(new MouseEvent('mousedown', eventInit));
        element.dispatchEvent(new PointerEvent('pointerup', { ...eventInit, buttons: 0 }));
        element.dispatchEvent(new MouseEvent('mouseup', { ...eventInit, buttons: 0 }));
        element.dispatchEvent(new MouseEvent('click', { ...eventInit, buttons: 0 }));
    }

    getBrushDiameter(drawMode, brushNum){
        switch (drawMode){
            case "Dots":
                return this._brushElementsLookup[brushNum].brushDiameterforDots;
                break;
            case "Lines":
                return this._brushElementsLookup[brushNum].brushDiameterforLines;
                break;
        }
    }

    setBrushNum(brushNum) {
        const element = this._brushElementsLookup[brushNum].brushElement;
        const eventInit = {
            bubbles: true,
            cancelable: true,
            button: 0,
            buttons: 1,
            pointerId: 1,
            isPrimary: true,
            pointerType: 'mouse'
        };
        element.dispatchEvent(new PointerEvent('pointerdown', eventInit));
        element.dispatchEvent(new MouseEvent('mousedown', eventInit));
        element.dispatchEvent(new PointerEvent('pointerup', { ...eventInit, buttons: 0 }));
        element.dispatchEvent(new MouseEvent('mouseup', { ...eventInit, buttons: 0 }));
        element.dispatchEvent(new MouseEvent('click', { ...eventInit, buttons: 0 }));
    }

    clearCanvas() {
        this._clearCanvasButton.click();
    }
};
