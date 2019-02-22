package com.kuplay.pi_framework.base


import java.util.HashMap

abstract class BaseWebView :BaseActivity() {

        override fun onDestroy() {
            super.onDestroy()
            ynWebView.destroyYnWebView()
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