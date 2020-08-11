//imports
import * as newsite from "./newsite.js"
import * as utils from "./utils.js"
import * as edit from "./edit.js"
import * as quickEdit from "./quick-edit.js"
import * as dashManage from "./dash-manage.js"
import * as dashboard from "./dashboard.js"
import * as toolbox from "./toolbox.js"


//CREATOR


//setup
$(document).foundation()
if(window.location.href.includes("editor") || window.location.href.includes("creator")){
  toolbox.fetchBlocks(".first-toolbox-header")
}

$(".editor-div").hide()
$(".editor-button-div").hide()
$(".preview-div").hide()

//sortable setup
$( function() {
    $( "#sortable-main, #sortable-tray" ).sortable({
      connectWith: ".sortable"
    }).disableSelection();
});

// sortable sortupdate
$('#sortable-main').sortable({receive: ( event, ui ) => {toolbox.sortLi(ui.item)}});

//sortable Tray Add
$( "#sortable-tray" ).sortable({receive: ( event, ui ) => {toolbox.trayAdd(ui.item)}});

//sortable reset elements
//$(".sortable").on("sortupdate", toolbox.resetElems())

//get fields
$( ".sortable" ).on( "click",".element-edit-link", edit.getFields)

//confirm edits
$( ".confirm-edit-link" ).on( "click",()=>{edit.confirmEdits()})

//clear file field 
$(".clear-link").on("click", edit.ClearInput)

//reset confiramntion indicator
$(".edit-input").on( "click",() => $(".confirm-edit-link").text("Confirm"));

//new site
$( ".site-create-button" ).on( "click",()=> {newsite.new_site(edit.inputValues, edit.formData)})

//fetch toolbox blocks
$( ".toolbox-header" ).on( "click",()=> {toolbox.fetchBlocks(event.target)})

//preview selector
$( ".selector-link" ).on( "click",()=> {edit.selectEdit(event.target)})

//toolbox search
$(".block-search").on("input", toolbox.searchBlocks)
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
$(".manage-switch").on("change", dashManage.changeStatus)

//prompt max sites reached
$(".dash-create-site-button").on("click", dashboard.checkSiteAmount)

//show full adress 
$(".adress-span a").on("click", dashboard.showAdress)

