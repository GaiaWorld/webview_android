package com.high.pi_module

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.util.Log
import com.high.pi_framework.base.BaseJSModule
import com.high.pi_framework.webview.YNWebView
import com.high.pi_module.ADList.GDT.Constants
import com.high.pi_module.Util.WXLoinContants
import com.tencent.mm.opensdk.constants.ConstantsAPI
import com.tencent.mm.opensdk.modelmsg.SendAuth
import com.tencent.mm.opensdk.modelpay.PayReq
import com.tencent.mm.opensdk.openapi.IWXAPI
import com.tencent.mm.opensdk.openapi.WXAPIFactory

class WeChatLogin(ynWebView: YNWebView): BaseJSModule(ynWebView) {
    private val TAG = "WeChatLogin"
    private var api: IWXAPI? = null
    private val mReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context?, intent: Intent?) {
            val action = intent?.action ?: return
            when (action) {
                "wx_code_get" -> {
                    val code = intent.getStringExtra("code")
                    val ruselt = intent.getIntExtra("ruselt",0)
                    val state = intent.getStringExtra("state")
                    ctx!!.runOnUiThread { callBack(BaseJSModule.SUCCESS, arrayOf(ruselt, code, state)) }
                }
                "wx_pay_action" -> {
                    val ruselt = intent.getIntExtra("ruselt",0)
                    ctx!!.runOnUiThread { callBack(BaseJSModule.SUCCESS, arrayOf(ruselt)) }
                }
            }
        }
    }

    private val wxReceiver = object : BroadcastReceiver(){
        override fun onReceive(context: Context?, intent: Intent?) {
            api!!.registerApp(Constants.APPID)
        }
    }


    init {
        val intentFilter = IntentFilter()
        intentFilter.addAction("wx_code_get")
        intentFilter.addAction("wx_pay_action")
        ctx!!.registerReceiver(mReceiver, intentFilter)
    }


    fun regToWx(app_id: String,callBack:(callType: Int, prames: Array<Any>)->Unit) {
        WXLoinContants.app_id = app_id
        // 通过WXAPIFactory工厂，获取IWXAPI的实例
        api = WXAPIFactory.createWXAPI(ctx!!, app_id, true)

        // 将应用的appId注册到微信
        api!!.registerApp(app_id)

        //建议动态监听微信启动广播进行注册到微信
        ctx!!.registerReceiver(wxReceiver, IntentFilter(ConstantsAPI.ACTION_REFRESH_WXAPP))
    }

    fun getCodeFromWX(scope: String, state: String, callBack:(callType: Int, prames: Array<Any>)->Unit){
        //获取微信访问Token
        this.callBack = callBack
        if (!api!!.isWXAppInstalled){
            callBack(BaseJSModule.SUCCESS, arrayOf(-7))
        }else{
            val req = SendAuth.Req()
            req.scope = scope
            req.state = state
            api!!.sendReq(req)
        }
    }

    fun goWXPay(app_id: String, partnerid: String, prepayid: String, packages: String, noncestr: String, timestamp: String, sign: String, callBack: (callType: Int, prames: Array<Any>) -> Unit){
        this.callBack = callBack
        if (!api!!.isWXAppInstalled){
            callBack(BaseJSModule.SUCCESS, arrayOf(-7))
        }else{
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
    }


    override fun onDestroy() {
        Log.d("destroy","wechatLogin")
        ctx!!.unregisterReceiver(wxReceiver)
        ctx!!.unregisterReceiver(mReceiver)
        super.onDestroy()
    }

}