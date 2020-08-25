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
    $(".create-block-button").prop('disabled', true)
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

    blockData.push(utils.formatDB($(".block-name-input").val()))

    blockData = JSON.stringify(blockData)
    $.ajax({
        headers: {'X-CSRFToken':utils.csrf_token},
        type: "POST",
        url: "http://127.0.0.1:8000/block-creator/",
        data: {blockData},
        success: (data) => {
            console.log(data)
            data = data.split(" ")
            console.log(data)
            if(data[0] == "0"){ utils.popup(()=>{},()=>{},false,"You have not entered a block name, please enter one and try again.")}
            else if(data[0] == "1"){ utils.popup(()=>{},()=>{},false,"Block name already in use please try again.")}
            else if(data[0] == "2"){ utils.popup(()=>{},()=>{},false,"The name of the block contains the forbiden character(s): "+data[1] +"</br> please enter one and try again.")}
            else if(data[0] == "3"){ utils.popup(()=>{},()=>{},false,"You must name and define a type for all fields")}
            else{ utils.popup(()=>{utils.redirect("dashboard")},()=>{},false,"Block created succesfully.")}
            $(".create-block-button").prop('disabled', false)
        },
        failure:(data) => {}   
    })


}

//prep Editor