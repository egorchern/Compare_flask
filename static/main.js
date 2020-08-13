var chosenId = "";

function activate(id) {
    var obj = $(`#${id}`);
    var objs = $(`.media_containers`);
    if (chosenId === id) {

        obj.removeClass("chosen");
        chosenId = "";
        for (var i = 0; i < objs.length; i++) {
            var current = $(objs[i]);
            if (current.attr("id") != id) {
                current.addClass("hovers");

            }
        }
        setTimeout(function () {
            toggle_hover(id)
        }, 400);
    } else {
        
        var others = false;
        for (var i = 0; i < objs.length; i++) {
            var current = $(objs[i]);

            if (current.hasClass("chosen") === true) {

                others = true;
                break;
            }
        }

        if (others === false) {
            chosenId = id;
            obj.addClass("chosen");
            objs.removeClass("hovers");
        }
    }


}

function toggle_hover(id) {
    
    if(chosenId === ""){
        $(`#${id}`).addClass('hovers');
    }
    
}

function handle(e) {
    if (e.keyCode === 13) {
        e.preventDefault();
        process_search_submit();
    }
}



function expandText(obj) {
    spans = $(obj).parent().children();
    $(spans[0]).hide();
    $(spans[1]).show();
    $(spans[2]).show();

}

function shrinkText(obj) {
    spans = $(obj).parent().children();
    $(spans[0]).show();
    $(spans[1]).hide();
    $(spans[2]).hide();
}
