package com.kuplay.pi_framework.piv8

import android.annotation.SuppressLint
import android.app.Activity
import android.content.Context
import android.os.Handler
import android.os.Looper
import android.util.Log
import com.kuplay.pi_framework.framework.CallJSRunnable
import com.kuplay.pi_framework.module.StageUtils
import com.kuplay.pi_framework.piv8.utils.DataHandleManager
import com.kuplay.pi_framework.webview.YNWebView
import java.io.BufferedReader
import java.io.InputStreamReader
import java.security.SecureRandom

class JSVMManager constructor(){

    private var runtime: V8? = null
    private var ctx: Context? = null

    fun createV8(context: Context):V8{

        val logCallBack = JavaVoidCallback { receiver, parameters ->
            var log = ""
            for (i in 0 until parameters.length()) {
                val x = parameters.get(i)
                log += x.toString()
                if (x is Releasable) x.close()
            }
            Log.d("piv8","javascript打印=$log")
        }


        this.ctx = context
        runtime = V8.createV8Runtime("window")
        val v8Console = V8Object(runtime)
        val v8DataHandle = V8Object(runtime)
        runtime!!.add("piv8DHManager",v8DataHandle)
        runtime!!.add("console",v8Console)
        v8Console.registerJavaMethod(logCallBack,"log")
        val vmBridge = VMBridge(runtime)
        val piv8timer = piv8Timer()
        val piv8dataHandle = DataHandleManager
        piv8dataHandle.setV8(runtime!!)
        val piv8http = piv8Http(runtime!!)
        val piv8ws = piv8WebSocket(runtime!!)
        val piv8db = piv8DB(ctx!!,runtime!!)
        val bootManager = PiV8JsBootManager(ctx!!,runtime!!)
        runtime!!.executeVoidScript("var JSVM = {};var piv8WebSocket = {};JSVM.store = {};JSVM.Boot = {};")
        val jsWS = runtime!!.getObject("piv8WebSocket")
        val jsvm = runtime!!.getObject("JSVM")
        val store = jsvm.getObject("store")
        val boot = jsvm.getObject("Boot")
        v8DataHandle.registerJavaMethod(piv8dataHandle,"createNewDataHandle", "createNewDataHandle" , arrayOf())
        v8DataHandle.registerJavaMethod(piv8dataHandle,"getContent", "getContent" , arrayOf<Class<*>>(Int::class.java))
        v8DataHandle.registerJavaMethod(piv8dataHandle,"runScript", "runScript" , arrayOf<Class<*>>(Int::class.java))
        v8DataHandle.registerJavaMethod(piv8dataHandle,"setContent", "setContent" , arrayOf<Class<*>>(Int::class.java, String::class.java, String::class.java))
        jsvm.registerJavaMethod(vmBridge,"postMessage","messageReciver", arrayOf<Class<*>>(Array<Any>::class.java))
        jsvm.registerJavaMethod(this,"getRandomValues","getRandomValues", arrayOf())
        jsvm.registerJavaMethod(this,"getReady","getReady", arrayOf<Class<*>>(String::class.java))
        jsvm.registerJavaMethod(this,"postMessage","postMessage", arrayOf<Class<*>>(String::class.java, String::class.java))
        jsvm.registerJavaMethod(piv8http, "request", "request", arrayOf<Class<*>>(String::class.java,String::class.java,String::class.java,String::class.java,String::class.java,String::class.java,V8Function::class.java,V8Function::class.java,V8Function::class.java))
        jsWS.registerJavaMethod(piv8ws, "startWebSocket", "startWebSocket", arrayOf<Class<*>>(String::class.java))
        jsWS.registerJavaMethod(piv8ws, "onOpen", "onOpen", arrayOf<Class<*>>(String::class.java,V8Function::class.java))
        jsWS.registerJavaMethod(piv8ws, "onFail", "onFail", arrayOf<Class<*>>(String::class.java,V8Function::class.java))
        jsWS.registerJavaMethod(piv8ws, "onMessage", "onMessage", arrayOf<Class<*>>(String::class.java,V8Function::class.java))
        jsWS.registerJavaMethod(piv8ws, "onClose", "onClose", arrayOf<Class<*>>(String::class.java,V8Function::class.java))
        jsWS.registerJavaMethod(piv8ws, "close", "close", arrayOf<Class<*>>(String::class.java))
        jsWS.registerJavaMethod(piv8ws, "sendMsg", "sendMsg", arrayOf<Class<*>>(String::class.java,String::class.java,String::class.java))
        runtime!!.registerJavaMethod(piv8timer, "setTimeout", "setTimeout", arrayOf<Class<*>>(V8Function::class.java,Int::class.java))
        runtime!!.registerJavaMethod(piv8timer, "clearTimeout", "clearTimeout", arrayOf<Class<*>>(Int::class.java))
        runtime!!.registerJavaMethod(piv8timer, "setInterval", "setInterval", arrayOf<Class<*>>(V8Function::class.java,Int::class.java))
        store.registerJavaMethod(piv8db,"create","create",arrayOf<Class<*>>(String::class.java,V8Function::class.java,V8Function::class.java,V8Function::class.java))
        store.registerJavaMethod(piv8db,"delete","delete",arrayOf<Class<*>>(String::class.java,V8Function::class.java,V8Function::class.java,V8Function::class.java))
        store.registerJavaMethod(piv8db,"iterate","iterate",arrayOf<Class<*>>(String::class.java,V8Function::class.java,V8Function::class.java,V8Function::class.java))
        store.registerJavaMethod(piv8db,"read","read",arrayOf<Class<*>>(String::class.java,String::class.java,V8Function::class.java,V8Function::class.java,V8Function::class.java))
        store.registerJavaMethod(piv8db,"remove","remove",arrayOf<Class<*>>(String::class.java,String::class.java,V8Function::class.java,V8Function::class.java,V8Function::class.java))
        store.registerJavaMethod(piv8db,"write","write",arrayOf<Class<*>>(String::class.java,String::class.java,String::class.java,V8Function::class.java,V8Function::class.java,V8Function::class.java))
        boot.registerJavaMethod(bootManager, "saveFile", "saveFile", arrayOf(String::class.java, String::class.java, V8Function::class.java))
        boot.registerJavaMethod(bootManager, "getBootFiles", "getBootFiles", arrayOf(V8Function::class.java))
        boot.registerJavaMethod(bootManager, "restartJSVM", "restartJSVM", arrayOf())

        val base64js = getLocalJSScript("base64js.min.js")
        runtime!!.executeScript(base64js!!,"base64js.min.js",0)

        val globaljs = getLocalJSScript("globalValue.js")
        runtime!!.executeScript(globaljs!!,"globalValue.js",0)

        val envjs = getLocalJSScript("env.js")
        runtime!!.executeScript(envjs!!,"env.js",0)

        val dhManagerjs = getLocalJSScript("piv8DHManager.js")
        runtime!!.executeScript(dhManagerjs!!,"piv8DHManager.js",0)

        val cryptojs = getLocalJSScript("crypto.js")
        runtime!!.executeScript(cryptojs!!,"crypto.js",0)

        runtime?.startDebugger()

        v8Console.close()
        jsWS.close()
        boot.close()
        store.close()
        jsvm.close()

        return runtime!!
    }

    fun restartJSVM(){
        runtime = null
        createV8(ctx!!)
    }

    fun postMessage(webName: String, message: String){
        val ynWebView = YNWebView.getYNWebView(webName)
        val fullCode: String = "window['onWebViewPostMessage']('JSVM', '"+ message + "')"
        (ynWebView!!.getEnv(ynWebView!!.ACTIVITY) as Activity).runOnUiThread { CallJSRunnable(fullCode, ynWebView.getWeb("")) }
    }

    fun getReady(stage: String){
        val b = StageUtils.makeStages(stage,"JSVM")
        if (b){
            val fullCode = "window['onLoadTranslation']('" + stage + "')"
            Handler(Looper.getMainLooper()).post {
                CallJSRunnable(fullCode, YNWebView.getYNWebView("default")!!.getWeb(""))
            }
            runtime!!.executeVoidScript(fullCode)
        }
    }

    fun getDownRead(filePath: String, fileName: String, okCB: V8Function, errCB: V8Function){
        val ok = okCB.twin()
        val err = errCB.twin()
        val handler = Handler()
        handler.post {
            val fileString = getLocalJSScript(filePath)
            if (fileString == null){
                Handler(Looper.getMainLooper()).post {
                    val arr = V8Array(runtime!!); arr.push("can not find"); err.call(null,arr); arr.close(); err.close();ok.close();
                }
            }
            val dh = DataHandleManager.createNewDataHandle()
            DataHandleManager.setContent(dh,fileString!!,fileName)
            Handler(Looper.getMainLooper()).post {
                val arr = V8Array(runtime!!); arr.push(dh); ok.call(null,arr); arr.close(); err.close();ok.close();
            }
        }
    }


    fun getRandomValues():Int{
        val sercurirandom = SecureRandom()
        val bytes = ByteArray(4)
        sercurirandom.nextBytes(bytes)
        val results = bytes.getUIntAt(0).toInt()
        return results
    }

    fun ByteArray.getUIntAt(idx: Int) =
        ((this[3].toInt() and 0xFF) shl 24 or (this[2].toInt() and 0xFF) shl 16 or (this[1].toInt() and 0xFF) shl 8 or (this[0].toInt() and 0xFF)).toLong()

    private fun getLocalJSScript(fileName: String): String? {
        try {
            val temp = ctx!!.getAssets().open(fileName)
            val br = BufferedReader(InputStreamReader(temp))
            val sb = StringBuffer()
            var strLine = br.readLine()
            while (strLine  != null) {
                sb.append(strLine).append("\r\n")
                strLine = br.readLine()
            }
            br.close()
            return sb.toString()
        } catch (e: Exception) {
            e.printStackTrace()
        }

        return null
    }


    companion object {
        @SuppressLint("StaticFieldLeak")
        private var instance: JSVMManager? = null
            get() {
                if (field == null) {
                    field = JSVMManager()
                }
                return field
            }
        @Synchronized
        fun get(): JSVMManager{
            return instance!!
        }
    }

}