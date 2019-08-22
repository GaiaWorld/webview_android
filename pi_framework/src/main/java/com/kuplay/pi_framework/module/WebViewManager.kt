package com.kuplay.pi_framework.module

import android.app.Activity
import android.content.Context
import android.content.Intent
import android.os.Handler
import android.os.Looper
import android.text.TextUtils
import android.util.Log
import com.kuplay.pi_framework.Util.FileUtil
import com.kuplay.pi_framework.Util.ViewUtil
import com.kuplay.pi_framework.base.BaseJSModule
import com.kuplay.pi_framework.framework.CallJSRunnable
import com.kuplay.pi_framework.framework.NewWebViewActivity
import com.kuplay.pi_framework.piv8.JSVMManager
import com.kuplay.pi_framework.piv8.piv8Service
import com.kuplay.pi_framework.piv8.serviceRunCode
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

internal class NewWebView(private val context: Context, private val webViewName: String, private val url: String, private val headers: Map<*, *>, private  val injectContent: String, private val ynWebView: YNWebView, private val defaultName: String) : Runnable {

    override fun run() {
        WebViewManager.addNoShowView(this.webViewName, YNWebView.createWebView(context,this.webViewName,url,headers, injectContent, ynWebView, defaultName))
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
            val obj = yn.getWeb("")
            val entries = GAME_VIEW.entries
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
    fun newView(webViewName: String, url: String, headers: String, injectContent: String ,callBack:(callType: Int, prames: Array<Any>)->Unit) {

        if (TextUtils.isEmpty(webViewName)) {
            callBack(BaseJSModule.FAIL, arrayOf("The WebViews name canot be null."))
            return
        }

        if (TextUtils.isEmpty(url)) {
            callBack(BaseJSModule.FAIL, arrayOf("The url canot be null."))
            return
        }

        if (isNoShowViewExists(webViewName)) {
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
        activity.runOnUiThread(NewWebView(activity.applicationContext, webViewName, url, extraHeaders, injectContent, yn, nameByWebViewObj!!))
        callBack(BaseJSModule.SUCCESS, arrayOf(""))
    }



    fun freeView(webViewName: String,callBack:(callType: Int, prames: Array<Any>)->Unit) {
        try {
            if ("default" == webViewName) {
                callBack(BaseJSModule.FAIL, arrayOf("The default WebView couldnot remove,please select a new one."))
                return
            }

            if (!isNoShowViewExists(webViewName)) {
                return
            }

            val view = WebViewManager.getNoShowView(webViewName)
            val activity = yn.getEnv(yn.ACTIVITY) as Activity
            activity.runOnUiThread(FreeWebView(view!!))
            WebViewManager.removeNoShowView(webViewName)
        } catch (e: Exception) {
            e.printStackTrace()
        }
        callBack(BaseJSModule.SUCCESS, arrayOf(""))
    }


    fun openWebView(webViewName: String, url: String, title: String, injectContent: String, callBack: (callType: Int, prames: Array<Any>) -> Unit){
        Log.d("z1u24", webViewName)
        if (TextUtils.isEmpty(webViewName)) {
            callBack(BaseJSModule.FAIL, arrayOf("The WebViews name can not be null."))
            return
        }
        if (TextUtils.isEmpty(url)) {
            callBack(BaseJSModule.FAIL, arrayOf("The url can not be null."))
            return
        }
        if (isGameViewExists(webViewName) && GAME_NAME == webViewName) {
            val intent = Intent(ctx, NewWebViewActivity::class.java)
            intent.putExtra("tag", webViewName)
            ctx!!.startActivity(intent)
        } else {
            if (!webViewName.equals(GAME_NAME) && isGameViewExists(GAME_NAME)){
                sendCloseWebViewMessage(GAME_NAME)
            }
            GAME_NAME = webViewName
            //注入字符串存本地文件的原因为： Android版本25一下，intent只支持500k大小的字符串
            val file = File(ctx!!.cacheDir, "new_webview_inject")
            try {

                val bw = BufferedWriter(FileWriter(file))
                bw.write(injectContent)
                bw.close()
            } catch (e: IOException) {
                e.printStackTrace()
            }
            val intent = Intent(ctx, NewWebViewActivity::class.java)
            intent.putExtra("uagent", "YINENG_ANDROID_GAME/1.0")
            intent.putExtra("inject", file.absolutePath)
            intent.putExtra("title", title)
            intent.putExtra("load_url", url)
            intent.putExtra("tag", webViewName)
            ctx!!.startActivity(intent)
        }
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
    fun openBookWebView(webViewName: String, url: String, injectContent: String, headers: String, callBack:(callType: Int, prames: Array<Any>)->Unit) {
        if (TextUtils.isEmpty(webViewName)) {
            callBack(BaseJSModule.FAIL, arrayOf("The WebViews name can not be null."))
            return
        }
        if (TextUtils.isEmpty(url)) {
            callBack(BaseJSModule.FAIL, arrayOf("The url can not be null."))
            return
        }
        else {
            if (!isNoShowViewExists(webViewName)) newView( webViewName, url, headers, injectContent, callBack )
            else callBack(BaseJSModule.FAIL, arrayOf("The WebViews name can not be null."))
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
            callBack(BaseJSModule.FAIL, arrayOf("The default WebView could not remove,please select a new one."))
            return
        }
        if (isGameViewExists(webViewName)) {
            GAME_NAME = ""
            sendCloseWebViewMessage(webViewName)
        }else if (isNoShowViewExists(webViewName)){
            freeView(webViewName, callBack)
        }else{
            return
        }
    }

    fun minWebView(webViewName: String, callBack:(callType: Int, prames: Array<Any>)->Unit) {
        if ("default" == webViewName) {
            callBack(BaseJSModule.FAIL, arrayOf("The default WebView could not remove,please select a new one."))
            return
        }
        if (!isGameViewExists(webViewName)) {
            return
        }
        sendMinSizeWebViewMessage(webViewName)
    }

    fun postWebViewMessage(webViewName: String, message: String, callBack:(callType: Int, prames: Array<Any>)->Unit) {
        if (!isGameViewExists(webViewName) && !isNoShowViewExists(webViewName)) {
            callBack(BaseJSModule.FAIL, arrayOf("The WebView's name is not exists."))
            return
        }else if(isGameViewExists(webViewName)){
            val fromWebView = nameByWebViewObj
            val intent = Intent("send_message$webViewName")
            intent.putExtra("message", message)
            intent.putExtra("rpc", "true")
            intent.putExtra("from_web_view", fromWebView)
            ctx!!.sendBroadcast(intent)
        }

    }

    /**
     * Send a message to the web page view with the specified name.
     *
     * @param webViewName The name of WebView which you want send message to.
     * @param message     The message what you would like to send.
     */
    fun postReciptMessage(webViewName: String, message: String, isRPC: String,callBack:(callType: Int, prames: Array<Any>)->Unit) {
        if (!isGameViewExists(webViewName) && !isNoShowViewExists(webViewName)) {
            callBack(BaseJSModule.FAIL, arrayOf("The WebView's name is not exists."))
            return
        }else if(isGameViewExists(webViewName)){
            val fromWebView = nameByWebViewObj
            val intent = Intent("send_message$webViewName")
            intent.putExtra("message", message)
            intent.putExtra("rpc", isRPC)
            intent.putExtra("from_web_view", fromWebView)
            ctx!!.sendBroadcast(intent)
        }else if (isNoShowViewExists(webViewName)){
            YNWebView.evaluateJavascript(ctx!!,getNoShowView(webViewName) as Any,message,isRPC,nameByWebViewObj!!)
        }

    }


    fun getScreenModify(callBack:(callType: Int, prames: Array<Any>)->Unit) {
        val activity = yn.getEnv(yn.ACTIVITY) as Activity
        val high = ViewUtil.getStatusBarHeight(activity)
        callBack(BaseJSModule.SUCCESS, arrayOf(high,0))
    }

    fun getReady(stage: String, callBack: (callType: Int, prames: Array<Any>) -> Unit){
        val fromWebView = nameByWebViewObj
        if (fromWebView!!.equals("default")){
            val b = StageUtils.makeStages(stage,"default")
            if (b){
                val fullCode = "window['onLoadTranslation']('" + stage + "')"
                ctx!!.runOnUiThread { CallJSRunnable(fullCode, yn.getWeb("")) }
                val intent = Intent(ctx!!, piv8Service::class.java)
                intent.putExtra(serviceRunCode.key,serviceRunCode.runScript)
                intent.putExtra(serviceRunCode.scriptKey,fullCode)
                ctx!!.startService(intent)
            }
        }
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


    private fun sendMinSizeWebViewMessage(webViewName: String) {
        val intent = Intent("mine_size_activity")
        intent.putExtra("web_view_name", webViewName)
        ctx!!.sendBroadcast(intent)
    }





    companion object {
        /**
         * All WebViews that have been opened.
         */
        private val NOSHOW_VIEW = HashMap<String, Any>()

        private var GAME_NAME = ""

        private var GAME_VIEW = HashMap<String, Any>()

        /**
         * Check whether the name of webView is exists.
         *
         * @param webViewName The name of webView
         * @return true for the name has been exists.
         */
        fun isGameViewExists(webViewName: String): Boolean {
            for (key in GAME_VIEW.keys) {
                if (webViewName == key) {
                    return true
                }
            }
            return false
        }

        /**
         * Add WebView.
         *
         * @param key    WebView's name.
         * @param object WebView:X5 or Android
         */
        fun addGameView(key: String, `object`: Any) {
            GAME_VIEW[key] = `object`
        }

        /**
         * Remove WebView by its name.
         *
         * @param key WebView's name
         */
        fun removeGameView(key: String) {
            GAME_VIEW.remove(key)
        }

        fun getGameView(key: String): Any? {
            return GAME_VIEW[key]
        }


        fun isNoShowViewExists(webViewName: String): Boolean {
            for (key in NOSHOW_VIEW.keys) {
                if (webViewName == key) {
                    return true
                }
            }
            return false
        }

        /**
         * Add WebView.
         *
         * @param key    WebView's name.
         * @param object WebView:X5 or Android
         */
        fun addNoShowView(key: String, `object`: Any) {
            NOSHOW_VIEW[key] = `object`
        }

        /**
         * Remove WebView by its name.
         *
         * @param key WebView's name
         */
        fun removeNoShowView(key: String) {
            NOSHOW_VIEW.remove(key)
        }

        fun getNoShowView(key: String): Any? {
            return NOSHOW_VIEW[key]
        }

    }
}