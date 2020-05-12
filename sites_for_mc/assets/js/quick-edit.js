import * as newsite from "./newsite.js"
import * as utils from "./utils.js"
import * as edit from "./edit.js"

var csrf_token = document.getElementsByName('csrfmiddlewaretoken')[0].value  

export function queryElems() {
    var targetText = $(event.target).text()
    var target = $(event.target)
    if (targetText != "Empty drawer"){  
        $.ajax({
            headers: {'X-CSRFToken':csrf_token},
            type: "POST",
            url: "http://127.0.0.1:8000/dashboard/",
            data: {targetText},
            success: (data) =>  {
                var siteElems = data.trim().split(" ")
                var editElems = $(target).siblings().find(".quick-edit-elem-li")
                for(let i = 0; i <  5; i++) {
                    $(editElems[i]).text(siteElems[i])
                }
            }
        })}
    else {
        $(event.target).siblings(".accordion-content").text("This is empty drawer, create more sites too fill it in.")
    }
    return target
}

export function updateElems() {
    var target = $(event.target)
    var updatedElems = newsite.collectElems($(event.target).parent().siblings(".dash-editor").children())
    var name = $(event.target).parents(".accordion-content").siblings(".accordion-title").text()
    updatedElems.push(name)
    $.ajax({
        headers: {'X-CSRFToken':csrf_token},    
        type: "POST",
        url: "http://127.0.0.1:8000/dashboard/",
        data: {updatedElems},
        success: () => {
            $(target).text("CONFIRMED")  
        },
        failure: () =>  console.log('ajax failure')
        })
}

export function deleteSite() {
    var target = $(event.target)
    var delName = target.attr('name')
    utils.popup(()=>{$.ajax({
        headers: {'X-CSRFToken':csrf_token},    
        type: "POST",
        url: "http://127.0.0.1:8000/dashboard/",
        data: {delName},
        success: () => {
            utils.popup(()=>{location.reload();},()=>{},false,"Site deleted Succesfully")     
        },
        failure: () =>  console.log('ajax failure')
        })

    },()=>{},true,"Are you sure you want to delete</br>"+delName + " ?")
    

}

export function fullEditor() {
    var target = $(event.target)
    var statusData = [target.attr('name')]
    $.ajax({
        headers: {'X-CSRFToken':csrf_token},    
        type: "POST",
        url: "http://127.0.0.1:8000/creator/",
        data: {statusData},
        success: (data) => {
           edit.changeInputValues(JSON.parse(data.replace(/'/g,"\"")))
           console.log(edit.inputValues)
        },
        failure: () =>  console.log('ajax failure')
        })
    
    utils.redirect("creator")
}