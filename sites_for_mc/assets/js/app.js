//imports
import * as newsite from "./newsite.js"
import * as utils from "./utils.js"
import * as edit from "./edit.js"
import * as quickEdit from "./quick-edit.js"
import * as dashManage from "./dash-manage.js"
import * as dashboard from "./dashboard.js"


//CREATOR

//setup
$(document).foundation()
$('.sortable').sortable()
$(".editor-div").hide()

// sortable
$('.sortable').sortable().bind('sortupdate', utils.sort)

//get fields
$( ".element-edit-link" ).on( "click",edit.getFields)

//confirm edits
$( ".confirm-edit-link" ).on( "click",()=>{edit.confirmEdits()})

//reset confiramntion indicator
$(".edit-input").on( "click",() => $(".confirm-edit-link").text("Confirm"));

//new site
$( ".site-create-button" ).on( "click",()=> {newsite.new_site(edit.inputValues, edit.formData)})


//DASHBOARD


//get dash elems
$(".accordion-title").on( "click", quickEdit.queryElems)
  
//send quick edited elems
$(".dash-edit-confirm").on( "click", quickEdit.updateElems)

//go to full editor
$(".full-editor-link").on("click", quickEdit.fullEditor)

//delete site
$(".dash-delete").on("click", dashManage.deleteSite)

//change privacy setting
$(".privacy-switch").on("change", dashManage.changeStatus)

//prompt max sites reached
$(".dash-create-site-button").on("click", dashboard.checkSiteAmount)

//show full adress 
$(".adress-span a").on("click", dashboard.showAdress)

