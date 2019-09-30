package com.high.pi_service

import android.app.Service
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.os.*
import android.util.Log

class piv8Service: Service() {

    private val callBackManager: MutableMap<String, piserviceCallBack> = mutableMapOf()
    private val actionCallBack: MutableMap<String, V8Function> = mutableMapOf()
    private var isVMReady: Boolean = false
    private var runtime: V8? = null
        get() = JSVMManager.get().getRuntime()

    //================life=========
    override fun onCreate() {
        super.onCreate()
        registerBc()
        JSVMManager.get().createV8(this)
    }

    override fun onBind(intent: Intent?): IBinder? {
        val bind = piv8Bind()
        return bind
    }

    override fun onDestroy() {
        for (key in actionCallBack.keys){
            val cb = actionCallBack[key]
            if (!cb!!.isReleased){
                actionCallBack.remove(key)
                cb.close()
            }
        }
        JSVMManager.get().vmBridge!!.onDestroy()
        runtime?.close()
        unregisterReceiver(mBroadcastReceiver)
        super.onDestroy()
    }


    //===================private==============
    private fun registerBc() {
        val intentFilter = IntentFilter()
        intentFilter.addAction("")
        registerReceiver(mBroadcastReceiver, intentFilter)
    }

    fun vmReady(){
        Log.d("piservice","this vm is ready")
        isVMReady = true
    }

    fun sendMessage(statuCode: Int, webViewName: String, message: String){
        Log.d("piservice","$statuCode ========= $webViewName ======== $message")
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

        Log.d("piservice","$webViewName ============ $message")
        if (message != null && isVMReady == true){
            try {
                Handler(Looper.getMainLooper()).post {
                    runtime?.executeVoidScript(message)
                }
            }catch (e: Exception){
                if (webViewName in callBackManager.keys){
                    callBackManager[webViewName]!!.sendMessage(400, "there is a error hapened")
                }
            }
        }

    }

    //游戏内界面
    fun goChareActivity(balance: Int){
        val intent = Intent("com.high.ydzm.gameView.ChargeActivity")
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        intent.putExtra("balance",balance)
        startActivity(intent)
    }

    fun goChareInGameActivity(orderId: String, kupayId: String, balance: Int, seller: String, price: String, pay: Int){
        val intent = Intent("com.high.ydzm.gameView.ChargeInGameActivity")
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        intent.putExtra("orderId",orderId)
        intent.putExtra("kupayId",kupayId)
        intent.putExtra("balance",balance)
        intent.putExtra("seller",seller)
        intent.putExtra("price",price)
        intent.putExtra("pay",pay)
        startActivity(intent)
    }

    fun goShare(imageName: String, userName: String, shareCode: String, shareUrl: String, callBack: V8Function){
        val intent = Intent("com.high.ydzm.gameView.ShareActivity")
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        intent.putExtra("nickname",userName)
        intent.putExtra("codeURL",shareUrl)
        intent.putExtra("code",shareCode)
        intent.putExtra("imageName",imageName)
        startActivity(intent)
    }

    fun addActionListener(type: String, callBack: V8Function){
        val cb = callBack.twin()
        actionCallBack.put(type, cb)
    }

    fun goWXPay(app_id: String, partnerid: String, prepayid: String, packages: String, noncestr: String, timestamp: String, sign: String, callBack: V8Function){
        val cb = callBack.twin()
        actionCallBack.put("wx_pay_action", cb)
        val intent = Intent("start_wx_pay_action")
        intent.putExtra("app_id",app_id)
        intent.putExtra("partnerid",partnerid)
        intent.putExtra("prepayid",prepayid)
        intent.putExtra("packages",packages)
        intent.putExtra("noncestr",noncestr)
        intent.putExtra("timestamp",timestamp)
        intent.putExtra("sign",sign)
        sendBroadcast(intent)

    }

    fun goAliPay(payInfo: String, callBack: V8Function){
        val cb = callBack.twin()
        actionCallBack.put("ali_pay_action", cb)
        val intent = Intent("start_ali_pay_action")
        intent.putExtra("payInfo",payInfo)
        sendBroadcast(intent)
    }

    private val mBroadcastReceiver = object : BroadcastReceiver(){
        override fun onReceive(context: Context?, intent: Intent?) {
            val action = intent?.action ?: return
            when(action){
                "outpay_action" -> {
                    val way = intent.getStringExtra("pay_way")
                    val payAmount = intent.getIntExtra("payAmount",0)
                    if (action in actionCallBack.keys){
                        val cb = actionCallBack[action]
                        if (!cb!!.isReleased){
                            val arr = V8Array(runtime)
                            arr.push(way)
                            arr.push(payAmount)
                            cb.call(null, arr)
                            arr.close()
                        }
                    }
                }
                "inpay_action" -> {
                    val way = intent.getStringExtra("pay_way")
                    val payAmount = intent.getIntExtra("payAmount",0)
                    val orderId = intent.getIntExtra("orderId",0)
                    if (action in actionCallBack.keys){
                        val cb = actionCallBack[action]
                        if (!cb!!.isReleased){
                            val arr = V8Array(runtime)
                            arr.push(orderId)
                            arr.push(way)
                            arr.push(payAmount)
                            cb.call(null, arr)
                            arr.close()
                        }
                    }
                }
                "share_action" -> {
                    val result = intent.getIntExtra("ruselt", 0)
                    if (action in actionCallBack.keys){
                        val cb = actionCallBack[action]
                        if (!cb!!.isReleased){
                            val arr = V8Array(runtime)
                            arr.push(result)
                            cb.call(null, arr)
                            arr.close()
                        }
                    }
                }
                "wx_pay_action" -> {
                    val result = intent.getIntExtra("ruselt", 0)
                    if (action in actionCallBack.keys){
                        val cb = actionCallBack[action]
                        if (!cb!!.isReleased){
                            val arr = V8Array(runtime)
                            arr.push(result)
                            cb.call(null, arr)
                            actionCallBack.remove(action)
                            cb.close()
                            arr.close()
                        }
                    }
                }
                "ali_pay_action" -> {
                    val result = intent.getIntExtra("ruselt", 0)
                    if (action in actionCallBack.keys){
                        val cb = actionCallBack[action]
                        if (!cb!!.isReleased){
                            val arr = V8Array(runtime)
                            arr.push(result)
                            cb.call(null, arr)
                            actionCallBack.remove(action)
                            cb.close()
                            arr.close()
                        }
                    }
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








