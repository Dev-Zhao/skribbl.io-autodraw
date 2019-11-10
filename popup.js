var drawModeDotsRadio = document.getElementById("drawModeDotsRadio");
var drawModeLinesRadio = document.getElementById("drawModeLinesRadio");
var brushNumRangeInput = document.getElementById("brushNumRangeInput");
var brushNumIndicator = document.getElementById('brushNumIndicator');
var saveButton = document.getElementById("saveButton");

function updateDrawModeRadioButtons(drawMode){
    switch (drawMode){
        case "Dots":
            drawModeDotsRadio.checked = true;
            break;
        case "Lines":
            drawModeLinesRadio.checked = true;
            break;
    }
}

function updatebrushNum(brushNum){
    brushNumRangeInput.value = brushNum;

    switch(brushNum){
        case 0:
            brushNumIndicator.innerHTML = "Small";
            break;
        case 1:
            brushNumIndicator.innerHTML = "Medium";
            break;
        case 2:
            brushNumIndicator.innerHTML = "Large";
            break;
        case 3:
            brushNumIndicator.innerHTML = "Extra Large";
            break;
    }
}

Promise.all([storage.getData("drawMode"), storage.getData("brushNum")]).then((data) => {
    let drawMode = data[0];
    let brushNum = data[1];

    updateDrawModeRadioButtons(drawMode);

    updatebrushNum(brushNum);
}).catch((errors) => {
    console.log(errors);
});


brushNumRangeInput.oninput = function(){
    updatebrushNum(parseInt(brushNumRangeInput.value));
};

saveButton.onclick = function(){
    var drawMode = document.querySelector('input[name="drawModeRadios"]:checked').value;
    var brushNum = parseInt(brushNumRangeInput.value);

    storage.setData({drawMode: drawMode, brushNum: brushNum}).catch((err) => {
        console.log(err);
    });
};
