var getcode=function(){return window.location.search.slice(1);};
var Header = function(data){
    //The process function for the command name
    data=data.trim()
    $("#name").text(data);
};
var NoHeader=function(){
    $("#name").text("I don't recognize your code.")
};
var GradeCommand = function(input, process, fail) {
    console.log("GradeCommand: ",input)
    if(fail==undefined){
        fail=function(x,txt,b){console.log("Error: ",b);}
    }
    $.ajax({
        url:"Grading/grading.cgi",
        dataType:"text",
        method:"POST",
        data:input
        }).done(process).fail(fail);
};
function MarkComplete(ch){
    return function(data) {
        if(data.trim()=="True"){
            $("li#"+ch.toString()+">.complete").show();
        }
    }
}
function addQuery(){
    console.log($("a"))
    $("a").each(function(idx,element){
        console.log(element);
        var href=element.href;
        console.log(href);
        if(href.indexOf("?")<0){
            element.href=href+"?"+getcode()
        }
    });
}

function init(){
    if(getcode()){
        GradeCommand({command:"name",code:getcode()},
                     Header,NoHeader);
        addQuery();
    } else {
        $("#name").text("Use the link you were sent via email.");
    };
    for(i=1;i<=11;i++){
        GradeCommand({command:"complete",code:getcode(),chapter:i},
                 MarkComplete(i));
    }
}
$(init);