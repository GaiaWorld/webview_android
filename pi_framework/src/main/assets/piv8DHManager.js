
class DataHandle{

    constructor(id){
        if(id === undefined){
            this.ID = piv8DHMangager.createNewDataHandle();
        }
        this.ID = id
    }

    getContent(){
        return piv8DHMangager.getContent(this.ID)
    }

    runScript(){
        return piv8DHMangager.runScript(this.ID)
    }

    setContent(content, fileName){
        return piv8DHMangager.setContent(this.ID, content, fileName)
    }

}