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
    $(inputElem).siblings('a').hide()
    if (type == "text") {
    }
    else if (type == "file"){
        $(inputElem).siblings('a').show()
        $(inputElem).siblings("label").show()
        $(inputElem).siblings("label").text("Select Image")
        $(inputElem).hide()
    }

}

jQuery.fn.justText = function()  {
	return $(this).clone()
			.children()
			.remove()
			.end()
            .text()
            .trim();

};

export function colorInverter(targetElem, elemClass) {
    $(elemClass).css({
        'color' : 'black',
        'background' : 'white',    
    })

    targetElem.css({
        'color' : 'white',
        'background' : 'black',    
     })
}

//move to toolbox
var longTermNumDict = {}
console.log(longTermNumDict)
export function sortLi(target) {
   
    var sortUl =  $('#sortable-main')
    if (sortUl.children().length > 5 ) {

        if ($(target).next().length != 0){
            $(target).next().remove()
            $(target).clone().appendTo(".sortable-tray")
        }
        else{
            sortUl.children().first().remove()
        }

        var elemNumDict = {}
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
        console.log(longTermNumDict)
    }

}

export var base_url = "http://127.0.0.1:8000"
export var csrf_token = document.getElementsByName('csrfmiddlewaretoken')[0].value 