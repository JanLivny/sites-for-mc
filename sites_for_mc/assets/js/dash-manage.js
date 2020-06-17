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
    var privacyData  = JSON.stringify([target.attr('name'),JSON.stringify($(target).prop("checked"))])
    console.log(privacyData)
    $.ajax({
        headers: {'X-CSRFToken':utils.csrf_token},    
        type: "POST",   
        url: "http://127.0.0.1:8000/dashboard/",
        data: {privacyData},
        success: () => {},
        failure: () =>  console.log('ajax failure')
    })

}

