package com.high.pi_module

import android.annotation.SuppressLint
import android.os.Handler
import android.os.Message
import android.text.TextUtils
import com.high.pi_framework.base.BaseJSModule
import com.high.pi_framework.webview.YNWebView
import com.alipay.sdk.app.PayTask
import com.high.pi_module.Util.PayResult


class AliPay(ynWebView: YNWebView): BaseJSModule(ynWebView) {
    private val SDK_PAY_FLAG = 1
    private val mHandler = @SuppressLint("HandlerLeak")
    object : Handler() {
        override fun handleMessage(msg: Message?) {
            super.handleMessage(msg)
            when(msg!!.what){
                SDK_PAY_FLAG -> {
                    val payResult = PayResult(msg.obj as Map<String, String>)
                    /**
                     * 对于支付结果，请商户依赖服务端的异步通知结果。同步通知结果，仅作为支付结束的通知。
                     */
                    val resultInfo = payResult.result// 同步返回需要验证的信息
                    val resultStatus = payResult.resultStatus
                    if (TextUtils.equals(resultStatus, "9000")){
                        callBack(BaseJSModule.SUCCESS, arrayOf(0))
                    }else if (TextUtils.equals(resultStatus, "6001")){
                        callBack(BaseJSModule.SUCCESS, arrayOf(-2))
                    }else{
                        callBack(BaseJSModule.SUCCESS, arrayOf(-1))
                    }
                }
            }

        }
    }


    fun goAliPay(orderInfo: String, callBack:(callType: Int, prames: Array<Any>)->Unit){
        this.callBack = callBack
        val payRunnable = Runnable {
            val alipay = PayTask(ctx!!)
            val result = alipay.payV2(orderInfo, true)

            val msg = Message()
            msg.what = SDK_PAY_FLAG
            msg.obj = result
            mHandler.sendMessage(msg)
        }
        // 必须异步调用
        val payThread = Thread(payRunnable)
        payThread.start()
    }




}

