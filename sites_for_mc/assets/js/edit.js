import * as utils from "./utils.js"
// import * as quickEdit from "./quick-edit.js" 
// import { collectElems } from "./newsite.js"
export var inputValues= JSON.parse($("#value-dict-span").text())

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
            
            var fields = data.split(" ")
            var field_slots = $(".field")
            var field_inputs =  $(".edit-input")

            for(let i = 0; i < field_slots.length; i++){
                  $(field_slots[i]).text(fields[i])
                  $(field_inputs[i]).val(inputValues[parentText][fields[i]])  
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
    $(".edit-input").map((pos,input) => {
       currentInputs[$(activeFields[pos]).text()] = $(input).val() 
    })
   inputValues[$(".editor-element-info").text().trim().replace(" ", "-").toLowerCase()] = currentInputs
   $(".confirm-edit-link").text("Confirmed")
   console.log(inputValues)
}