AnimatorWindow=function(){
    this.xmin=-10; this.xmax=10; this.xcnt=1000.0;
    this.t=0; this.dt=0.01; this.dur=100;
    that=this;
    this.start=function(){
	that.findyrange();
	that.process();
    }
    this.process=function(){
	S=that.formula[0].value;
	var scope={};
	var formula=math.parse(S,scope).compile();
	var X=[]; var Y=[];
	for(x=that.xmin;x<=that.xmax;x+=(that.xmax-that.xmin)/that.xcnt){
	    try {
		X.push(x);
		Y.push(formula.eval({x:x,t:that.t}));
	    } catch(err){
		//no point if there's an error
	    };
	}
	Plotly.newPlot($("#result")[0], [{x: X,y:Y}],Object.assign(that.layout,{yaxis:{range: that.yscale}}));
    };
    this.stop=function(){
	//	console.log(that.running);
	if(that.running){that.stopQ=1;}
	$("#animator #show").show();
	$("#animator #run").show();
	$("#animator #stop").hide();
	$("#animator #reset").hide();
    }
    this.findyrange=function(){
	S=that.formula[0].value;
	var scope={};
	var formula=math.parse(S,scope).compile();
	var min=undefined; var max=undefined;
	for(x=that.xmin;x<=that.xmax;x+=(that.xmax-that.xmin)/that.xcnt){
	    try {
		var y=formula.eval({x:x,t:0});
		if(min==undefined || y<min){min=y;}
		if(max==undefined || y>max){max=y;}
	    } catch (err){;}
	};
	var delta=max-min;
	min-=delta*0.03;
	max+=delta*0.03;
	that.yscale=[min,max];
    };
    this.updatetime=function(val){
//	console.log(val);
	that.t=val;
	$("#animator #time")[0].value=that.t.toFixed(2);
    }
    this.reset=function(){
	that.stop();
	that.updatetime(0);

	that.process();
	//	console.log("auto");
	//	this.autoscale=true;
	
	//	that.plot[0].layout.yaxis.autorange=true;
    };
    this.startrun=function(){
	that.start();
	$("#animator #show").hide();
	$("#animator #run").hide();
	$("#animator #stop").show();
	$("#animator #reset").show();

	that.run();
    }
    this.run=function(){
	//	this.autoscale=false;
	//	animate.plot[0].layout.yaxis.autorange=false;
	//	console.log("autooff:",that.plot[0].layout.yaxis.autorange);
	if(that.stopQ){
	    that.stopQ=0;
	    that.running=undefined;
	    //	    console.log("auto");
	    //	    this.autoscale=true;
	    //	    that.plot[0].layout.yaxis.autorange=true;
	    return;
	};
	that.updatetime(that.t+that.dt);
	that.process();
	that.running=setTimeout(that.run,that.dur);
    };
    this.chgspeed=function(val){
	that.dur-=10*val;
	var max=200.0;
	$("#animator #faster")[0].disabled=(that.dur<=0);
	$("#animator #slower")[0].disabled=(that.dur>=max);
	$("#animator #speed #value").width($("#animator #speed").width()*(1-that.dur/max));
	if(that.dur<0){that.dur=0;}
	if(that.dur>max){that.dur=max;}
    }


    this.whenLoaded=function(){
        that.formula=$("#animator #formula");
        that.formula.keyup(function(event){
                that.stop();
                var ok=true;
                try {
                    if(that.formula[0].value.length==0){throw "empty";}
                    math.parse(that.formula[0].value);
                    $("#run")[0].disabled=false;
                    $("#show")[0].disabled=false;
                } 
                catch(err) {
                    ok=false;
                    $("#run")[0].disabled=true;
                    $("#show")[0].disabled=true;
                };
                if(ok && (true || event.which==13)){
                    that.start();
                }
            });
        
        that.plot=$("#result");
        that.stopQ=0;
        badmodebar=["sendDataToCloud","pan2d","select2d","lasso2d","autoScale2d","toggleSpikelines"];
        that.layout={autosize:true,width:300,height:250,margin:{t:20,l:30,r:20,b:20}};
        Plotly.newPlot(that.plot[0],[{x:[0],y:[0]}],that.layout,{modeBarButtonsToRemove: badmodebar});
        that.plot.on("plotly_relayout",function(data){
                var range=data.target.layout.xaxis.range;
                that.xmin=range[0];
                that.xmax=range[1];
                that.process();
            });
        $("#animator #run").click(that.startrun);
        $("#animator #show").click(that.reset);
        $("#animator #stop").click(that.stop);
        $("#animator #reset").click(that.reset);
        $("#animator #faster").click(function(){that.chgspeed(1);});
        $("#animator #slower").click(function(){that.chgspeed(-1);});
        that.stop();
        that.updatetime(0);
    }
    $("#animator").load("animator.html","",that.whenLoaded);
};
