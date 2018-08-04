checking["C1"]=function(val){return (val==4);};
checking["C2"]=function(val){return (val==-3);};
checking["C3"]=function(expr){
    var ev=math.eval(expr);
    return (ev.re==4 && ev.im==3);};
checking["C4"]=function(val){return (val==5);};
checking["A1"]=function(val){return (val==-1);};
cmpnumber=function(a,b){
    return (math.abs(a-b)<0.0001);
};
cmpcpxnumber=function(a,b){
    return cmpnumber(a.re,b.re) && cmpnumber(a.im,b.im);
}
checking["A2"]=function(expr){
    code=expr.match(/cos[ \(]*x[ \)]* *- *i *\*? *sin[ \(]*x[ \)]*/);
    return (code!=null);
};
checking["A3"]=function(val){return (val==1);};
checking["A4"]=function(expr){
    return expr.match(/2[ *]*cos[ \(]*x[ \)]/);
};
checking["A5"]=function(expr){
    return expr.match(/2[ *]*i[ *]*sin[ \(]*x[ \)]/);
}
checking["B1"]=function(expr){
    return (expr=="A");
}