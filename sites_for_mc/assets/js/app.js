$(document).foundation()
$('.sortable').sortable()
var csrf_token = document.getElementsByName('csrfmiddlewaretoken')[0].value
inputValues = {}

$('.sortable').sortable().bind('sortupdate', function(e, ui) {
    
    var ul = $(".sortable");
    var li = ul.children("li");

    li.detach().sort();
    ul.append(li);
});

$( ".element-edit-link" ).on( "click",function() {
    let parentText = $(this).parent().contents().get(0).nodeValue.trim()
    $.ajax({
        headers: {'X-CSRFToken':csrf_token},
        type: "POST",
        url: "http://127.0.0.1:8000/creator/",
        data: {parentText},
        success: (data) => {
            var fields = JSON.parse(data)
            lis = $(".field")
            for(let i = 0; i < lis.length; i++){
                  $(lis[i]).text(fields["field_"+i])
                }
            $(".editor-element-info").text(" " + parentText +" ")
        },
        failure: () =>  console.log('ajax failure')
        })
});

$( ".confirm-edit-link" ).on( "click",function() {
    currentInputs = {}
    activeFields = $(".field")
    $(".edit-input").map((pos,input) => {
       currentInputs[$(activeFields[pos]).text()] = $(input).val() 
    })
   inputValues[$(".editor-element-info").text().trim().replace(" ", "-").toLowerCase()] = currentInputs
   console.log(inputValues)
})

function new_site() {
    inputValues = JSON.stringify(inputValues)
    lis = $("li");
    name = $('.site-name-input').val()
    innerlist = [name]
    for(let i = 0; i < lis.length; i++) {
        innerlist.push($(lis[i]).contents().get(0).nodeValue.trim())
    }
    $.ajax({
        headers: {'X-CSRFToken':csrf_token},
        type: "POST",
        url: "http://127.0.0.1:8000/creator/",
        data: {innerlist, inputValues},
        success: () =>  console.log('ajax succes'),
        failure: () =>  console.log('ajax failure')
        })
    
       
};
