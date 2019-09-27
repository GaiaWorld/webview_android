package com.high.pi_service

import android.app.Service
import android.content.Intent
import android.os.*

class piv8Service: Service() {

    private val callBackManager: MutableMap<String, piserviceCallBack> = mutableMapOf()

    private var runtime: V8? = null
        get() = JSVMManager.get().getRuntime()

    //================life=========
    override fun onCreate() {
        super.onCreate()
        JSVMManager.get().createV8(this)
        if (runtime != null){
            runtime!!.registerJavaMethod(this, "sendMessage","sendJSCMessage", arrayOf<Class<*>>(Int::class.java, String::class.java, String::class.java))
        }
    }

    override fun onBind(intent: Intent?): IBinder? {
        val bind = piv8Bind()
        return bind
    }

    override fun onDestroy() {
        runtime?.close()
        super.onDestroy()
    }


    //===================private==============
    fun sendMessage(statuCode: Int, webViewName: String, message: String){
        if (webViewName == "all"){
            for (key in callBackManager.keys){
                val cb = callBackManager[key]
                cb!!.sendMessage(statuCode, message)
            }
        }else{
            if (webViewName in callBackManager.keys){
                val cb = callBackManager[webViewName]
                cb!!.sendMessage(statuCode, message)
            }
        }
    }


    private fun postMessage(webViewName: String?, message: String?){
        if (message != null){
            try {
                runtime?.executeVoidScript(message)
            }catch (e: Exception){
                if (webViewName in callBackManager.keys){
                    callBackManager[webViewName]!!.sendMessage(400, "there is a error hapened")
                }
            }
        }

    }

    inner class piv8Bind(): piservice.Stub(){
        override fun onMessage(webViewName: String?, callBack: piserviceCallBack?){
            if (webViewName != null && callBack != null){
                callBackManager.put(webViewName, callBack)
            }
        }

        override fun sendMessage(webViewName: String?, message: String?){
            if (webViewName != null && message != null){
                postMessage(webViewName, message)
            }
        }

        override fun unbindWebView(webViewName: String?) {
            if (webViewName in callBackManager.keys){
                callBackManager.remove(webViewName)
            }
        }
    }

}








