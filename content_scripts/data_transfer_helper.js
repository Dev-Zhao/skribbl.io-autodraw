let dataTransferHelper = {
    // User may drag and drop an image from their computer
    getSrcFromImgFile: function (dataTransfer) {
        let imgSrc = null;

        // Check if there is a file
        if (dataTransfer.files.length) {
            // Check if file is an image
            if (dataTransfer.files[0].type.startsWith('image')) {
                // Create URL so it can be used with <img> elements
                // 'How to load image from user' - https://stackoverflow.com/a/51760964
                // 'Using URL.createObjectURL()' - https://chrisrng.svbtle.com/using-url-createobjecturl
                imgSrc = URL.createObjectURL(dataTransfer.files[0]);
            }
        }

        return imgSrc;
    },

    // User may drag and drop an image from the web
    getSrcFromImgElement: function (dataTransfer) {
        let imgSrc = null;

        let data = dataTransfer.getData('text/html');
        if (data) {
            // Although the data is in 'text/HTML' format, it's still just text 
            // This converts the text into DOM elements we can interact with
            // 'Converting HTML string into DOM elements' - https://stackoverflow.com/a/3104251
            let wrapper = document.createElement('div');
            wrapper.innerHTML = data;

            // We extract the element that was just converted from text and check if it's an <img> element
            let element = wrapper.firstChild;
            if (element && element.tagName == "IMG") {
                imgSrc = element.src;
            }
        }

        return imgSrc;
    },
};