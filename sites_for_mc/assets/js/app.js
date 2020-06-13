//imports
import * as newsite from "./newsite.js"
import * as utils from "./utils.js"
import * as edit from "./edit.js"
import * as quickEdit from "./quick-edit.js"

//setup
var csrf_token = document.getElementsByName('csrfmiddlewaretoken')[0].value  

//CREATOR


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
$(".dash-delete").on("click", quickEdit.deleteSite)

//prompt max sites reached
$(".dash-create-site-button").on("click", quickEdit.checkSiteAmount)

//show full adress 

$(".adress-span a").on("click",   quickEdit.showAdress)

