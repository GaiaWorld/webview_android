package com.kuplay.pi_framework.module

import android.app.Activity
import android.content.Context
import android.content.Intent
import android.text.TextUtils
import com.kuplay.pi_framework.Util.ViewUtil
import com.kuplay.pi_framework.base.BaseJSModule
import com.kuplay.pi_framework.framework.NewWebViewActivity
import com.kuplay.pi_framework.webview.YNWebView
import org.json.JSONObject
import java.io.BufferedWriter
import java.io.File
import java.io.FileWriter
import java.io.IOException
import java.util.HashMap

internal class FreeWebView(private val view: Any) : Runnable {
    override fun run() {
        YNWebView.destroyWebView(view)
    }
}

internal class NewWebView(private val context: Context, private val webViewName: String, private val url: String, private val headers: Map<*, *>) : Runnable {

    override fun run() {
        WebViewManager.addWebView(this.webViewName, YNWebView.createWebView(context,url,headers))
    }
}

/**
 * Created by iqosjay@gmail.com on 2018/11/7
 */
class WebViewManager constructor(ynWebView: YNWebView) : BaseJSModule(ynWebView) {



    /**
     * Get the webView's name by webView.
     *
     * @return The name of webView.
     */
    private val nameByWebViewObj: String?
        get() {
            val obj = yn.getEnv(yn.WEBVIEW)
            val entries = WEB_VIEW_FORM.entries
            for ((key, value) in entries) {
                if (obj == value) {
                    return key
                }
            }
            return null
        }

    /**
     * 新开webview，但不显示出来
     * @param callbackId
     * @param webViewName
     * @param url
     * @param headers，以 key1:value1 key2:value2 方式传递
     */
    fun newView(webViewName: String, url: String, headers: String, callBack:(callType: Int, prames: Array<Any>)->Unit) {

        if (TextUtils.isEmpty(webViewName)) {
            callBack(BaseJSModule.FAIL, arrayOf("The WebView's name can't be null."))
            return
        }

        if (TextUtils.isEmpty(url)) {
            callBack(BaseJSModule.FAIL, arrayOf("The url can't be null."))
            return
        }

        if (isWebViewNameExists(webViewName)) {
            callBack(BaseJSModule.FAIL, arrayOf("WebView name is exist."))
            return
        }

        val extraHeaders = mutableMapOf<Any, Any>()
        try {
            val obj = JSONObject(headers)
            val keysItr = obj.keys()
            while (keysItr.hasNext()) {
                val key = keysItr.next()
                extraHeaders.put(key, obj.getString(key))
            }
        } catch (e: Exception) {

        }
        val activity = yn.getEnv(yn.ACTIVITY) as Activity
        activity.runOnUiThread(NewWebView(activity.applicationContext, webViewName, url, extraHeaders))
        callBack(BaseJSModule.SUCCESS, arrayOf(""))
    }

    fun freeView(webViewName: String,callBack:(callType: Int, prames: Array<Any>)->Unit) {
        try {
            if ("default" == webViewName) {
                callBack(BaseJSModule.FAIL, arrayOf("The default WebView couldn't remove,please select a new one."))
                return
            }

            if (!isWebViewNameExists(webViewName)) {
                return
            }

            val view = WebViewManager.getWebView(webViewName)
            val activity = yn.getEnv(yn.ACTIVITY) as Activity
            activity.runOnUiThread(FreeWebView(view!!))
            WebViewManager.removeWebView(webViewName)
        } catch (e: Exception) {
            e.printStackTrace()
        }
        callBack(BaseJSModule.SUCCESS, arrayOf(""))
    }

    /**
     * Open a new WebView to display a web page.
     *
     * @param callbackId  TS callbackId.
     * @param webViewName This is both name and key for the new webView,
     * you could called[.closeWebView] with this key
     * after opened the webView.
     * @param url         The web page's url.
     * @param title       The title what would you like to show in the new View.
     */
    fun openWebView(webViewName: String, url: String, title: String, injectContent: String, callBack:(callType: Int, prames: Array<Any>)->Unit) {

        if (TextUtils.isEmpty(webViewName)) {
            callBack(BaseJSModule.FAIL, arrayOf("The WebView's name can't be null."))
            return
        }
        if (TextUtils.isEmpty(url)) {
            callBack(BaseJSModule.FAIL, arrayOf("The url can't be null."))
            return
        }
        if (isWebViewNameExists(webViewName)) {
            callBack(BaseJSModule.FAIL, arrayOf("WebView name is exist."))
        } else {
            val file = File(ctx!!.cacheDir, "new_webview_inject")
            try {
                val bw = BufferedWriter(FileWriter(file))
                bw.write(injectContent)
                bw.close()
            } catch (e: IOException) {
                e.printStackTrace()
            }

            val intent = Intent(ctx, NewWebViewActivity::class.java)
            intent.putExtra("inject", file.absolutePath)
            intent.putExtra("title", title)
            intent.putExtra("load_url", url)
            intent.putExtra("tag", webViewName)

            ctx!!.startActivity(intent)
        }
    }

    /**
     * Close the specified WebView.
     *
     * @param callbackId  TS callbackId.
     * @param webViewName WebView's name.
     */
    fun closeWebView(webViewName: String, callBack:(callType: Int, prames: Array<Any>)->Unit) {
        if ("default" == webViewName) {
            callBack(BaseJSModule.FAIL, arrayOf("The default WebView couldn't remove,please select a new one."))
            return
        }
        if (!isWebViewNameExists(webViewName)) {
            return
        }
        sendCloseWebViewMessage(webViewName)
    }

    /**
     * Send a message to the web page view with the specified name.
     *
     * @param webViewName The name of WebView which you want send message to.
     * @param message     The message what you would like to send.
     */
    fun postWebViewMessage(webViewName: String, message: String, callBack:(callType: Int, prames: Array<Any>)->Unit) {
        if (!isWebViewNameExists(webViewName)) {
            callBack(BaseJSModule.FAIL, arrayOf("The WebView's name is not exists."))
            return
        }
        val fromWebView = nameByWebViewObj
        val intent = Intent("send_message$webViewName")
        intent.putExtra("message", message)
        intent.putExtra("from_web_view", fromWebView)
        ctx!!.sendBroadcast(intent)
    }

    fun getScreenModify(callBack:(callType: Int, prames: Array<Any>)->Unit) {
        //ViewUtil.getNavigationBarHeight(getActivity())
        //DisplayCutout displayCutout = decorView.getRootWindowInsets().getDisplayCutout();
        val activity = yn.getEnv(yn.ACTIVITY) as Activity
        val high = ViewUtil.getStatusBarHeight(activity)
        callBack(BaseJSModule.SUCCESS, arrayOf(high,0))
    }

    /**
     * Close the WebView by webView's name.Finished by send broadcast,
     * because in this way, the coupling is the lowest.
     *
     * @param webViewName WebView's name.
     */
    private fun sendCloseWebViewMessage(webViewName: String) {
        val intent = Intent("close_web_view")
        intent.putExtra("web_view_name", webViewName)
        ctx!!.sendBroadcast(intent)
    }

    /**
     * Check whether the name of webView is exists.
     *
     * @param webViewName The name of webView
     * @return true for the name has been exists.
     */
    private fun isWebViewNameExists(webViewName: String): Boolean {
        for (key in WEB_VIEW_FORM.keys) {
            if (webViewName == key) {
                return true
            }
        }
        return false
    }

    companion object {
        /**
         * All WebViews that have been opened.
         */
        private val WEB_VIEW_FORM = HashMap<String, Any>()

        /**
         * Add WebView.
         *
         * @param key    WebView's name.
         * @param object WebView:X5 or Android
         */
        fun addWebView(key: String, `object`: Any) {
            WEB_VIEW_FORM[key] = `object`
        }

        /**
         * Remove WebView by its name.
         *
         * @param key WebView's name
         */
        fun removeWebView(key: String) {
            WEB_VIEW_FORM.remove(key)
        }

        fun getWebView(key: String): Any? {
            return WEB_VIEW_FORM[key]
        }
    }
}