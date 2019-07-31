package com.kuplay.pi_framework.piv8.utils

import com.kuplay.pi_framework.piv8.V8

class DataHandleManager(private val v8: V8){

    private var dataHandleID: Int = 0;
    private val dataHandleMap:MutableMap<Int,DataHandle> = mutableMapOf();


    fun createNewDataHandle():Int{
        dataHandleID++
        val dh = DataHandle(v8)
        dataHandleMap.put(dataHandleID, dh)
        return dataHandleID
    }

    fun getContent(dhID:Int):String{
        if (dhID in dataHandleMap.keys){
            val dh = dataHandleMap[dhID]
            val result = dh!!.getContent()
            dataHandleMap.remove(dhID)
            return result
        }
        return ""
    }

    fun runScript(dhID: Int){
        if (dhID in dataHandleMap.keys){
            val dh = dataHandleMap[dhID]
            dh!!.runScript()
            dataHandleMap.remove(dhID)
        }
    }

    fun setContent(dhID: Int, content: String, fileName: String){
        if (dhID in dataHandleMap.keys){
            val dh = dataHandleMap[dhID]
            dh!!.setContent(content, fileName)
        }
    }

}