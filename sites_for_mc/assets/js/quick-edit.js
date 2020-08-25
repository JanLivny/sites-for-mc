import * as newsite from "./newsite.js"
import * as utils from "./utils.js"
import * as edit from "./edit.js"

export function queryElems() {
    var targetText = $(event.target).text()
    var target = $(event.target)
    if (targetText != "Empty drawer"){  
        $.ajax({
            headers: {'X-CSRFToken':utils.csrf_token},
            type: "POST",
            url: "http://127.0.0.1:8000/dashboard/",
            data: {targetText},
            success: (data) =>  {
                data = eval(data)
                var siteElems = data.pop().trim().split(" ")
                var editElems = $(target).siblings().find(".quick-edit-elem-li")
                var siteDataFields = $(target).siblings().find(".site-data-span")
                data[1]= data[1].split('/')[0]+"//[...]/"+data[1].split('/').pop()
                var privacyStatus = JSON.parse(data.pop().toLowerCase());
                var productionStatus = JSON.parse(data.pop().toLowerCase());
                target.siblings(".accordion-content").find(".privacy-switch").prop("checked",privacyStatus)
                target.siblings(".accordion-content").find(".production-switch").prop("checked",productionStatus)
                for(let i = 0; i <  5; i++) {
                    $(editElems[i]).text(siteElems[i])
                    $(siteDataFields[i]).text(data[i])                   
            }}
        })}
    else {
        $(event.target).siblings(".accordion-content").text("This is empty drawer, create more sites too fill it in.")
    }
}

export function updateElems() {
    var target = $(event.target)
    var updatedElems = newsite.collectElems($(event.target).parent().siblings(".dash-editor").children())
    var name = $(event.target).parents(".accordion-content").siblings(".accordion-title").text()
    updatedElems.push(name)
    $.ajax({
        headers: {'X-CSRFToken':utils.csrf_token},    
        type: "POST",
        url: "http://127.0.0.1:8000/dashboard/",
        data: {updatedElems},
        success: () => {
            $(target).text("CONFIRMED")  
        },
        failure: () =>  console.log('ajax failure')
        })
}

export function fullEditor() {
    var target = $(event.target)
    var name = target.attr('name')
    if(target.parent().attr("class") == "dash-edit-buttons"){
        utils.redirect("editor/"+name)
    }else{
        name = target.parent().siblings("span").text()
        console.log(name)
        utils.redirect("block-editor/"+name)
    }
 
}

