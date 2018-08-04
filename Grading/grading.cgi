#!/opt/local/bin/python3
#!/usr/bin/env python3
import sqlite3
import cgi
import cgitb
cgitb.enable(format="text")
form=cgi.FieldStorage()
log=open("LOG","a")
def LOG(val):
    pass
    #log.write(str(val)+"\n")
db=sqlite3.connect("database.sqlite")
C=db.cursor()
def inithtml():
    try: 
        inithtml.done
    except AttributeError:
        print("Content-type:text/plain\n")
        inithtml.done=1
def prnterror():
    print("Status: 400 Bad request")

def prnt(*args,**kwargs):
    inithtml()
    print(*args,**kwargs)
    
def lookforprams(prams):
    for i in prams:
        if not i in form:
            return False
    return True
if lookforprams(["code","chapter","command"]):
    #inithtml()
    code=form["code"].value
    key=list(C.execute("SELECT key FROM people WHERE password=?",(code,)))
    if not len(key):
        prnterror()
       #print("Who are you?") #FIX: Must throw error
        exit
    key=key[0][0]
    chapter=form["chapter"].value
    cmd=form["command"].value
    
    if cmd=="init":
        for line in C.execute("SELECT id FROM checkmarks where key=? and chapter=? and checked=1",(key,chapter)):
            prnt(line[0])
        for line in C.execute("SELECT id,value FROM inputs where key=? and chapter=?",(key,chapter)):
            prnt(line[0],line[1],sep='\t')
            
    elif cmd=="check" and "id" in form:
        id=form["id"].value
        val=True
        if "checked" in form:
            val=form["checked"].value
        C.execute("DELETE FROM checkmarks WHERE key=? AND chapter=? AND id=?",(key,chapter,id));
        C.execute("INSERT INTO checkmarks (key,chapter,id,checked) VALUES (?,?,?,?)",(key,chapter,id,val))
        db.commit()
        prnt("OK") #replace with status?
        
    elif cmd=="input" and lookforprams(["id","value"]):
        id=form["id"].value
        val=form["value"].value
        C.execute("DELETE FROM inputs WHERE key=? AND chapter=? AND id=?",(key,chapter,id));
        C.execute("INSERT INTO inputs (key,chapter,id,value) VALUES (?,?,?,?)",(key,chapter,id,val))
        db.commit()
        prnt("OK") #replace with status?
        
    elif cmd=="complete":
        #Only checkmarks are checked
        complete=True
        mychecks=[x[0] for x in C.execute("SELECT id from checkmarks where key=? and chapter=? and checked=?",(key,chapter,True))] #should True be 1?
        for check in C.execute("SELECT id from available where chapter=? and type='c'",(chapter,)):
            if not check[0] in mychecks:
                complete=False
                break
        prnt(complete); #
        
    elif cmd=="checked" and "id" in form:
        ids=form["id"].value.split(",")
        nids=len(ids)
        LOG(nids)
        sql='SELECT sum(checked) from checkmarks WHERE key=? and chapter=? and id in (%s)' % ",".join(nids*"?") 
        LOG(sql)
        LOG([key,chapter]+ids)
        nchecked=C.execute(sql, [key,chapter]+ids).fetchone()
        LOG(nchecked[0])
        prnt ((nids==nchecked[0]))
            
elif "command" in form and form["command"].value == "name":
        inithtml();
        if "code" in form:
            code=form["code"].value
            name=list(C.execute("SELECT first,last from people WHERE password=?",(code,)));
            if(len(name)>0):
                prnt(" ".join(name[0]));
            else:
                prnterror()
                print("Unknown") #Status error
        else:
            prnterror()
            print("Unknown") #Status error
else:    
    prnterror()

#TO FIX: Randomized problems need to have their own entry, maybe in input.  They need to be able to check if they have been completed; if so, they take on the value in input.  If not, they give a new randomized set of variables.
        
