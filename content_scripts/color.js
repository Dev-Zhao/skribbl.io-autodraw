class Color {
    constructor(r, g, b, a = 255) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    get JSONString() {
        return JSON.stringify(this);
    }

    /*
        'Get Color Component from RGB String' - https://stackoverflow.com/questions/10970958/get-a-color-component-from-an-rgb-string-in-javascript
        Example rgbString: 'rgb(255, 0, 6)' - This can be obtained from element.style.backgroundColor
            rgbString.substring(4, rgb.length - 1): '255, 0, 6'
            .replace(/ /g, ''): '255,0,6'
            .split(','): ['255', '0', '6']
    */
    static getColorFromRGBString(rgbString) {
        let rgb = rgbString.substring(4, rgbString.length - 1).replace(/ /g, '').split(',');
        return new Color(parseInt(rgb[0]), parseInt(rgb[1]), parseInt(rgb[2]));
    }

    // The Euclidean distance formula is sqrt(rDiff^2 + gDiff^2 + bDiff^2). However, it does not account for the way humans perceive colour, this formula should do a better job at it
    // 'Colour Metric' - https://www.compuphase.com/cmetric.htm
    static distance(color1, color2) {
        let rMean = (color1.r + color2.r) / 2;
        let rDiff = color1.r - color2.r;
        let gDiff = color1.g - color2.g;
        let bDiff = color1.b - color2.b;

        // The actual distance formula is sqrt( (2 + rMean/256)*rDiff^2 + 4*gDiff^2 + (2 + (255-rMean)/256)*bDiff^2 )
        // This simplifies to sqrt( ((512+rMean)/256)*rDiff^2 + 4*gDiff^2 + ((767-rMean)/256)*bDiff^2  )
        // 'Algorithms/Distance approximations' - https://en.wikibooks.org/wiki/Algorithms/Distance_approximations
        return Math.sqrt(((512 + rMean) / 256) * Math.pow(rDiff, 2) + 4 * Math.pow(gDiff, 2) + ((767 - rMean) / 256) * Math.pow(bDiff, 2));
    }
}