package com.kuplay.pi_framework.Util

import android.content.Context
import android.webkit.WebView
import com.kuplay.pi_framework.R

object WebViewUtil {

    private val SPLIT_MARK = "chrome/"//split the version by this mark

    /**
     * Get the version of the Android's WebView.
     *
     * @param webView Android's webView.
     * @return The version code of the Android's WebView.
     */
    private fun getWebViewVersionCode(webView: WebView): Int {
        try {
            val userAgentString = webView.settings.userAgentString
            val spArr =
                userAgentString.toLowerCase().split(SPLIT_MARK.toRegex()).dropLastWhile { it.isEmpty() }.toTypedArray()
            val strVersion = spArr[spArr.size - 1]
            val result = strVersion.substring(0, strVersion.indexOf("."))
            return Integer.parseInt(result)
        } catch (e: Exception) {
            e.printStackTrace()
        }

        return 0
    }

    /**
     * Should use Android's WebView.
     *
     * @param ctx Context
     * @return 1、true : Will use the Android's WebView. 2、false : Use the X5 Chrome instead of Android's WebView.
     */
    fun shouldUseAndroidWebView(webView: WebView, ctx: Context): Boolean {
        val wbCode = getWebViewVersionCode(webView)//get the version of webView
        val minCode = ctx.getString(R.string.compile_web_view_version_code)
        //If this webView's version code is letter than value from config
        //The app will use the Android WebView,else use X5
        return wbCode >= Integer.parseInt(minCode)
    }

}