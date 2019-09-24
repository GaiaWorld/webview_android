package com.high.pi_service.utils

import android.os.Handler
import android.os.Looper
import com.high.pi_service.V8

class DataHandle(private val v8: V8){

    private  var filePath:String = ""
    private  var data:String = ""

    fun getContent():String{
        return data;
    }

    fun runScript(){
        Handler(Looper.getMainLooper()).post {
            v8.executeVoidScript(data, filePath, 0)
        }
    }

    fun setContent(content: String, fileName: String){
        data = content
        filePath = fileName
    }

}