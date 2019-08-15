let createColorPalette = function (paletteColors, nearestColorLookup) {
    // The Euclidean distance formula is sqrt(rDiff^2 + gDiff^2 + bDiff^2). However, it does not account for the way humans perceive colour, this formula should do a better job at it
    // 'Colour Metric' - https://www.compuphase.com/cmetric.htm
    let getColorDistance = function (color1, color2) {
        let rMean = (color1.r + color2.r) / 2;
        let rDiff = color1.r - color2.r;
        let gDiff = color1.g - color2.g;
        let bDiff = color1.b - color2.b;

        // The actual distance formula is sqrt( (2+rMean/256)*rDiff^2 + 4*gDiff^2 + (2+(255-rMean)/256)*bDiff^2 )
        // This simplifies to ( ((512+rMean)/256)*rDiff^2 + 4*gDiff^2 + ((767-rMean)/256)*bDiff^2  )
        // Since we are only computing distance to compare them, we don't need the square root. It is removed to make comparisons faster!
        // 'Algorithms/Distance approximations' - https://en.wikibooks.org/wiki/Algorithms/Distance_approximations
        return ((512 + rMean) / 256) * Math.pow(rDiff, 2) + 4 * Math.pow(gDiff, 2) + ((767 - rMean) / 256) * Math.pow(bDiff, 2);
    };

    return {
        getNearestColor: function (color) {
            let shortestDistance;
            let nearestColor;
    
            let key = JSON.stringify(color);
            
            // look for the nearest color in the lookup. This is what the lookup looks like: 
            // { (color in JSON string format) : (nearest color that's in the palette) } ---> { "{"r":0-255,"g":0-255,"b":0-255}" : {r: 0-255, g: 0-255, b: 0-255} }
            if (key in nearestColorLookup) {
                nearestColor = nearestColorLookup[key];
            }
            else { // nearest color could not found in lookup
                for (let i = 0; i < paletteColors.length; i++) {
                    let distance = getColorDistance(color, paletteColors[i]);

                    // The distance is the shortest distance if:
                    // it's the first distance (between color from the parameter and the first color in the palette) OR
                    // the distance is shorter than the current shortest distance
                    if (i == 0 || distance < shortestDistance) {
                        shortestDistance = distance;
                        nearestColor = paletteColors[i];
                    }
                }

                // Store the nearest color in the lookup
                nearestColorLookup[key] = nearestColor;
            }
    
            return nearestColor;
        }
    };
};