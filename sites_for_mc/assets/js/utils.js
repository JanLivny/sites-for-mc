export function sortLi() {
    
    var ul = $(".sortable");
    var li = ul.children("li");

    li.detach().sort();
    ul.append(li);
}
export function redirect(location) {
    var link = 'http://127.0.0.1:8000/'+location+'/'
    window.location.href = link
}

export  function formatDB(text) {
 text = text.trim().replace(" ", "-").toLowerCase()
 return text
}


export function popup(confirm,cancel,options,modalText) {
    $(".popup-content").html(modalText)
    
    $(".popup").show()
        $(".popup-confirm").click(() => {
            confirm()
            $(".popup").hide() 
        })
        if (options) {
            $(".popup-cancel").click(() => {
                cancel()
                $(".popup").hide() 
            })
            }
        else {
            $(".popup-cancel").hide();
            $(".popup-links").css("display","block") 
            $(".popup-links").css("text-align","center")
        }
            
    }

export function inputChanger(inputElem,type) {
    $(inputElem).attr("type",type)
    $(inputElem).show()
    $(inputElem).siblings("label").hide()
    if (type == "text") {
    }
    else if (type == "file"){
        $(inputElem).siblings("label").show()
        $(inputElem).hide()
    }

}