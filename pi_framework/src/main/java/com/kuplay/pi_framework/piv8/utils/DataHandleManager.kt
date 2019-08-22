package com.kuplay.pi_framework.piv8.utils

import com.kuplay.pi_framework.piv8.V8

object DataHandleManager{

    private var dataHandleID: Int = 0;
    private val dataHandleMap:MutableMap<Int,DataHandle> = mutableMapOf();

    private lateinit var v8: V8

    fun setV8(v8: V8){
        this.v8 = v8
    }

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
            return result
        }
        return ""
    }

    fun runScript(dhID: Int){
        if (dhID in dataHandleMap.keys){
            val dh = dataHandleMap[dhID]
            dh!!.runScript()
        }
    }

    fun setContent(dhID: Int, content: String, fileName: String){
        if (dhID in dataHandleMap.keys){
            val dh = dataHandleMap[dhID]
            dh!!.setContent(content, fileName)
        }
    }

}