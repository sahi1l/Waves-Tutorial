ranint=function(start,stop){return Math.floor(Math.random()*(stop-start))+start;}
function SetUpRandom(){
    //This will call all functions that require a random number, so it is seeded properly.
    sininit();
}
MovingWave=function(widget,W,H){
    //Generic sine wave
    this.paper=Raphael(widget,W,H);
    this.xmin=0.05*W;
    this.width=0.9*W;
    this.height=H/4;
    this.y0=H/2;
    var that=this;
    this.delay=200;
    this.wave=this.paper.path("").attr("stroke-width",4);
    this.t=0; this.dt=0.1; this.dir=0; this.handle=0;
    this.start=function(dir,animate){
        if(animate==undefined){
            animate=this.animate.bind(this);
        }
        clearInterval(this.handle);
        this.dir=dir;
        if(dir!=0){this.handle=setInterval(animate,this.delay);}
        this.cos(this.t);
    }
    this.cos=function(phase){
        this.makewave.call(this,phase);
    }
    this.animate=function(){
        this.t+=this.dt*this.dir;
        while(this.t<0){this.t+=2;}
        while(this.t>2){this.t-=2;}
        this.cos(this.t);
    }
    this.makewave=function(phase){
        var path="";
        for(p=0;p<=1;p+=0.01){
            x=this.xmin+this.width*p;
            y=this.y0-this.height*Math.cos((p*2+phase+1)*Math.PI);
            path+=Raphael.format("L{0},{1}",x,y);
        }
        path="M"+path.slice(1);
        this.wave.attr("path",path);

    }
}
PhaseMotion=function(){
    var wave=new MovingWave("phasemotion",200,200)
    wave.cos=function(phase){
        label.attr("text","𝜙="+phase.toFixed(1)+"π");
        wave.makewave.call(wave,phase);
    }

    var line=wave.paper.path(Raphael.format("M{0},{1}l0,{2}",
                                            wave.xmin+wave.width/2,
                                            wave.y0-1.2*wave.height,
                                            2.4*wave.height))
    .attr("stroke-dasharray","-");
    var label=wave.paper.text(wave.xmin+wave.width/2,wave.y0-1.5*wave.height,"𝜙=0").attr({"font-size":18});
    this.start=function(dir){
        wave.start(dir,wave.animate.bind(wave));
        var text=[
            "When a wave moves to the right, the phase decreases.",
            "The phase at a particular spot changes as the wave moves.",
            "When a wave moves to the left, the phase increases."];
        $("#phasemotion~p").text(text[dir+1]);
        $("button.onbutton").removeClass("onbutton");
        if(dir==1){$("button#left").addClass("onbutton");}
        if(dir==-1){$("button#right").addClass("onbutton");}
        if(dir==0){$("button#stopsign").addClass("onbutton");}
    }
    this.start(0);
}
RandomSinusoidal=function(){
    Math.seedrandom($("#A1seed")[0].value)
    this.A=ranint(1,5);
    this.v=ranint(1,5);
    this.T=ranint(1,5);
    this.lam=this.v*this.T;
    this.ymax=math.ceil(this.A*1.5);
    ran=ranint(1,3);
    this.xmax=math.ceil(this.lam*ran);
    cxmax=this.lam*math.ceil(ran);
    this.t=0;
    this.dt=0.1;
    this.dx=0.01;
    xvalues=[];
    yvalues=[];
    this.Tmax=math.ceil(this.T/this.dt);
    for(t=0;t<=this.Tmax;t++){
        duh=[];
        for(x=0;x<=cxmax;x+=this.dx){
            xvalues.push(x);
            duh.push(this.A*math.cos(2*math.pi*(x-this.v*t*this.dt)/this.lam));
        }
        yvalues.push(duh)
    }
    Plotly.newPlot($("#A1animation")[0],[{x:xvalues,y:yvalues[0]}],{yaxis:{range:(-this.ymax,this.ymax)}});
    this.plotone=function(T){
        //T is an integer
        T=T%this.Tmax;
        Plotly.animate($("#A1animation")[0],
                       {data:[{x:xvalues,y:yvalues[T]}]},
                       {transition: {duration:0},
                        frame: {duration:0,redraw:false}
                       });
    }
    this.time=0;
    var that=this;
    this.update=function(){
        this.step();
        this.timeout=setTimeout($.proxy(this.update,this),100);
    }
    this.pause=function(){
        clearTimeout(that.timeout);
        that.timeout=undefined;
    }
    this.step=function(){
        that.plotone(that.time);
        $("#A1animationTime").text("t="+(this.time*this.dt).toFixed(1));
        that.time=(that.time+1);
    }
    this.Play=function(){
        if(that.timeout==undefined){
            $("#A1play").text("Pause");
            that.update();
        } else {
            that.Pause();
        }
    }
    this.Pause=function(){
        that.pause();
        $("#A1play").text("Play");
    }
    this.Step=function(){
        that.Pause();
        that.step();
    }
};

checking["A1lam"]=function(val){
    return parseInt(val)==parseInt(randomsin.lam);
};
checking["A1T"]=function(val){
    return parseInt(val)==parseInt(randomsin.T);
};
checking["A1v"]=function(val){
    return parseInt(val)==parseInt(randomsin.v);
};
checking["A1A"]=function(val){
    return parseInt(val)==parseInt(randomsin.A);
};
var phasemotion;
sininit=function(){
    randomsin=new RandomSinusoidal();
    $("#A1play").click(randomsin.Play);
    $("#A1step").click(randomsin.Step);
    //randomsin.Play();
};
var basicsinewave;
init=function(){
    basicsinewave=new MovingWave("basicsinewave",200,100);
    basicsinewave.dt=0.01;basicsinewave.delay=10;
    basicsinewave.start(-1);
    phasemotion=new PhaseMotion();    
}
$(init);

