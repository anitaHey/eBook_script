var init_text;
var input_text;

$(document).ready(function(e) {
    $("#enter").click(async function() {
        await loadFileAsText("init_upload", "init");
        await loadFileAsText("input_upload", "input");
    });

});

async function loadFileAsText(file_id, type) {
    return new Promise((resolve, reject) => {
        var fileToLoad = $('#' + file_id).prop('files')[0];

        var fileReader = new FileReader();
        fileReader.onload = function(fileLoadedEvent) {
            var textFromFileLoaded = fileLoadedEvent.target.result;
            if (type == "init")
                init_text = textFromFileLoaded;
            else if (type == "input")
                input_text = textFromFileLoaded;

            resolve(fileReader.result);
        };
        fileReader.onerror = reject;

        fileReader.readAsText(fileToLoad, "UTF-8");
    });
}