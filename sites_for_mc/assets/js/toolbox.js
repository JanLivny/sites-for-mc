import * as utils from "./utils.js"
import { inputValues } from "./edit.js"

export function resetElems() {
    $(".editor-div").hide()
    $(".not-editing-message").show()
    var editorListItems = $(".editor-li")
    for(let i = 0; i< editorListItems.length;i++){
        $(editorListItems[i]).css("background-color","lightgray")
}}

export function fetchBlocks(target) {
    target = $(target)
    utils.colorInverter(target,".toolbox-header")
    var toolboxType = utils.formatDB(target.text())
    $('#sortable-tray').html("")

    $.ajax({
        headers: {'X-CSRFToken':utils.csrf_token},
        type: "POST",
        url: "http://127.0.0.1:8000/creator/",
        data: {toolboxType},
        success: (data) => { 
            console.log(data)   
            data = JSON.parse(data)
            $.each(data, ( index, value ) => {
                var toolboxLi = $(".toolbox-li")
                value = value[0].toUpperCase() + value.slice(1)
                $('#sortable-tray').append(
                    "<li class='toolbox-li editor-li'>"+value.replace("-", " ")+"<a class='element-edit-link'>edit</a></li>"
                )
              });
        },
        failure: ()=>{console.log('error')}
    })
}


var longTermNumDict = {}
export function sortLi(target) {
    console.log("sorting")

    resetElems()

    var sortUl =  $('#sortable-main')
    var c_length = sortUl.children().length
    $(target).clone().appendTo(".sortable-tray")

    if (sortUl.children().length > 5 ) {
        if ($(target).next().length != 0){
            console.log($(target).justText())
            console.log($(target).next().justText())
            if ($(target).next().justText() !=  $(target).justText()){
                $(target).next().remove()
            }
            else{
                $(target).remove()
            }
        }
        else{
            sortUl.children().first().remove()
        }
    }

    var elemNumDict= {}
    $.each(sortUl.children(), ( index, value ) => {
        var text = $(value).justText().split("|")[0]
        if (text in elemNumDict){
            if (!($(value).text().includes("|"))){
                elemNumDict[text] ++
                var txt = document.createTextNode("|"+elemNumDict[text])
                $(value).append(txt)
            }   
        }else{
            if ([text] in longTermNumDict) {
                elemNumDict[text] = longTermNumDict[text]
            }
            else {
                elemNumDict[text] = 1
            }
        }
    })
    longTermNumDict = elemNumDict
    console.log(elemNumDict)
    }

export function trayAdd(target) {
    resetElems()
    target.remove()
    longTermNumDict[target.justText()] = longTermNumDict[target.justText().split("|")[0]] - 1  
    delete inputValues[$(target).concatText()]
    var targetTxt = target.concatText().split("|")[0]
    var keys = Object.keys(inputValues)
    var children = $("#sortable-main .editor-li")
    $.each(keys, (index, value)=>{
        let  c_val = value
        value =  value.split("|")
        if (utils.formatDB(value[0]) == utils.formatDB(target.justText()) && c_val.includes("|") 
            && (parseInt(value[1])>parseInt(target.concatText().split("|")[1]) || target.concatText().split("|").length ==  1)){

            let num_mod =  parseInt(value[1])- 1
            let new_key =value[0]
            if (num_mod > 1){
                new_key = new_key +"|"+ num_mod
            }
            inputValues[new_key] = inputValues[c_val]
            delete inputValues[c_val]
        }
    })
    $.each(children, (index, value)=>{
        let r_val  = $(value)
        let  c_val = $(value).concatText()
        value =  $(value).concatText().split("|")
        if (utils.formatDB(value[0]) == utils.formatDB(target.justText()) && c_val.includes("|") 
            && (parseInt(value[1])>parseInt(target.concatText().split("|")[1]) || target.concatText().split("|").length ==  1)){
            let num_mod =  parseInt(value[1])- 1
            let newTxt ="|"+ num_mod  
            r_val.contents().filter(
                function() {
                    return this.nodeType == Node.TEXT_NODE; 
                })[1].remove()
            if (num_mod > 1){
                r_val.append(document.createTextNode(newTxt))
            }
        }
    })
}