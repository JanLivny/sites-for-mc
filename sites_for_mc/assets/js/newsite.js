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

export function new_site(inputValues, files) { 
    inputValues = JSON.stringify(inputValues)
    var name = $('.site-name-input').val()
    var innerlist=[name]
    innerlist = [].concat(innerlist, collectElems($("#sortable-main .editor-li")))
   $.ajax({
        headers: {'X-CSRFToken':utils.csrf_token},
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
            else if (data[0]=="4"){
                console.log(data[1])
                utils.popup(()=>{},()=>{},false,"Your name contains the forbiden character(s): "+data[1] +"</br> please enter one and try again.")
            }
            else if (data[0]=="2" || data[0] == "3") {
                var notif_data = data
                site_url = "http://127.0.0.1:8000/creator/"+data[1]
                var sendFormData = new FormData()
                for (let entry of files.entries()) {
                    console.log(entry)
                    var file = entry[1]
                    var tag =$.parseJSON(entry[0])
                    tag.unshift(utils.formatDB(name))
                    tag = JSON.stringify(tag)
                    sendFormData.append(tag,file)
                }

                console.log(sendFormData)

                $.ajax({    
                    headers: {'X-CSRFToken':utils.csrf_token},
                    type: "POST",
                    url: "http://127.0.0.1:8000/creator/",
                    data: sendFormData,
                    contentType:false,
                    processData: false,
                    success: (data) =>  {
                        if(notif_data[0]=="2"){
                            utils.popup(()=>{utils.redirect("dashboard")},()=>{},false,
                            "Site created succesfully at:</br><a href='"+site_url+"' target ='_blank'class='popup-link'>"+site_url+"</a>")
                        }
                        else if(notif_data[0]=="3"){
                            utils.popup(()=>{utils.redirect("dashboard")},()=>{},false,"Changes to " + data[1] + " have been succesfully saved")
                        }
                    },
                    failure: ()=>utils.popup(()=>{},()=>{},false,"There has been an error creating your site, please try again.")
                })
            }

            else{
                utils.popup(()=>{},()=>{},false,"There has been an error creating your site, please try again.")
                
            }
        },
        failure: () =>  console.log('ajax failure')
        })
};
