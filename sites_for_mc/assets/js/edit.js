import * as utils from "./utils.js"

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

export function getFields() {  
    $(".editor-div").show()
    $(".not-editing-message").hide()
    $(".edit-input").val('')
    var parentText = utils.formatDB($(event.target).parent().contents().get(0).nodeValue)

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
            for(let i = 0; i < fieldSlots.length; i++){
                  $(fieldSlots[i]).text(fields[i])
                  utils.inputChanger( $(fieldInputs[i]),data[fields[i]])
                  if (edit || parentText in inputValues) {
                    var fieldValue = inputValues[parentText][fields[i]]
                    if ($(fieldInputs[i]).attr("type")=="file" && JSON.parse(fieldValue)[2] != ""){
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
    var activeElem = utils.formatDB($(".editor-element-info").text())
    $(".edit-input").map((pos,input) => {
       
        if($(input).attr("type")=="file") {
                var files = $(input)[0].files[0]
                var name =  $(input).val().split("\\").pop().trim() 
                var image_tag =JSON.stringify([activeElem ,$(activeFields[pos]).text(),name])
                if($(input).val() == "" && window.location.href.includes("editor") ) {
                    if (JSON.parse(permanentInputValues[activeElem][$(activeFields[pos]).text()])[2] 
                    != $(input).siblings("label").text()){
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
    

   inputValues[$(".editor-element-info").text().trim().replace(" ", "-").toLowerCase()] = currentInputs
   $(".confirm-edit-link").text("Confirmed")
   console.log(inputValues)
}

export function ClearInput() {
    var target = event.target
    $(target).siblings("input").val('')
    $(target).siblings("label").text("Select Image")
}