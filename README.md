# ![logo](/images/icon_96(original)/1.png) SkribblioBot
> Auto Draw Bot Chrome Extension for Skribblio

## Table of Contents
* [Introduction](#introduction)
* [Features](#features)
* [Installation Instructions](#install-instructions)
* [TODO](#todo)

<a name="introduction"></a>
## Introduction
[Skribblio](http://skribbl.io) is a popular multiplayer drawing and guessing game. Players take turns to draw and others will try to guess the word, the faster it is guessed the more points they earn!

I got really interested in making a auto draw bot after seeing this [video](https://www.youtube.com/watch?v=fGMWWyGzRbk). I keep seeing cool projects online and I always wondered how they were made. I was learning about chrome extensions and how they can manipulate a page's HTML/CSS. I was also learning about image processing using Javascript Canvas. I thought it would be the perfect time to put my skills to the test by putting these tools together!

<a name="features"></a>
## Features
* Drag and drop images from your computer or the web. They are automatically scaled to fit game canvas
* Convert image colors to the closest color available in game
* Select from different draw modes and brush sizes
* Simulating drawing using [MouseEvents](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent)
* Non-blocking function design, so the thousands of draw commands won't freeze the page

**Options Popup**
![Options Popup](/images/readme/options_popup.gif)
**Dots**
![Drawing Dots](/images/readme/draw_dots.gif)
**Lines**
![Drawing Lines](/images/readme/draw_lines.gif)

<a name="install-instructions"></a>
## Installation Instructions
1. Download a ZIP of this GitHub Repo
1. Extract the files to your desired location
1. Open the Extension Management page by navigating to **chrome://extensions**
1. Enable Developer Mode by clicking the toggle switch next to **Developer mode**. 
1. Click the **LOAD UNPACKED** button and select the extension directory

![Installation Guide](/images/readme/install_guide.png)

<a name="todo"></a>
## TODO
* Figuring out how to process images better and draw them faster!
    * Implement dithering
        * In Skribblio you can only use a limited number of colors. Usually an image will have many more colors than what is available. Therefore, any color in the image must be converted into a color that is available in game. I used a simple color distance formula to do this, but it can ruin the look of the image. The appearance of the image can be grealy improved with [dithering](https://www.cyotek.com/blog/an-introduction-to-dithering-images). This is something I hope to learn!
* Automatically present user with images related to the word they are drawing. The user can then choose an image to draw.
* Add more options (draw modes, invert colors, etc.)
