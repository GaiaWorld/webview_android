package com.kuplay.pi_framework.piv8

import android.app.Service
import android.content.Intent
import android.os.*
import android.util.Log


class piv8Service: Service() {

    private var runtime: V8? = null
        get() = JSVMManager.get().getRuntime()

    override fun onCreate() {
        super.onCreate()
        JSVMManager.get().createV8(this)
    }

    /**
     * runCode:
     */
    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        if (intent == null){
            return super.onStartCommand(intent, flags, startId)
        }
        val bundle = intent!!.getExtras()
        if (bundle != null){
            val code = bundle.getInt(serviceRunCode.key,0)
            when(code){
                serviceRunCode.runScript -> {
                    val scriptString = bundle.getString(serviceRunCode.scriptKey)
                    if (scriptString != null){
                        Handler(Looper.getMainLooper()).post {
                            try{
                                runtime!!.executeVoidScript(scriptString)
                            }catch (e: Exception){
                                Log.e("piv8",e.toString())
                            }
                        }
                    }
                }
                serviceRunCode.sendMessage -> {
                    val messageKey = bundle.getString(serviceRunCode.messageKey)
                    if (messageKey != null){
                        JSVMManager.get().distributionMessage(messageKey,bundle)
                    }
                }
            }

        }
        return super.onStartCommand(intent, flags, startId)
    }


    override fun onDestroy() {
        runtime?.close()
        super.onDestroy()
    }


    override fun onBind(intent: Intent?): IBinder? {
        return null
    }

}








