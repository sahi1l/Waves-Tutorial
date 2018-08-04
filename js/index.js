var getcode=function(){return window.location.search.slice(1);}
var Header = function(data){
    //The process function for the command name
    data=data.trim()
    if(data=="Unknown"){
        $("#name").text("I don't recognize your code.");
    } else {
        $("#name").text(data);
    }
}
var GradeCommand = function(input, process) {
    $.ajax({
        url:"../Grading/grading.cgi",
        dataType:"text",
        method:"POST",
        data:input
        }).done(process);
};
function MarkComplete(ch){
    return function() {
        $("li#"+ch.toString()+">.complete").show();
    }
}
function init(){
    GradeCommand({command:"name",code:getcode()},Header);
 
    for(i=1;i<=11;i++){
        GradeCommand({command:"complete",code:getcode(),chapter:i},
                 MarkComplete(i));
    }
}
$(init);