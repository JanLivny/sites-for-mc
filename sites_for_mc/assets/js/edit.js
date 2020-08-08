import * as utils from "./utils.js"

//setup
    var currentElem = ""
//prep all values for editor
if(window.location.href.includes("editor") ){
    var edit = true
    var tempInputValues= JSON.parse($("#value-dict-span").text())
    var permanentInputValues = JSON.parse($("#value-dict-span").text())
    $(".page-header").text("Editor")
    $(".site-create-button").text("Save changes")
    $(".site-name-input").attr('readonly', true);
}
else{
    var edit = false
    var tempInputValues= {}
} 

export var inputValues = tempInputValues

// update file upload labels
export var formData = new FormData();

$(".creator-input").change(()=>{
    if($(event.target).attr("type") =="file") {
        $(event.target).siblings("label").text($(event.target).val().split("\\").pop())
    }
})

export function selectEdit(target) {
    var targetId = $(target).attr('id')
    utils.colorInverter($(target),".selector-link")
    if (targetId.includes("fields")){
        $(".preview-div").text("")
        $(".preview-image-div").remove()
        $(".preview-div").hide()
        $(".editor-div").show()
    }else if(targetId.includes("preview")){
        $(".preview-div").show()
        $(".editor-div").hide()
        var previewName = currentElem.split("|")[0]
        $.ajax({
            headers: {'X-CSRFToken':utils.csrf_token},
            type: "POST",
            url: "http://127.0.0.1:8000/creator/",
            data: {previewName},
            success: (data) => {
                data = JSON.parse(data)
                $(".preview-div").text(data[0])
                var imageArr = data[1]
                $(".preview-div").append("<div class='preview-image-div'> </div>")
                $.each(imageArr, (index, value)=>{
                    $(".preview-image-div").append("<div class='image-preview-div'>" + value + "<div>")
                })
            
            },
            failure: () => {}
        })
}}

export function getFields() {  
    selectEdit($("#selector-fields"))
    $(".not-editing-message").hide()
    $(".editor-button-div").show()
    $(".edit-input").val('')
    var parentText = utils.formatDB($(event.target).parent().contents().get(0).nodeValue).split("|")[0]
    currentElem= utils.formatDB($(event.target).parent().contents().filter(function() {
        return this.nodeType == Node.TEXT_NODE; }).text().trim())
    console.log(currentElem)
    var editorListItems = $(".editor-li")
    for(let i = 0; i< editorListItems.length;i++){
        $(editorListItems[i]).css("background-color","lightgray")
    }

    $(event.target).parent().css("background-color","white")

    $.ajax({
        headers: {'X-CSRFToken':utils.csrf_token},
        type: "POST",
        url: "http://127.0.0.1:8000/creator/",
        data: {parentText},
        success: (data) => {
            data = JSON.parse(data)
            var fields = Object.keys(data)
            var fieldSlots = $(".field")
            var fieldInputs =  $(".edit-input")
            console.log(inputValues)
            for(let i = 0; i < fieldSlots.length; i++){
                  $(fieldSlots[i]).text(fields[i])
                  utils.inputChanger( $(fieldInputs[i]),data[fields[i]])
                  if (edit || currentElem in inputValues) {
                    console.log(currentElem)
                    var fieldValue = inputValues[currentElem][fields[i]]
                    if ($(fieldInputs[i]).attr("type")=="file" && fieldValue != "" && JSON.parse(fieldValue)[2] != ""){
                        $(fieldInputs[i]).siblings("label").text(JSON.parse(fieldValue)[2])
                    }
                    else if ($(fieldInputs[i]).attr("type")=="file") {
                        $(fieldInputs[i]).siblings("label").text("Select Image")
                    }
                    else {
                        $(fieldInputs[i]).val(fieldValue)
                    }
                  }
                }
            
            $(".editor-element-info").text(" " + parentText +" ")
            $(".confirm-edit-link").text("Confirm")
        },
        failure: () =>  console.log('ajax failure')
        })
};

export function confirmEdits() {
    var currentInputs = {}
    var activeFields = $(".field")
    var sendFiles = false
    var activeElem = currentElem
    console.log(currentElem)
    //var activeElem = utils.formatDB($(".editor-element-info").text())
    $(".edit-input").map((pos,input) => {
       
        if($(input).attr("type")=="file") {
                var files = $(input)[0].files[0]
                var name =  $(input).val().split("\\").pop().trim() 
                var image_tag =JSON.stringify([activeElem ,$(activeFields[pos]).text(),name])
                if($(input).val() == "" && window.location.href.includes("editor") ) {
                    var perm_val = permanentInputValues[activeElem][$(activeFields[pos]).text()]
                    if (perm_val !="" && JSON.parse(perm_val)[2] != $(input).siblings("label").text() ){
                        formData.append(image_tag,"") 
                    }
                    else {
                        image_tag = JSON.parse(image_tag)
                        image_tag[2] = $(input).siblings("label").text()
                        image_tag = JSON.stringify(image_tag)
                    }
                }
                formData.append(image_tag,files);   
                currentInputs[$(activeFields[pos]).text()] = image_tag
            }

        else{
            currentInputs[$(activeFields[pos]).text()] = $(input).val() 
        }
    })
    
   inputValues[currentElem] = currentInputs
   $(".confirm-edit-link").text("Confirmed")
   console.log(inputValues)
}


export function ClearInput() {
    var target = event.target
    $(target).siblings("input").val('')
    $(target).siblings("label").text("Select Image")
}