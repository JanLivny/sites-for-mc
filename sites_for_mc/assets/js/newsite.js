import * as utils from "./utils.js"
var inputValues = {}
var site_url = ""

export function collectElems(lisClass) {
    var innerlist=[]
    var lis = lisClass;
    for(let i = 0; i < lis.length; i++) {
        innerlist.push(utils.formatDB($(lis[i]).contents().get(0).nodeValue))
    }   
    return innerlist
}

export function new_site(inputValues) { 
    var csrf_token = document.getElementsByName('csrfmiddlewaretoken')[0].value  
    inputValues = JSON.stringify(inputValues)
    var name = $('.site-name-input').val()
    var innerlist=[name]
    innerlist = [].concat(innerlist, collectElems($(".editor-li")))
   $.ajax({
        headers: {'X-CSRFToken':csrf_token},
        type: "POST",
        url: "http://127.0.0.1:8000/creator/",
        data: {innerlist, inputValues},
        success: (data) =>  {
            data = data.split(" ")

            if (data[0]=="0"){
                utils.popup(()=>{},()=>{},false,"Site name already in use please try again.")
            }
            else if(data[0]=="1"){
                utils.popup(()=>{},()=>{},false,"You have not entered a site name, please enter one and try again.")
            }
            else if(data[0]=="2"){
                site_url = "http://127.0.0.1:8000/creator/"+data[1]
                utils.popup(()=>{utils.redirect()},()=>{},false,
                "Site created succesfully at:</br><a href='"+site_url+"' target ='_blank'class='popup-link' onclick='redirect()'>"+site_url+"</a>")
            }
            else{
                utils.popup(()=>{},()=>{},false,"There has been an error creating your site, please try again.")
                
            }
        },
        failure: () =>  console.log('ajax failure')
        })
};
