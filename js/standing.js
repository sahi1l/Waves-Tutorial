
Sines=function(name,w,h){
    //TODO: Add controls for start/stop, change wavelength, change speed
    //TODO: Allow change of boundaty
    //MAYBE: Different colors for different directions. I'll need two separate paths then.
    console.log(name,w,h);
    var paper=Raphael(name,w,h);
    this.L=w-10; //distance from origin to wall
    console.log(this.L);
    this.lam=2*this.L/4; //wavelength
    this.y0=h/2;
    this.v=32; //velocity
    var that=this;
    this.sum=paper.path("").attr({"stroke-width":1,"stroke":"red","stroke-width":2});
    this.all=paper.path("").attr("stroke-width",1);
    function f(x,t){
        var phase=x-(that.v*t);
        return 0.02*h*Math.sin(Math.PI*2*(phase)/that.lam); 
    }
    this.show=function(time){
        dx=1;
//        var path=Raphael.format("M{0},{1}",10,this.y0);
        var path="";
        var sum=[];
        for(x=0;x<=this.v*time;x+=dx){
            var X=x%(2*this.L+1);
            var flip=1;
            if(X>this.L){X=2*this.L-X;flip=-1;}
            //TODO: Handle different types of boundaries
            var idx=Math.floor(X/dx);
            
            var y=flip*f(x,time);
            if(sum[idx]==undefined){sum[idx]=0;}
            sum[idx]+=y;
            path+=Raphael.format("L{0},{1}",10+X,y+this.y0);
        }
        path="M"+path.slice(1);
        this.all.attr("path",path);
        path="";
        for(X=0;X<this.L/dx;X++){
            if(sum[X]!=undefined){
                path+=Raphael.format("L{0},{1}",10+X*dx,sum[X]+this.y0);
            }
        }
        path="M"+path.slice(1);
        this.sum.attr("path",path);
    
    }  
    var atime=0;
    this.handle=0;
    this.animate=function(){
        that.show(atime);
        atime+=0.1;
        this.handle=setTimeout(that.animate,10);
    }
}
var sines;
sinesinit=function(){
    console.log("sinesinit");
    sines=new Sines("sines",200,400);
    sines.show(2);
}
$(sinesinit);