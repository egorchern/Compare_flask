function expandText(obj){
spans = $(obj).parent().children();
$(spans[0]).hide();
$(spans[1]).show();
$(spans[2]).show();
        
}
function shrinkText(obj){
    spans = $(obj).parent().children();
    $(spans[0]).show();
    $(spans[1]).hide();
    $(spans[2]).hide();
}