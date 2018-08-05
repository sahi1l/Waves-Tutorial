ranint=function(start,stop){return Math.floor(Math.random()*(stop-start))+start;}
function SetUpRandom(){
    //This will call all functions that require a random number, so it is seeded properly.
    console.log("SetUpRandom");
    sininit();
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
sininit=function(){
    randomsin=new RandomSinusoidal();
    $("#A1play").click(randomsin.Play);
    $("#A1step").click(randomsin.Step);
    randomsin.Play();
};

 
//TODO: [x] Add play/pause and step buttons
