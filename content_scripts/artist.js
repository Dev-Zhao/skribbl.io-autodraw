let createArtist = function (toolbar) {
    let gameCanvas = document.getElementById('canvasGame');
    let gameBackgroundColor = new Color(255, 255, 255, 255) // white;
    let transparentColor = new Color(0, 0, 0, 0);

    let dispatchGameCanvasMouseEvent = function (name, x, y) {
        // Used to get position of the game canvas relative to the view port
        // See: https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
        let rect = gameCanvas.getBoundingClientRect();

        // gameCanvas.style.width and gameCanvas.style.height is the size of the canvas element shown on the page
        //  > This changes when the page resizes, so we have to account for this when creating a mouse event
        // gameCanvas.width and gameCanvas.height is the size of the coordinate system used by Canvas API
        //  > This is fixed (800x600)
        // See: https://stackoverflow.com/a/19079320
        //
        // Suppose game canvas was 800x600 and we wanted to create a mouse event at x = 200 and y = 200 
        // If the game canvas get resized to 400x300 (halved), then the mouse event has to be created at x = 100 and y = 100
        // IMPORTANT: When game canvas resizes, it maintains aspect ratio, so both width and height will resize by same ratio
        let ratio = rect.width / gameCanvas.width;

        // rect.x and rect.y - position of the top left corner of the canvas
        // x and y - position of where the mouse event will take place relative to the canvas
        // > we multiply this by the ratio to account for the actual size of the canvas shown on the page
        let mouseEvent = new MouseEvent(name,
            {
                bubbles: true,
                clientX: rect.x + x * ratio,
                clientY: rect.y + y * ratio,
                button: 0
            }
        );

        gameCanvas.dispatchEvent(mouseEvent);
    };

    let generateDots = function (img, brushDiameter) {
        // Scale the image to fit the game canvas
        let imageData = imageHelper.scaleImage(img, { width: gameCanvas.width, height: gameCanvas.height, scaleMode: 'scaleToFit' });

        // This offset is used to center the image on the canvas
        // 'Scaling an image to fit on canvas' - https://stackoverflow.com/a/23105310
        let xOffset = (gameCanvas.width - imageData.width) / 2;
        let yOffset = (gameCanvas.height - imageData.height) / 2;

        let dots = [];
        // Separate the image into areas, the size is a square with width/height equal to the brush diameter
        for (let y = 0; y < imageData.height; y += brushDiameter) {
            for (let x = 0; x < imageData.width; x += brushDiameter) {
                // Get the average color of that area
                let averageColor = imageHelper.getAverageColor(imageData, x, y, brushDiameter, brushDiameter);

                // Get the nearest color that's available in Skribbl.io
                let nearestColor = toolbar.getNearestAvailableColor(averageColor);

                // You can draw a dot by clicking on the game canvas, the dot's center will be placed on where you clicked
                // This will draw the dot exactly at the center of the area
                let dotX = (x + (x + brushDiameter - 1)) / 2;
                let dotY = (y + (y + brushDiameter - 1)) / 2;

                dots.push({
                    color: nearestColor,
                    brushDiameter: brushDiameter,
                    x: dotX + xOffset,
                    y: dotY + yOffset,
                });
            }
        }

        return dots;
    };

    let drawDots = function (img, brushNum) {
        let commands = [];

        let brushDiameter = toolbar.getBrushDiameter("Dots", brushNum);

        let dots = generateDots(img, brushDiameter);

        // Sort the array such that the dot with smaller x value is put before dot with larger x value
        // This makes it so that we draw dots from left to right
        dots.sort((dot1, dot2) => {
            return dot1.x - dot2.x;
        });

        dots.forEach((dot) => {
            if (dot.color.isEqual(transparentColor) || dot.color.isEqual(gameBackgroundColor)) {
                // Don't draw any dots that have the same color as game background color
                return;
            }

            commands.push(function () {
                toolbar.useTool('brush');
                toolbar.setBrushNum(brushNum);
                toolbar.setColor(dot.color);

                dispatchGameCanvasMouseEvent("mousedown", dot.x, dot.y);
                dispatchGameCanvasMouseEvent("mouseup", dot.x, dot.y);
            });
        });

        return commands;
    };


    let generateLines = function (img, brushDiameter) {
        // Scale the image to fit the game canvas
        let imageDrawWidth = gameCanvas.width / brushDiameter;
        let imageDrawHeight = gameCanvas.height / brushDiameter;
        let imageData = imageHelper.scaleImage(img, { width: imageDrawWidth, height: imageDrawHeight, scaleMode: 'scaleToFit' });

        // This offset is used to center the image on the canvas
        // 'Scaling an image to fit on canvas' - https://stackoverflow.com/a/23105310
        let xOffset = (gameCanvas.width - imageData.width * brushDiameter) / 2;
        let yOffset = (gameCanvas.height - imageData.height * brushDiameter) / 2;

        let horizontalLines = [];
        let startX;
        let currColor = {};
        let lineColor = {};

        // Horizontally
        for (let y = 0; y < imageData.height; y++) {
            startX = 0;
            lineColor = imageHelper.getPixelColor(imageData, 0, y);
            lineColor = toolbar.getNearestAvailableColor(lineColor);

            for (let x = 1; x < imageData.width; x++) {
                currColor = imageHelper.getPixelColor(imageData, x, y);
                currColor = toolbar.getNearestAvailableColor(currColor);

                if (!currColor.isEqual(lineColor)) {
                    if (!lineColor.isEqual(transparentColor) && !lineColor.isEqual(gameBackgroundColor)) {
                        let lineStartX = (startX * brushDiameter) + xOffset;
                        let lineEndX = ((x - 1) * brushDiameter) + xOffset;
    
                        horizontalLines.push({
                            start: {
                                x: lineStartX,
                                y: (y * brushDiameter) + yOffset,
                            },
                            end: {
                                x: lineEndX,
                                y: (y * brushDiameter) + yOffset,
                            },
                            length: lineEndX - lineStartX,
                            color: lineColor,
                            brushDiameter: brushDiameter
                        });
                    }

                    startX = x;
                    lineColor = currColor;
                }
            }
        }

        // Vertically
        let verticalLines = [];
        let startY;
        for (let x = 0; x < imageData.width; x++) {
            startY = 0;
            lineColor = imageHelper.getPixelColor(imageData, x, 0);
            lineColor = toolbar.getNearestAvailableColor(lineColor);

            for (let y = 1; y < imageData.height; y++) {
                currColor = imageHelper.getPixelColor(imageData, x, y);
                currColor = toolbar.getNearestAvailableColor(currColor);

                if (!currColor.isEqual(lineColor)) {
                    if (!lineColor.isEqual(transparentColor) && !lineColor.isEqual(gameBackgroundColor)) {
                        let lineStartY = (startY * brushDiameter) + yOffset;
                        let lineEndY = ((y - 1) * brushDiameter) + yOffset;
    
                        verticalLines.push({
                            start: {
                                x: (x * brushDiameter) + xOffset,
                                y: lineStartY,
                            },
                            end: {
                                x: (x * brushDiameter) + xOffset,
                                y: lineEndY,
                            },
                            length: lineEndY - lineStartY,
                            color: lineColor,
                            brushDiameter: brushDiameter
                        });
                    }

                    startY = y;
                    lineColor = currColor;
                }
            }
        }

        return ((horizontalLines.length < verticalLines.length) ? horizontalLines : verticalLines);
    };

    let drawLines = function (img, brushNum) {
        let commands = [];

        let brushDiameter = toolbar.getBrushDiameter("Lines", brushNum);

        let lines = generateLines(img, brushDiameter);

        lines.sort((line1, line2) => {
            return line2.length - line1.length;
        });

        // Get the position of the 
        lines.forEach((line) => {
            commands.push(function () {
                toolbar.useTool('brush');
                toolbar.setBrushNum(brushNum);
                toolbar.setColor(line.color);

                dispatchGameCanvasMouseEvent("mousedown", line.start.x, line.start.y);
                dispatchGameCanvasMouseEvent("mousemove", line.end.x, line.end.y);
                dispatchGameCanvasMouseEvent("mouseup", line.end.x, line.end.y);
            });
        });

        return commands;
    };

    return {
        draw: function (img, options) {
            let drawMode = options.drawMode || "Lines";
            let brushNum = options.brushNum || 0;

            let drawFunction = (drawMode == "Dots") ? drawDots : drawLines;

            let commands = [];
            commands.push(function () {
                toolbar.clearCanvas(); // Clear canvas before drawing anything
            })
            commands = commands.concat(drawFunction(img, brushNum));

            return commands;
        }
    };
};