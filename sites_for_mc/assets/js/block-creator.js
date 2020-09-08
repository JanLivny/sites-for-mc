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
            else if(data[0] == "4"){ utils.popup(()=>{},()=>{},false,"You may not edit blocks that do not belong to you!")}
            else if(data[0] == "5"){ utils.popup(()=>{},()=>{},false,"You may not edit your block as it is currently in use")}
            else{ utils.popup(()=>{utils.redirect("dashboard")},()=>{},false,"Block created/Saved succesfully.")}
            $(".create-block-button").prop('disabled', false)
        },
        failure:(data) => {}   
    })


}



//prep Editor

if(window.location.href.includes("block-editor")){
    var block_data = JSON.parse($(".block-data-span").text())
    var template = JSON.parse(block_data[0])
    var fields = JSON.parse(block_data[1])
    $(".block-name-input").val(block_data[2])
    $(".block-name-input").prop("disabled",true)
    $(".create-block-button").text("Save Changes")
    $.each(Object.keys(fields), (index,value)=>{
        let lastLayer = $(".block-layer").last() 
        lastLayer.find(".field-name-input").val(value)
        lastLayer.find(".bl-input-type-selector").val(fields[value])
        lastLayer.find(".pre-input").val(template["pre_"+value])
        lastLayer.find(".post-input").val(template["post_"+value])
        if(index < Object.keys(fields).length -1){addLine()}
    })
}