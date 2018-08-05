function lpr(data){console.log(data);CheckComplete();} //debug function
function InsertHeader(){
    $("body").prepend('<div id="header"><span id="name"></span> <div id="complete">Completed! <A HREF="index.html">Return to the scoreboard.</A></div></div>');
    $("#complete").hide();
}
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
        url:"Grading/grading.cgi",
        dataType:"text",
        method:"POST",
        data:input
        }).done(process).fail(function(x,txt,b){console.log("Error:",b);});
};
var CheckComplete = function(chapter) {
    if(chapter==undefined){
        chapter=getchapter();
    }
    GradeCommand({command:"complete",code:getcode(),chapter:chapter},
                 isComplete)
};

var isComplete = function(result){
    console.log("isComplete",result.trim())
    if(result.trim()=="True"){
        $("#complete").show();
        $("#header").addClass("complete");
    } else {
        $("#complete").hide();
        $("#header").removeClass("complete");
    }
}
GradeInit=function(data){
    //This is the process function for the command init
    console.log("GradeInit begins")
    console.log(JSON.stringify(data));
    if(data.trim()==""){return;}
    var D=data.trim().split("\n")
    D.forEach(function(element){
        L=element.split("\t");
        if(L.length==1 && L[0]!=""){//checkbox
            console.log("GradeInit: L[0]=",L[0]);
            $("li#"+L[0]).addClass("done")
        } else if (L[0]!=""){
            $("input#"+L[0]).val(L[1])
        }
    });
}
var getchapter=function(){return $("#chapter").text();}
var getcode=function(){return window.location.search.slice(1);}
var checking={}
//NOTE: checking[id] should be a function which returns true if it is correct.
var answerkey=function(event){
    if(event.which==13){
        answercheck(this.id);
    } else {
        $(this).removeClass("correct");
        $(this).removeClass("wrong");
    }
}
var answercheck=function(id){
    console.log("answercheck");
    var widget=$("input#"+id);
    var val=widget.val()
    if (!(id in checking)){
        widget.addClass("missing");
    } else if(checking[id](val)){
        widget.removeClass("wrong");
        widget.addClass("correct");
        var w=widget.parent()[0];
        W=widget;
        toggleCheck(w,true);
        //Check the li
    } else {
        widget.removeClass("correct");
        widget.addClass("wrong");
        toggleCheck(widget.parent("li")[0],false);
    }
    GradeCommand({
        command:"input",code:getcode(),chapter:getchapter(),
        id:widget.attr("id"),value:val},lpr);
 //   CheckComplete();
}
function reveal(){
    $(this).hide();
    $(this).next("div").show();
    li=$(this).parent("li");
    if(li.length>0){toggleCheck(li,true);}
};
function toggleCheck(w,val){
    w=$(w);
    id=w.attr("id")
    if(val==undefined){
        val=!(w.hasClass("done"));
    }
    if (val){
        w.addClass("done");
        GradeCommand({command:"check",code:getcode(),chapter:getchapter(),id:id,checked:1},lpr);
    } else {
        w.removeClass("done"); GradeCommand({command:"check",code:getcode(),chapter:getchapter(),id:id,checked:0},lpr);
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

function generalinit(){
    InsertHeader();
    $("button.reveal +div").hide();
    $("button.reveal").click(reveal);
    $("li.simple").click(function(e){toggleCheck(e.target);});
    $("input.answer").attr("placeholder","Type your answer here.");
    $("input.answer.short").attr("placeholder","Answer");
    $("input.answer").keyup(answerkey);
    $("#complete").hide()
    GradeCommand({command:"name",code:getcode()},Header);
    addQuery();
   console.log("Initing"); GradeCommand({command:"init",code:getcode(),chapter:getchapter()},GradeInit);
    CheckComplete();
}

$(generalinit)
function Label(){
    $("li").each(function(i,elt){
        var duh=document.createElement("span");
        duh.innerHTML="["+elt.id+"]";
        duh.classList="label";
        elt.prepend(duh);
    });
    $("input").each(function(i,elt){
        var duh=document.createElement("span");
        duh.innerHTML="["+elt.id+"]";
        duh.classList="label";
        elt.parentNode.append(duh);
    });
}
function Unlabel(){$(".label").remove();}