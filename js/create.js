var init_text;
var input_text;
var html_text;
var js_text;
var timeLine_text = new Array();
var timeLine_bg = new Array();
var object = new Array();
var init_put = new Array();
var context = new Array();
var draw_page = new Array();

$(document).ready(function(e) {
    $("#enter").click(async function() {
        await loadFileAsText("init_upload", "init");
        // await loadFileAsText("input_upload", "input");

        init();
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

function init() {
    var word = init_text.split("\n");
    page_arr = [0, (Number(word[0]))];
    var page_loop = word[1].split(",");
    var check = 0;

    for (var num = 0; num < page_arr[1]; num++) {
        timeLine_text.push(new Array());
        timeLine_bg.push(new Array());
        object.push(new Array());
        init_put.push(new Array());
        context[num] = {};

        // if (Number(page_loop[check]) == num) {
        //     check++;

        //     timeLine_bg[num].eventCallback("onComplete", function() {
        //         this.restart();
        //     });

        // }
    }

    var isSetObj = true;
    for (var num = 2; num < word.length; num++) {
        var input = word[num].split(",");
        switch (input[1]) {
            case "text":
                textCreate(input);
                break;
            case "pic":
                picCreate(input);
                break;
            case "audio":
                audioCreate(input);
                break;
            case "button":
                buttonCreate(input);
                break;
            case "label":
                labelCreate(input);
                break;
            case "draw":
                drawCreate(input);
                break;
            case "input":
                inputCreate(input);
                break;
        }
    }

    var canvas_word = '<html lang="zh-Hant-TW "><head>';
    canvas_word += '<meta charset="utf-8">';
    canvas_word += '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=2.0, minimum-scale=0.5, shrink-to-fit=no" />';
    canvas_word += '<link rel="stylesheet" href="css/reset.css">';
    canvas_word += '<link rel="stylesheet" href="tool/bootstrap-4.0.0/dist/css/bootstrap.min.css">';
    canvas_word += '<link rel="stylesheet" href="tool/fontawesome-free-5.6.3-web/css/all.min.css">';
    canvas_word += '<link rel="stylesheet" href="tool/bootstrap-select-1.13.14/dist/css/bootstrap-select.min.css">';
    canvas_word += '<link rel="stylesheet" href="css/style.css">';
    canvas_word += '<title>EBook</title>';
    canvas_word += '</head><body>';
    canvas_word += '<div class="head"></div>';
    canvas_word += '<div class="first">';
    canvas_word += '<div class="d-flex justify-content-center">';
    canvas_word += '<div class="book_view">';

    canvas_word += '<div class="page loading_page"><svg viewBox="0 0 16 16" width="30px" height="16px"  version="1.1" xmlns="http://www.w3.org/2000/svg"> <circle id="load_cir1" cx="8" cy=8 r="8" fill="#525252" /> <circle id="load_cir2" cx="14" cy=8 r="8" fill="#05445c" /> </svg> <div class="load_text font-weight-bold">讀取中</div> </div>';
    for (var num = 0; num < word[0]; num++) {
        canvas_word += "<div id='page" + num + "' class='page hide'>";
        for (var len = 0; len < object[num].length; len++) {
            if (object[num][len].type == "audio") {
                canvas_word += "<audio class='" + object[num][len].name + "' src='" + object[num][len].src + "'/>";
            } else if (object[num][len].type == "button") {
                if (object[num][len].src.length > 0) {
                    canvas_word += "<button class='btn " + object[num][len].name + "'><img class='img' src='" + object[num][len].src + "' /></button>";
                } else {
                    canvas_word += "<button class='btn " + object[num][len].name + "'>" + object[num][len].word + "</button>";
                }
            } else if (object[num][len].type == "label") {
                canvas_word += "<label class='label " + object[num][len].name + " " + object[num][len].show + "'>" + object[num][len].word + "</label>";
            } else if (object[num][len].type == "draw") {
                canvas_word += '<div class="save_pic">';
                canvas_word += '<textarea class="draw_text"></textarea>';
                canvas_word += '<div class="page draw ' + object[num][len].name + '"></div></div>';
                draw_page.push(num);
            } else if (object[num][len].type == "input") {
                canvas_word += "<input type='text' class='book_input " + object[num][len].name + "' style='top: " + object[num][len].top + "px; left: " + object[num][len].left + "px' />";
            } else {
                if (object[num][len].show_word == "hide") {
                    canvas_word += "<canvas class='" + object[num][len].name + " hide'> </canvas>";
                } else {
                    canvas_word += "<canvas class='" + object[num][len].name + "'> </canvas>";
                }
            }
        }
        canvas_word += "</div>";
    }

    canvas_word += "<div id='page" + page_arr[1] + "' class='page last_page hide'>";
    canvas_word += "</div>";

    canvas_word += '</div>';
    canvas_word += '<div class="mt-3 draw_group_btn text-center hide_none" role="group">'
    canvas_word += '<button type="button" class="btn draw_btn" id="pen"><img src="pic/pencil.png" alt="" class="draw_pic_btn" /></button>';
    canvas_word += '<button type="button" class="btn draw_btn draw_color_btn" id="color_black"></button><br>';
    canvas_word += '<button type="button" class="btn draw_btn draw_color_btn" id="color_red"></button><br>';
    canvas_word += '<button type="button" class="btn draw_btn draw_color_btn" id="color_green"></button><br>';
    canvas_word += '<button type="button" class="btn draw_btn draw_color_btn" id="color_blue"></button><br>';
    canvas_word += '<button type="button" class="btn draw_btn draw_color_btn" id="color_purple"></button>';
    canvas_word += '<button type="button" class="btn draw_btn" id="text"><img src="pic/text.png" alt="" class="draw_pic_btn" /></button>';
    canvas_word += '<button type="button" class="btn draw_btn" id="eraser"><img src="pic/eraser.png" alt="" class="draw_pic_btn" /></button>';
    canvas_word += '<button type="button" class="btn draw_btn" id="clean"><img src="pic/trash.png" alt="" class="draw_pic_btn" /></button>';
    canvas_word += '</div></div>';

    canvas_word += '<div class="tool d-flex justify-content-center mt-3">';
    canvas_word += '<button class="tool_btn login" data-toggle="modal" data-target="#loginModal"><img src="pic/login.png" alt="" class="icon_pic"></button>';
    canvas_word += '<button class="tool_btn prev " id="prev"><i class="fas fa-caret-left icon_fa"></i></button>';
    canvas_word += '<label for="page" class="ml-2 mr-2 page_word mt-4">第</label>';
    canvas_word += '<select name="page" class="mt-4 selectpicker page_picker dropup" data-dropup-auto="false" data-width="80px"></select>';
    canvas_word += '<label for="page" class="ml-2 mr-2 page_word mt-4">頁</label>';
    canvas_word += '<button class="tool_btn next" id="next"><i class="fas fa-caret-right icon_fa"></i></button>';
    canvas_word += '<button class="tool_btn setting" data-toggle="modal" data-target="#settingModal"><img src="pic/settings.png" alt="" class="icon_pic"></button></div></div><div class="foot"></div>';

    canvas_word += '<div class="modal fade" id="orientationModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">';
    canvas_word += '    <div class="modal-dialog modal-dialog-centered" role="document">';
    canvas_word += '        <div class="modal-content">';
    canvas_word += '            <div class="modal-header">';
    canvas_word += '                <h5 class="modal-title" id="exampleModalLabel">建議顯示螢幕為橫式</h5>';
    canvas_word += '            </div>';
    canvas_word += '            <div class="modal-body">';
    canvas_word += '                為了讓您有更好的觀賞體驗，請將螢幕旋轉為橫式';
    canvas_word += '            </div>';
    canvas_word += '        </div>';
    canvas_word += '    </div>';
    canvas_word += '</div>';
    canvas_word += '<div class="modal fade" id="phoneModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">';
    canvas_word += '    <div class="modal-dialog modal-dialog-centered" role="document">';
    canvas_word += '        <div class="modal-content">';
    canvas_word += '            <div class="modal-header">';
    canvas_word += '                <h5 class="modal-title" id="exampleModalLabel">此網頁不支援手機</h5>';
    canvas_word += '            </div>';
    canvas_word += '            <div class="modal-body">';
    canvas_word += '                為了讓您有更好的觀賞體驗，請使用電腦或平板開啟';
    canvas_word += '            </div>';
    canvas_word += '        </div>';
    canvas_word += '    </div>';
    canvas_word += '</div>';

    canvas_word += '<script src="tool/jquery-3.3.1.min.js"></script>';
    canvas_word += '<script src="tool/popper.min.js"></script>';
    canvas_word += '<script src="tool/bootstrap-4.0.0/dist/js/bootstrap.min.js"></script>';
    canvas_word += '<script src="tool/bootstrap-4.0.0/dist/js/bootstrap.bundle.min.js"></script>';
    canvas_word += '<script src="tool/greensock-js/src/minified/TweenMax.min.js"></script>';
    canvas_word += '<script src="tool/konva.min.js"></script>';
    canvas_word += '<script src="tool/bootstrap-select-1.13.14/dist/js/bootstrap-select.min.js"></script>';
    canvas_word += '<script src="tool/html2canvas.min.js"></script>';
    canvas_word += '<script src="tool/canvas2image.js"></script>';
    canvas_word += '<script src="js/saveData.js"></script>';
    canvas_word += '<script src="js/log.js"></script>';
    canvas_word += '<script src="js/pic_animation.js"></script>';
    canvas_word += '<script src="js/setting.js"></script></body></html>';

    var fs = require('fs');


    fs.writeFile('test.html', canvas_word, (error) => { /* handle error */ });
}

// function download(data, filename, type) {
//     var file = new Blob([data], { type: type });
//     if (window.navigator.msSaveOrOpenBlob) // IE10+
//         window.navigator.msSaveOrOpenBlob(file, filename);
//     else { // Others
//         var a = document.createElement("a"),
//             url = URL.createObjectURL(file);
//         a.href = url;
//         a.download = filename;
//         document.body.appendChild(a);
//         a.click();
//         setTimeout(function() {
//             document.body.removeChild(a);
//             window.URL.revokeObjectURL(url);
//         }, 0);
//     }
// }

function textCreate(input) {
    var page = input[0] - 1;
    var text = { page: page, type: "text", name: input[2], x: input[3], y: input[4], rotate: input[5], fontweight: input[6], size: input[7], color: input[8], word: input[10], function: new Array(), length: 0, fun_arr: 0, globalAlpha: 0 };

    if (input[9] == "show") {
        text.globalAlpha = 1;
        init_put[page].push(text);
    }

    object[page].push(text);
}

function picCreate(input) {
    var page = input[0] - 1;
    var height = 0;
    var width = 0;
    var src = new Array();
    src.push(input[6]);

    var pic = { page: page, type: "pic", name: input[2], x: input[3], y: input[4], rotate: 0, src: src, function: new Array(), fun_arr: 0, show_word: input[5] };

    object[page].push(pic);
    init_put[page].push(pic);
}

function audioCreate(input) {
    var page = input[0] - 1;
    var audio = { page: page, type: "audio", name: input[2], src: input[3], function: new Array(), length: 0, fun_arr: 0 };
    object[page].push(audio);
}

function buttonCreate(input) {
    var page = input[0] - 1;
    var button = { page: page, type: "button", name: input[2], src: input[3], word: input[4] };
    object[page].push(button);
}

function labelCreate(input) {
    var page = input[0] - 1;
    var label = { page: page, type: "label", name: input[2], show: input[3], word: input[4] };
    object[page].push(label);
}

function drawCreate(input) {
    var page = input[0] - 1;
    var draw = { page: page, type: "draw", name: input[2].trim() };
    object[page].push(draw);
}

function inputCreate(input) {
    var page = input[0] - 1;
    var input = { page: page, type: "input", name: input[2].trim(), top: input[3].trim(), left: input[4].trim() };
    object[page].push(input);
}