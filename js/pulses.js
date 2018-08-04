checking["A1"] = function(expr){
    //A line with slope 1 at t=0
    try {
        var value=math.eval(math.derivative(math.parse(expr),'x').toString(),{t:0});
        if(value!=1){return false;}
        var value=math.eval(math.derivative(math.parse(expr),'x').toString(),{t:1});
        if(value>=1){return false;}
    } catch(err) {return false;}
    return true;
}
checking["A2"] = function(expr){
    
    //A Gaussian, centered at x=1, that doesn't move
    argument=isGaussian(expr);
    if(argument){
        line=isLine(argument);
        if(line){
            if(line.m=="1" && line.b=="-1"){return true;}
            if(line.m=="-1" && line.b=="1"){return true;}
        }
    }
    //if(expr=="exp(-(x-1)^2)"){return true;}
    //if(expr=="exp(-(1-x)^2)"){return true;}
    return false;
}

checking["A4"] = function(expr){
    //Gaussian moves to the right at 5m/s
    var gaussian=isGaussian(expr);
    if(gaussian){
        xline=isLine(gaussian,"x");
        tline=isLine(gaussian,"t");
        if(xline && tline){
            if(parseFloat(tline.m)==-5*parseFloat(xline.m)){
                return true;}
            
        }
    }
}
checking["A5"] = function(expr){
    //Parabola moves to the left at 5m/s
    console.log("A5");
    var node=parseif(expr);
    var ynode=node.transform(function(n,path,parent){
        if(n.isSymbolNode && n.name==="x"){
            return math.parse("y-3t");
        } else {return n;}
    });
    ynode=math.simplify(alphabetize(math.rationalize(ynode)));
    console.log(ynode.toString());
    if(mathContains(ynode,"x")){return false;}
    if(mathContains(ynode,"t")){return false;}
    var line=isLine(math.derivative(ynode,"y"),"y");
    console.log(line);
    if(line && line.m!=0){return true;}
    return false;
};
checking["A6"] = function(expr){
    //Sinusoidal wave that moves to the left
    var node=parseif(expr)
    
    if(node.isOperatorNode && node.op=="*"){
        if(node.args[0].isConstantNode){
            node=node.args[1];
        } else {return false;}
    }
    console.log(node)
    if(node.name!="sin" && node.name!="cos"){return false}
    node=node.args[0]
    xline=isLine(node,"x")
    tline=isLine(node,"t")
    if(xline.m*tline.m>0){return true}
    return false
}
function parseif(expr){
        if(typeof(expr)==="string"){return math.parse(expr);} else {return expr;}
}
function alphabetize(node){
    //search for * nodes with symbolic children
    //alphabetize the symbolic children
    return node.transform(function(n,path,parent){
        var flip=false;
        if(n.isOperatorNode && n.op=="*" && (n.args[0].isSymbolNode || n.args[1].isSymbolNode)) {
            if(!n.args[0].isSymbolNode){flip=true;}
            else if(n.args[1].isSymbolNode){
                flip=(n.args[0].name>n.args[1].name);
            }
            if(flip){nnode=n.clone();
                     nnode.args=[n.args[1],n.args[0]];
                     return nnode;
                    }
        }
        return n;            
    }
    );
}
function atTime(Node,t){
    if(typeof(Node)=="string"){
        Node=math.parse(Node);
    }
    result=Node.transform(function(node,path,parent){
        if(node.isSymbolNode && node.name==="t"){return new math.expression.node.ConstantNode(t);} else {return node;}
    }
                          );
    return math.simplify(result);
};
function mathContains(node,variable){
    if(typeof(node)=="string"){node=math.parse(node);}
    return node.filter(function(n){return n.isSymbolNode && n.name==variable}).length>0;
}
function isLine(expr,variable){
    if(expr==false){return false;}
    if(variable==undefined){variable="x";}
    if(typeof(expr)=="string"){
        node=math.parse(expr);
    } else {
        node=expr;
        expr=node.toString();
    }
    slope=math.simplify(math.derivative(node,variable));
    if(mathContains(slope,variable)){return false;}
    var ax=new math.expression.node.OperatorNode('*','multiply',[slope,new math.expression.node.SymbolNode(variable)]);
    var root=new math.expression.node.OperatorNode('-','subtract',[node,ax]);
    intercept=math.simplify(root);
//    obj={};
//    obj[variable]=1;
//    intercept=math.eval(expr,obj)-slope;
    return {m:slope.toString(),b:intercept.toString()};
}
function isGaussian(expr){
    //if this is a Gaussian, return the part that is being squared
    //assumes a basic form A*exp(-(X)^2)
    node=math.simplify(expr);
    if(node.op=="*"){
        if(node.args[0].name=="exp"){
            node=node.args[0];
        } else if (node.args[1].name=="exp"){
            node=node.args[1];
        } else {
            return false;
        }
    }
    if(node.name!="exp"){return false;} else {node=node.args[0];}
    if(node.fn!="unaryMinus"){return false;} else {node=node.args[0];}
    //FIX: check for an overall factor in front of the squared thing
    //FIX: check for two things multiplied together
    if(node.fn="pow"){
        if(node.args[1]==2){return node.args[0].toString();}
    }
    return false;
}
function init(){
    animator=new AnimatorWindow();
}
$(init);

//FIX: Typing in a time should change the time's value (or else make it uneditable)
