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