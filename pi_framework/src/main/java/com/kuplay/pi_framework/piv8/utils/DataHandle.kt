package com.kuplay.pi_framework.piv8.utils

import android.content.Intent
import com.kuplay.pi_framework.piv8.V8

class DataHandle(private val v8: V8){

    private  var filePath:String = ""
    private  var data:String = ""

    fun getContent():String{
        return data;
    }

    fun runScript(){
        v8.executeVoidScript(data, filePath, 0)
    }

    fun setContent(content: String, fileName: String){
        data = content
        filePath = fileName
    }

}