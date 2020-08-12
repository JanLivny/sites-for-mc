import * as utils from "./utils.js"

export function addLine() {
    var blockLayer= $(".block-layer").clone().first()
    blockLayer.find("input").val("")
    blockLayer.find("select").val("0")
    blockLayer.appendTo(".block")
}

export function removeLine() {
    console.log($(".block").children().length)
    if ($(".block").children().length > 1){
        $(event.target).parent().remove()
    }
}
   
export function newBlock() {
    var blockData = []
    var blockLines = $(".block").children()
    $.each(blockLines, (index,value) => {
        value = $(value)
        var lineData = {}
        lineData["txt_1"] = value.find("input").first().val()
        lineData["txt_2"] = value.find("input").last().val()
        lineData["Field_data"] = [value.find(".field-name-input").val(),value.find("select").val()]
        blockData.push(lineData)

    })
    blockData = JSON.stringify(blockData)
    $.ajax({
        headers: {'X-CSRFToken':utils.csrf_token},
        type: "POST",
        url: "http://127.0.0.1:8000/block-creator/",
        data: {blockData},
        success: (data) => {console.log("succes")},
        failure:(data) => {}
    })


}