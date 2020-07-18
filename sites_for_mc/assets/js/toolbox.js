import * as utils from "./utils.js"

export function fetchBlocks(target) {
    target = $(target)
    utils.colorInverter(target,".toolbox-header")
    var toolboxType = utils.formatDB(target.text())
    $('#sortable-tray').html("")

    $.ajax({
        headers: {'X-CSRFToken':utils.csrf_token},
        type: "POST",
        url: "http://127.0.0.1:8000/creator/",
        data: {toolboxType},
        success: (data) => { 
            console.log(data)   
            data = JSON.parse(data)
            $.each(data, ( index, value ) => {
                var toolboxLi = $(".toolbox-li")
                console.log(toolboxLi)
                value = value[0].toUpperCase() + value.slice(1)
                $('#sortable-tray').append(
                    "<li class='toolbox-li editor-li'>"+value.replace("-", " ")+"<a class='element-edit-link'>edit</a></li>"
                )
              });
        },
        failure: ()=>{console.log('error')}
    })
}