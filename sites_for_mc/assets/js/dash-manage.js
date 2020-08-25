import * as utils from "./utils.js"

export function deleteSite() {
    console.log("ddw")
    var target = $(event.target)
    var delType = "site"
    var delName = "";
    console.log(target.parent().attr("class"))
    if (target.parent().attr("class") == "block-drawer-buttons"){delType = "block"; delName = target.parent().siblings().text()}
    else{ delName =target.attr('name')}
    var delInfo = JSON.stringify([delName,delType])
    console.log(delInfo)
    utils.popup(()=>{$.ajax({
        headers: {'X-CSRFToken':utils.csrf_token},    
        type: "POST",   
        url: "http://127.0.0.1:8000/dashboard/",
        data: {delInfo},
        success: () => {
            utils.popup(()=>{location.reload();},()=>{},false,"Item deleted Succesfully")     
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

