import * as utils from "./utils.js"

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
    var adress = utils.base_url +"/creator/"+ shortAdress.pop()
    utils.popup(()=>{},()=>{},false,adress)
}

if(window.location.href.includes("dashboard") ){
    var blockArr = $(".block_name_span").text().split(" ")
    blockArr.pop()
    $.each(blockArr, (index, value) => {
        var drawer = $(".block-drawers").find(".block-drawer").first().clone()
        drawer.find(".block-drawer-name").text(value)
        console.log(drawer)
        drawer.appendTo($(".block-drawers"))
    })
    $(".block-drawer").first().hide()
}