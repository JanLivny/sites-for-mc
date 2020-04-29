// set up
$(document).foundation()
$(".popup").hide()
$('.sortable').sortable()
$(".editor-div").hide()


function redirect() {
    location.href = 'http://127.0.0.1:8000/dashboard/'
}

var csrf_token = document.getElementsByName('csrfmiddlewaretoken')[0].value
inputValues = {}

// sortable
$('.sortable').sortable().bind('sortupdate', function(e, ui) {
    
    var ul = $(".sortable");
    var li = ul.children("li");

    li.detach().sort();
    ul.append(li);
});

//popUp
function popup(confirm,modalText) {
    $(".popup-content").html(modalText)
    $(".popup").show()
        $(".popup-confirm").click(() => {
            confirm()
            $(".popup").hide() 
        })
    }

//edit
$( ".element-edit-link" ).on( "click",function() {

    $(".editor-div").show()
    $(".not-editing-message").hide()
    // $(".edit-input").val('')

    let parentText = $(this).parent().contents().get(0).nodeValue.trim()
    $.ajax({
        headers: {'X-CSRFToken':csrf_token},
        type: "POST",
        url: "http://127.0.0.1:8000/creator/",
        data: {parentText},
        success: (data) => {
            var fields = JSON.parse(data)
            lis = $(".field")
            $(".confirm-edit-link").text("Confirm")
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
   $(".confirm-edit-link").text("Confirmed")
   console.log(inputValues)
})

//reset confiramntion indicator
$(".edit-input").on( "click",function() { $(".confirm-edit-link").text("Confirm")})

//new site 

function new_site() {    
    lis = $("li");
    inputValues = JSON.stringify(inputValues)
    name = $('.site-name-input').val()
    innerlist=[name]

    for(let i = 0; i < lis.length; i++) {
        innerlist.push($(lis[i]).contents().get(0).nodeValue.trim())
    }   
    $.ajax({
        headers: {'X-CSRFToken':csrf_token},
        type: "POST",
        url: "http://127.0.0.1:8000/creator/",
        data: {innerlist, inputValues},
        success: (data) =>  {
            console.log(data)
            data = data.split(" ")

            if (data[0]=="0"){
                popup(()=>{},"Site name already in use please try again.")
            }
            else if(data[0]=="1"){
                popup(()=>{},"You have not entered a site name, please enter one and try again.")
            }
            else if(data[0]=="2"){
                site_url = "http://127.0.0.1:8000/creator/"+data[1]
                popup(()=>{redirect()},
                "Site created succesfully at:</br><a href='"+site_url+"' target ='_blank'class='popup-link' onclick='redirect()'>"+site_url+"</a>")
            }
            else{
                popup(()=>{},"There has been an error creating your site, please try again.")
                
            }
        },
        failure: () =>  console.log('ajax failure')
        })
};
