package com.high.pi_framework.base


import java.util.HashMap

abstract class BaseWebView :BaseActivity() {

        override fun onDestroy() {
            ynWebView.destroyYnWebView()
            ynWebView.webViewToNull()
            super.onDestroy()
        }

        protected fun addJEV(activity: BaseActivity) {
            ynWebView.setEnv(ynWebView.CONTEXT, activity)
            ynWebView.setEnv(ynWebView.ACTIVITY, activity)
            ynWebView.setJEN()
        }

        protected fun loadUrl(url: String) {
            val extraHeaders = HashMap<String, String>()
            extraHeaders["Referer"] = url
            ynWebView.loadURL(url,extraHeaders)
        }

        protected fun loadDataWithBaseUrl(url: String, content: String) {
            ynWebView.loadDataWithBaseUrl(url,content)
        }

}