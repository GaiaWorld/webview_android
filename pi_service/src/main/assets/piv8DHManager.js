
class DataHandle{

    constructor(id){
        if(id === undefined){
            this.ID = piv8DHManager.createNewDataHandle();
        }else{
            this.ID = id;
        }

    }

    getContent(){
        return piv8DHManager.getContent(this.ID)
    }

    runScript(){
        return piv8DHManager.runScript(this.ID)
    }

    setContent(content, fileName){
        return piv8DHManager.setContent(this.ID, content, fileName)
    }

}


JSVM.Boot.loadJS = function(domains, content){
    var dhn = JSVM.Boot.loadJSDH(domains, content)
    var result = new DataHandle(dhn)
    return result
}

JSVM.Boot.getMobileBootFiles = function(cb){
    var callback = function(ob){
        ob = JSON.parse(ob)
        for(let key in ob){
            var dhi = ob[key]
            var dh = new DataHandle(dhi)
            ob[key] = dh
        }
        cb(ob)
    }
    JSVM.Boot.getMobileBootFilesDH(callback)
}

JSVM.Boot.updateDownload = function(domains, url, files, success, fail, progress){
    var successCallBack = function(fileStr,dhi){
        var dh = new DataHandle(dhi)
        var file = JSON.parse(fileStr)
        success(file,dh)
    }
    var fileString = JSON.stringify(files)
    JSVM.Boot.updateDownloadDH(domains, url, fileString, successCallBack, fail, progress)
}

JSVM.store.read = function(inputTabName, key, success, fail, complete){
    var successCallBack = function(dhi){
        var dh = new DataHandle(dhi)
        success(dh)
    }
    JSVM.store.readDH(inputTabName, key, successCallBack, fail, complete)
}

JSVM.getDownRead = function(filePath, fileName, okCB, errCB){
    console.log("start file with fileName: " + fileName)
    var okCallBack = (dhi, fileName)=>{
        console.log("end file with fileName: " + fileName + "dhi : " + dhi)
        var dh = new DataHandle(dhi)
        okCB(dh)
    }
    JSVM.getDownReadDH(filePath, fileName, okCallBack, errCB)
}

