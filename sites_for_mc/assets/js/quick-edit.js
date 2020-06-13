import * as newsite from "./newsite.js"
import * as utils from "./utils.js"
import * as edit from "./edit.js"

var csrf_token = document.getElementsByName('csrfmiddlewaretoken')[0].value  
var base_url = "http://127.0.0.1:8000"

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
                data = eval(data)
                var siteElems = data.pop().trim().split(" ")
                var editElems = $(target).siblings().find(".quick-edit-elem-li")
                var site_data_fields = $(target).siblings().find(".site-data-span")
                data[1]= data[1].split('/')[0]+"//[...]/"+data[1].split('/').pop()
                for(let i = 0; i <  5; i++) {
                    $(editElems[i]).text(siteElems[i])
                    $(site_data_fields[i]).text(data[i])                   
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
    var statusData = target.attr('name')
  
    
    utils.redirect("editor/"+statusData)
}

export function checkSiteAmount() {
    var numOfSites = 0
    var titles = $('.accordion-title')
    
    for(let i = 0; i < titles.length; i++){
        if ($(titles[i]).text() != "Empty drawer") { numOfSites++}
    }
     if (numOfSites == 5) {
        utils.popup(()=>{},()=>{},false,"You may not create additional sites</br> as you have reached the limit of 5.")
    }
    else{
        utils.redirect("creator")
    }   
}

export function showAdress() {
    var shortAdress = $(".adress-span span").text().split("/")
    var adress = base_url +"/creator/"+ shortAdress.pop()
    utils.popup(()=>{},()=>{},false,adress)
}