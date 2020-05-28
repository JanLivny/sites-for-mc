import * as utils from "./utils.js"
// import * as quickEdit from "./quick-edit.js" 
// import { collectElems } from "./newsite.js"

//prep all values for editor
if(window.location.href.includes("editor") ){
    var edit = true
    var tempInputValues= JSON.parse($("#value-dict-span").text())
    $(".page-header").text("Editor")
    $(".site-create-button").text("Save changes")
    $(".site-name-input").attr('readonly', true);
}
else{
    var edit = false
    var tempInputValues= {}
} 

export var inputValues = tempInputValues

export var formData = new FormData();

$(".creator-input").change(()=>{
  $(event.target).siblings("label").text($(event.target).val().split("\\").pop())
})

export function getFields() {
    var csrf_token = document.getElementsByName('csrfmiddlewaretoken')[0].value  
    $(".editor-div").show()
    $(".not-editing-message").hide()
    $(".edit-input").val('')

    var parentText = utils.formatDB($(event.target).parent().contents().get(0).nodeValue)
    $.ajax({
        headers: {'X-CSRFToken':csrf_token},
        type: "POST",
        url: "http://127.0.0.1:8000/creator/",
        data: {parentText},
        success: (data) => {
            data = JSON.parse(data)
            var fields = Object.keys(data)
            var field_slots = $(".field")
            var field_inputs =  $(".edit-input")
            for(let i = 0; i < field_slots.length; i++){
                  $(field_slots[i]).text(fields[i])
                  utils.inputChanger( $(field_inputs[i]),data[fields[i]])
                  if (edit) {
                     $(field_inputs[i]).val(inputValues[parentText][fields[i]])  
                  }
                }

            $(".editor-element-info").text(" " + parentText +" ")
            $(".confirm-edit-link").text("Confirm")
        },
        failure: () =>  console.log('ajax failure')
        })
};

export function confirmEdits() {
    var csrf_token = document.getElementsByName('csrfmiddlewaretoken')[0].value  
    var currentInputs = {}
    var activeFields = $(".field")
    var sendFiles = false
    var activeElem = utils.formatDB($(".editor-element-info").text())
    $(".edit-input").map((pos,input) => {
       
        if($(input).attr("type")=="file" && $(input).val() != "") {
                console.log($(input).val())
                var files = $(input)[0].files[0]
                var name =  $(input).siblings("label").text().split("\\").pop().trim() 
                var image_tag =JSON.stringify([activeElem ,$(activeFields[pos]).text(),name])
                console.log(image_tag)
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