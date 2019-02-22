package com.kuplay.pi_module.ADList

import android.app.Activity
import com.kuplay.pi_framework.webview.YNWebView

abstract class BaseAD(ynWebView: YNWebView) {
    var ctx: Activity? = null
    var yn: YNWebView? = null
    var webView: Any? = null
    init {
        yn = ynWebView
        ctx = ynWebView.getEnv(ynWebView.ACTIVITY) as Activity
        webView = ynWebView.getEnv(ynWebView.WEBVIEW)
    }
    lateinit var callBack: (callType: Int, prames: Array<Any>)->Unit
}