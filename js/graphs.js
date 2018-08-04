function rnd(min,max){
    return Math.floor(Math.random()*(max-min)+min);
}
function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}
//ys index is I=0,1,2,...,M
//I=x-vt
//x=I+vt
//t=(x-I)/v
var historyG=function(widget,ys,x,v){
    var tmin=0; var tmax=8
    var tvals=[(x+1)/v];
    var yvals=[0];
    for(i=0;i<ys.length;i++){
        var t=(x-i)/v;
        tvals.push(t);
        yvals.push(ys[i]);
    }
    tvals.push((x-ys.length)/v);
    yvals.push(0);
    if(v<0){        
        tvals.push(tmax);
        yvals.push(0);
    } else {
        tvals.unshift(tmax);
        yvals.unshift(0);
    }
    Plotly.newPlot($(widget)[0],
                   [{x:tvals,y:yvals}],
                   {width:200,height:200,margin:{t:50,l:30,r:20,b:40},
      xaxis:{range:[0,8.5],dtick:1,showgrid:true,title:"<i>t</i>",mirror:"all"},
      yaxis:{range:[-2.5,2.5],dtick:1,showgrid:true,title:"<i>y</i>(<i>x</i>,<i>t</i>)",mirror:"all"}},{displayModeBar:false});
    
}
var snapshot=function(widget,ys,t,v){
    //ys are a list of values for y(x) from x=0 to x=8
    var xmin=0; var xmax=8;
    var xvals=[-1+v*t];
    var yvals=[0];
    for(i=0;i<ys.length;i++){
        var x=i+v*t;
        xvals.push(x);
        yvals.push(ys[i]);
    }
    xvals.push(ys.length+v*t)
    yvals.push(0);
    xvals.push(xmax);
    yvals.push(0);
    Plotly.newPlot($(widget)[0],
                   [{x:xvals,y:yvals}],
                   {width:300,height:250,margin:{t:50,l:30,r:20,b:40},
      xaxis:{range:[-0.5,8.5],dtick:1,showgrid:true,title:"<i>x</i>",mirror:"all"},
      yaxis:{range:[-2.5,2.5],dtick:1,showgrid:true,title:"<i>y</i>(<i>x</i>,<i>t</i>)",mirror:"all"}},{displayModeBar:false});
}
var AA1=function(){
    //Create a random collection of points
    var xmax=8;
    this.points=[0];
    this.xvalues=[0];
    for(x=1;x<=xmax-1;x++){
        this.points.push(rnd(-4,4));
        this.xvalues.push(x);
    }
    this.xvalues.push(xmax);
    this.points.push(0);
    //Choose a time
    this.t=rnd(0,xmax);
    //Choose a random location
    this.x=this.t;
    while(this.x==this.t){
        this.x=rnd(1,xmax-1);
    }
    this.answer=this.points[this.x];
    //Draw the graph
    widget=$("li#A1>.canvas"); //Or whatever it is
    Plotly.newPlot(widget[0],
                   [{x:this.xvalues,y:this.points}],
                   {title: "t="+(this.t).toString(),
                    width:300,height:250,margin:{t:50,l:30,r:20,b:40},
      xaxis:{range:[-0.5,8.5],dtick:1,showgrid:true,title:"<i>x</i>",mirror:"all"},
      yaxis:{range:[-4.5,4.5],dtick:1,showgrid:true,title:"<i>y</i>(<i>x</i>,<i>t</i>)",mirror:"all"}
                                                        },
                   {displayModeBar:false});
    $("li#A1>span.modify").html(this.x.toString()+","+this.t.toString());  
}
randompulse=function(){
    var result;
    switch (rnd(0,3)){
        case 0:
            result=[0,1,2,-1,0];break;
        case 1:
            result=[0,1,-2,0];break;
        case 2:
            result=[0,1,2,0];break;
    }
    var v=rnd(0,3);
    while(v>0){
        result.unshift(0);
        v-=1;
    }
    return result;
}
var AA2=function(){
    //Choose a random snapshot graph and create it
    //there will be several patterns to choose from, later, maybe
    var ys=randompulse();
    snapshot($("li#A2>.canvas"),ys,0,0);
    //Then create four possible history graphs (with different values of v) 
    var vs=[-2,-1,-0.5,0.5,1,2];
    shuffle(vs);
    var xs=[];
    for(var i=0;i<4;i++){
        xs.push(rnd(2,5));
        console.log(xs[xs.length-1],vs[i]);
        historyG($("li#A2>.answers>.canvas")[i],ys,xs[xs.length-1],vs[i]);
        $($("li#A2 >.answers>.canvas")[i]).children("button").click(
            function(){console.log(this);checking["A2"]($(this).attr("which"))});
            
    }
    this.answer={num:rnd(0,4)}
    this.answer.x=xs[this.answer.num]
    this.answer.v=vs[this.answer.num]
    $('#A2 #position').text(this.answer.x);
    $('#A2 #speed').text(math.abs(this.answer.v));
    $('#A2 #direction').text(this.answer.v>0?'right':'left');
    $("li#A2 #tryagain").hide()
}
var AA3=function(){
    var ys=randompulse();
    var x=rnd(2,5);
    this.t=rnd(1,4);
    var v=[-1,1][rnd(0,2)];
    historyG($("li#A3 #history"),ys,x,v);
    snapshot($("li#A3 #snapshot"),ys,this.t,v);
    $('li#A3 #position').text(x);
    $('li#A3 #speed').text(math.abs(v));
    $('li#A3 #direction').text(v>0?'right':'left');
}

checking["A1"]=function(expr){
    console.log(A1.answer);
    console.log(expr);
    return parseInt(expr)==A1.answer;
}
checking["A2"]=function(answer){
    //note: this doesn't use an input, but a set of click buttons
    var correctQ=(answer==A2.answer.num);
    $("li#A2 button").hide();
    if(correctQ){
        $($("li#A2>.answers>.canvas")[answer]).addClass("correct");
        console.log("Yay!")
        toggleCheck($("li#A2"),true);
    } else {
        $($("li#A2>.answers>.canvas")[answer]).addClass("wrong");
        $($("li#A2>.answers>.canvas")[A2.answer.num]).addClass("correct");
        $("li#A2 #tryagain").show();
    }
}
checking["A3"]=function(expr){
    return (expr==A3.t);
}
A2reset=function(){
    $("#A2>#tryagain").hide();
    delete A2;
    A2=new AA2();
    $("li#A2 button").show();
    $("li#A2 span").removeClass("correct")
    $("li#A2 span").removeClass("wrong")
    
}
function init(){
    A1=new AA1();
    A2=new AA2();
    A3=new AA3();
    console.log("hi");
}
$(init);