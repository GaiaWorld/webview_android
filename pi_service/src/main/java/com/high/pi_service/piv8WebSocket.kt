package com.high.pi_service

import android.os.Handler
import android.os.Looper
import android.util.Base64
import android.util.Log
import okhttp3.*
import okio.ByteString

class piv8WebSocket(private val v8: V8){

    var i = 0
    val managerWebSocket = HashMap<String, WebSocket>()
    val managerIsopen = HashMap<WebSocket, String>()
    val managerIsfail = HashMap<WebSocket, String>()
    val managerOpen = HashMap<String, V8Function>()
    val managerMesg = HashMap<String, V8Function>()
    val managerClose = HashMap<String, V8Function>()
    val managerFailed = HashMap<String, V8Function>()
    var mainHandler = Handler(Looper.getMainLooper())

    fun startWebSocket(url: String) : String{
        val okHttpClient = OkHttpClient.Builder().build()
        val request = Request.Builder().url(url).build()
        i += 1
        val ws = okHttpClient.newWebSocket(request, object : WebSocketListener(){
            override fun onOpen(webSocket: WebSocket?, response: Response?) {
                super.onOpen(webSocket, response)
                managerIsopen.set(webSocket!!,1.toString())
                if (getId(webSocket) != ""){
                    Log.d("piv8","webSocket onopen")
                    val id = getId(webSocket)
                    mainHandler.post { val callBack = managerOpen.get(id); callBack!!.call(null, null); callBack.close(); managerOpen.remove(id) }
                }
            }
            override fun onMessage(webSocket: WebSocket?, bytes: ByteString?) {
                super.onMessage(webSocket, bytes)
                if (getId(webSocket!!) != ""){
                    Log.d("piv8","webSocket onmessage: $bytes")
                    val id = getId(webSocket)
                    val s = bytes!!.base64()
                    mainHandler.post { val arr = V8Array(v8); arr.push(s);val callBack = managerMesg.get(id); callBack!!.call(null, arr); arr.close(); }
                }
            }
            override fun onMessage(webSocket: WebSocket?, text: String?) {
                super.onMessage(webSocket, text)
                if (getId(webSocket!!) != "") {
                    Log.d("piv8","webSocket onmessage $text")
                    val id = getId(webSocket)
                    mainHandler.post { val arr = V8Array(v8); arr.push(text!!); val callBack = managerMesg.get(id); callBack!!.call(null, arr); arr.close(); }
                }
            }
            override fun onClosed(webSocket: WebSocket?, code: Int, reason: String?) {
                if (getId(webSocket!!) != ""){
                    Log.d("piv8","webSocket close")
                    val id = getId(webSocket)
                    mainHandler.post { val arr = V8Array(v8); arr.push(code); arr.push(reason); val callBack = managerClose.get(id); callBack!!.call(null, arr); callBack.close(); arr.close(); managerClose.remove(id); val msgCallBack = managerMesg.get(id); msgCallBack!!.close(); managerMesg.remove(id) }
                }
                super.onClosed(webSocket, code, reason)
            }
            override fun onFailure(webSocket: WebSocket?, t: Throwable?, response: Response?) {
                Log.d("piv8","webSocket failure with : ${t!!.message}")
                managerIsfail.set(webSocket!!,1.toString())
                if (getId(webSocket) != "" && managerFailed.get(getId(webSocket)) != null){
                    var str = "{\"code\":\"-1\",\"result\":\"this webSocket error\"}"
                    val id = getId(webSocket)
                    mainHandler.post { val arr = V8Array(v8); arr.push(str); val callBack = managerFailed.get(id); callBack!!.call(null, arr); callBack.close(); arr.close(); managerFailed.remove(id) }
                }
                super.onFailure(webSocket, t, response)
            }

        })
        managerWebSocket.set(i.toString(),ws)
        managerIsopen.set(ws,0.toString())
        managerIsfail.set(ws,0.toString())
        return i.toString()
    }

    fun onOpen(wId: String, callBack: V8Function){
        Log.d("piv8","onOpen listenner")
        val func = callBack.twin()
        val ws = managerWebSocket.get(wId)
        if (managerIsopen.get(ws!!)!!.toInt() == 1) {
            val handler = Handler()
            val runnable = Runnable {
                mainHandler.post { func.call(null, null); func.close() }
            }
            handler.post(runnable)
        }else{
            managerOpen.set(wId,func)
        }

    }

    fun onFail(wId: String, callBack: V8Function){
        Log.d("piv8","onFail listenner")
        val ws = managerWebSocket.get(wId)
        if (managerIsfail.get(ws!!)!!.toInt() == 1){
            mainHandler.post { callBack.call(null, null) }
        }else{
            val func = callBack.twin()
            managerFailed.set(wId,func)
        }
    }

    fun onMessage(wId: String, callBack: V8Function){
        Log.d("piv8","onMessage listenner")
        val func = callBack.twin()
        managerMesg.set(wId,func)
    }

    fun onClose(wId: String, callBack: V8Function){
        Log.d("piv8","onClose listenner")
        val func = callBack.twin()
        managerClose.set(wId,func)
    }



    fun sendMsg(wId: String,  data: String, type: String){
        Log.d("piv8","sendMessage to service with $type ======== $data")
        val w = managerWebSocket.get(wId)
        if (type == "bin"){
            val base64 = Base64.decode(data,Base64.NO_WRAP)
            w!!.send(ByteString.of(base64, 0, base64.size))
        }else{
            w!!.send(data)
        }
    }

    fun close(wId: String){
        val w = managerWebSocket.get(wId)
        w!!.close(1000,"")
    }

    private fun getId(webSocket: WebSocket) : String {
        val iter = managerWebSocket.keys.iterator()
        while (iter.hasNext()) {
            val key = iter.next()
            val target = managerWebSocket[key]
            if (target === webSocket) {
                return key
            }
        }
        return ""
    }

}