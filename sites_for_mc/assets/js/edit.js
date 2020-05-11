export var inputValues={}

export function getFields() {
    var csrf_token = document.getElementsByName('csrfmiddlewaretoken')[0].value  
    $(".editor-div").show()
    $(".not-editing-message").hide()
    $(".edit-input").val('')

    let parentText = $(event.target).parent().contents().get(0).nodeValue.trim()
    $.ajax({
        headers: {'X-CSRFToken':csrf_token},
        type: "POST",
        url: "http://127.0.0.1:8000/creator/",
        data: {parentText},
        success: (data) => {
            var fields = JSON.parse(data)
            var lis = $(".field")
            $(".confirm-edit-link").text("Confirm")
            for(let i = 0; i < lis.length; i++){
                  $(lis[i]).text(fields["field_"+i])
                }
            $(".editor-element-info").text(" " + parentText +" ")
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