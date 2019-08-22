package com.kuplay.pi_framework.module

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.os.Handler
import android.os.Looper
import com.kuplay.pi_framework.piv8.V8
import com.kuplay.pi_framework.piv8.V8Array
import com.kuplay.pi_framework.piv8.V8Function
import com.tencent.mm.opensdk.modelpay.PayReq
import com.tencent.mm.opensdk.openapi.IWXAPI

class WeChatPay(private val ctx: Context,private val runtime:V8){

    private val TAG = "WeChatPay"
    private var callBack: V8Function? = null
    private var api: IWXAPI? = null
    private val mReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context?, intent: Intent?) {
            val action = intent?.action ?: return
            when (action) {
                "wx_pay_action" -> {
                    val ruselt = intent.getIntExtra("ruselt",0)
                    if (callBack != null){
                        if(!callBack!!.isReleased){
                            Handler(Looper.getMainLooper()).post {
                                val array = V8Array(runtime)
                                array.push(ruselt)
                                callBack!!.call(null, array)
                                array.close()
                                callBack!!.close()
                            }
                        }
                    }
                }
            }
        }
    }


    init {
        val intentFilter = IntentFilter()
        intentFilter.addAction("wx_pay_action")
        ctx.registerReceiver(mReceiver, intentFilter)
    }

    fun goWXPay(app_id: String, partnerid: String, prepayid: String, packages: String, noncestr: String, timestamp: String, sign: String, callBack: V8Function){
        this.callBack = callBack.twin()
        val req = PayReq()
        req.appId = app_id
        req.partnerId = partnerid
        req.prepayId= prepayid
        req.packageValue = packages
        req.nonceStr= noncestr
        req.timeStamp= timestamp
        req.sign= sign
        api!!.sendReq(req)
    }

    fun unregisterReceiver(){
        ctx.unregisterReceiver(mReceiver)
    }

}