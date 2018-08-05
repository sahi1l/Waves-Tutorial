#!/opt/local/bin/python3
import sqlite3
import cgi
import cgitb
import sys
from io import BytesIO
cgitb.enable(format="text")
form=cgi.FieldStorage()
if len(sys.argv)>1:
    print(sys.argv[1])
    urlencode_data=sys.argv[1].encode('utf-8')
    urlencode_environ={
        'CONTENT_LENGTH': str(len(urlencode_data)),
        'CONTENT_TYPE': 'application/x-www-form-urlencoded',
        'QUERY_STRING': '',
        'REQUEST_METHOD': 'POST',
    }
    data=BytesIO(urlencode_data)
    data.seek(0)
    form=cgi.FieldStorage(fp=data,environ=urlencode_environ)
log=open("LOG","a")
def LOG(val):
    #pass
    log.write(str(val)+"\n")
db=sqlite3.connect("database.sqlite")
C=db.cursor()
toprint=""
def PRINT(x):
    global toprint
    toprint+=x
def STATUS(x):
    global status
    status=x

status="200 OK" #the status to print

def get(key,default=""):
    """return a cgi value, or default if undefined"""
    if key in form:
        return form[key].value
    else:
        return default


def Init():
    """Send a list of all checkmarks and values for a given student"""
    for line in C.execute("SELECT id FROM checkmarks where key=? and chapter=? and checked=1",(key,chapter)):
        PRINT(str(line[0])+'\n')
    for line in C.execute("SELECT id,value FROM inputs where key=? and chapter=?",(key,chapter)):
        PRINT(str(line[0])+'\t'+str(line[1])+'\n')
    STATUS("200 OK")
def AddCheckmark():
    """Add a checkmark to the database"""
    if id!="":        
        val=get("checked",True)
        C.execute("DELETE FROM checkmarks WHERE key=? AND chapter=? AND id=?",(key,chapter,id));
        C.execute("INSERT INTO checkmarks (key,chapter,id,checked) VALUES (?,?,?,?)",(key,chapter,id,val))
        db.commit()
        STATUS("204 OK")
     
def AddInput():
    if(id!=""):
        val=get("val","")
        C.execute("DELETE FROM inputs WHERE key=? AND chapter=? AND id=?",(key,chapter,id));
        C.execute("INSERT INTO inputs (key,chapter,id,value) VALUES (?,?,?,?)",(key,chapter,id,val))
        db.commit()
        STATUS("204 OK")

def IsComplete():
    """Check if all checkmarks that should be checked, are"""
    complete=True
    mychecks=[x[0] for x in C.execute("SELECT id from checkmarks where key=? and chapter=? and checked=?",(key,chapter,True))] #should True be 1?
    for check in C.execute("SELECT id from available where chapter=? and type='c'",(chapter,)):
        if not check[0] in mychecks:
            complete=False
            break
    PRINT(str(complete))
    STATUS("200 OK")

def IsChecked():
    ids=getid().split(",")
    nids=len(ids)
    if(nids>0):
        sql='SELECT sum(checked) from checkmarks WHERE key=? and chapter=? and id in (%s)' % ",".join(nids*"?") 
        nchecked=C.execute(sql, [key,chapter]+ids).fetchone()
        PRINT(nids==nchecked[0])
        STATUS("200 OK")
      
#======================================================================
id=get("id")
if(id==""):
    STATUS("400 No question specified.")
chapter=get("chapter")
cmd=get("command")
code=get("code"); #code for a particular person
key=list(C.execute("SELECT key FROM people WHERE password=?",(code,)))
if not len(key):
    STATUS("400 Student not found.")
    cmd="error"
else:
    key=key[0][0]
    
if cmd=="init": Init()           
elif cmd=="check": AddCheckmark()
elif cmd=="input": AddInput()
elif cmd=="complete": IsComplete()
elif cmd=="checked" and "id" in form: IsChecked()
elif cmd=="name":
        name=list(C.execute("SELECT first,last from people WHERE password=?",(code,)));
        if(len(name)>0):
            PRINT(" ".join(name[0]));
            STATUS("200 OK")
        else:
            STATUS("400 Name not found.")
elif cmd!="error":   
    STATUS("400 Command "+cmd+" was not understood")
print("Status:",status)
print("Content-type:text/plain\n")
print(toprint)
    
#TO FIX: Randomized problems need to have their own entry, maybe in input.  They need to be able to check if they have been completed; if so, they take on the value in input.  If not, they give a new randomized set of variables.
        
