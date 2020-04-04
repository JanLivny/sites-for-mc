$(document).foundation()
$('.sortable').sortable();
$('.sortable').sortable().bind('sortupdate', function(e, ui) {

    var ul = $(".sortable");
    var li = ul.children("li");

    li.detach().sort();
    ul.append(li);
    

});

function new_site() {
    var csrf_token = document.getElementsByName('csrfmiddlewaretoken')[0].value
    lis = $("li");
    innerlist = []
    console.log(lis.length)
    for(let i = 0; i < lis.length; i++) {
        innerlist.push(lis[i].innerHTML)
    }
    console.log(innerlist)
    $.ajax({
        headers: {'X-CSRFToken':csrf_token},
        type: "POST",
        url: "http://127.0.0.1:8000/creator/",
        data: {innerlist},
        success: () =>  console.log('ajax succes'),
        failure: () =>  console.log('ajax failure')
        })

       
};