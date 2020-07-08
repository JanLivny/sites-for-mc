import * as utils from "./utils.js"

export function deleteSite() {
    var target = $(event.target)
    var delName = target.attr('name')
    utils.popup(()=>{$.ajax({
        headers: {'X-CSRFToken':utils.csrf_token},    
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

export function changeStatus() {
    var target = $(event.target)
    var switchType = utils.formatDB($(event.target).attr('class').split(" ")[2])
    console.log(switchType)
    var statusData  = JSON.stringify([target.attr('name'),JSON.stringify($(target).prop("checked")),switchType])
    $.ajax({
        headers: {'X-CSRFToken':utils.csrf_token},    
        type: "POST",   
        url: "http://127.0.0.1:8000/dashboard/",
        data: {statusData},
        success: () => {},
        failure: () =>  console.log('ajax failure')
    })

}

