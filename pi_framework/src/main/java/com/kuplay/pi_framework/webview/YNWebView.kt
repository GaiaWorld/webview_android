package com.kuplay.pi_framework.webview

import android.app.Activity
import android.app.Application
import android.content.Context
import android.content.Intent
import android.graphics.Bitmap
import android.graphics.Canvas
import android.util.Log
import android.view.ViewGroup
import android.widget.RelativeLayout
import com.kuplay.pi_framework.Util.WebViewUtil
import com.kuplay.pi_framework.base.BaseActivity
import com.kuplay.pi_framework.base.JSInterface
import com.kuplay.pi_framework.framework.JSBridge
import com.kuplay.pi_framework.framework.JSIntercept
import com.kuplay.pi_framework.module.WebViewManager
import com.tencent.smtt.sdk.QbSdk
import com.tencent.smtt.sdk.WebView
import com.tencent.smtt.sdk.WebViewClient
import java.io.File
import java.text.SimpleDateFormat
import java.util.HashMap



class YNWebView {
    var mAndroidWebView: AndroidWebView? = null
    var mX5: X5Chrome? = null

    var jsImpl: JSInterface? = null


    val CONTEXT = "CONTEXT"
    val ACTIVITY = "ACTIVITY"

    //环境表
    private val envMap = HashMap<String, Any>()
    //webView表
    private val webMap = HashMap<String, Any>()


    fun setWeb(key: String, o: Any){
        webMap[key] = o
    }

    fun getWeb(key: String): Any? {
        return webMap[key]
    }
    /**
     * 设置环境
     */
    fun setEnv(key: String, o: Any) {
        envMap[key] = o
    }
    /**
     * 获取环境对象
     */
    fun getEnv(key: String): Any? {
        return envMap[key]
    }

    //创建YNWebView
    fun createYnWebView(baseActivity: BaseActivity, uAgent: String? = null ){
        if (uAgent == null){
            if (isX5) mX5 = X5Chrome(baseActivity)
            else mAndroidWebView = AndroidWebView(baseActivity)
        }else{
            if (isX5)  mX5 = X5Chrome(baseActivity, uAgent)
            else mAndroidWebView = AndroidWebView(baseActivity, uAgent)
        }
    }

    fun finishLoading(){
        if (isX5){
            mX5!!.setWebViewClient(object : WebViewClient(){
                override fun onPageFinished(p0: WebView?, p1: String?) {
                    super.onPageFinished(p0, p1)
                    val intent = Intent("send_messagedefault")
                    intent.putExtra("web_view_name", "default")
                    intent.putExtra("message","window['handle_native_event']('reptile', 'pageFinished','页面加载完毕')")
                    intent.putExtra("rpc","false")
                    (getEnv(ACTIVITY) as Activity).sendBroadcast(intent)
                }
            })
        }else{
            mAndroidWebView!!.webViewClient = object : android.webkit.WebViewClient(){
                override fun onPageFinished(view: android.webkit.WebView?, url: String?) {
                    super.onPageFinished(view, url)
                    val intent = Intent("send_messagedefault")
                    intent.putExtra("web_view_name", "default")
                    intent.putExtra("message","window['handle_native_event']('reptile', 'pageFinished','页面加载完毕')")
                    intent.putExtra("rpc","true")
                    (getEnv(ACTIVITY) as Activity).sendBroadcast(intent)
                }
            }
        }
    }

    fun destroyYnWebView(){
        //为了防止内存泄漏，注销时，先加载空页面，清除内存，移除视图，再销毁控件，最后将控件至空
        if (isX5) {
            if (mX5 != null) {
                mX5!!.loadDataWithBaseURL(null, "", "text/html", "utf-8", null)
                mX5!!.clearHistory()

                (mX5!!.getParent() as ViewGroup).removeView(mX5)
                mX5!!.destroy()
                mX5 = null
            }
        }
        else {
            if (mAndroidWebView != null) {
                mAndroidWebView!!.loadDataWithBaseURL(null, "", "text/html", "utf-8", null)
                mAndroidWebView!!.clearHistory()

                (mAndroidWebView!!.getParent() as ViewGroup).removeView(mAndroidWebView)
                mAndroidWebView!!.destroy()
                mAndroidWebView = null
            }
        }
    }

//    fun setJEN(){
//        if (mX5 != null) {
//            setEnv(WEBVIEW, mX5 as X5Chrome)
//        } else {
//            setEnv(WEBVIEW, mAndroidWebView as AndroidWebView)
//        }
//    }

    fun loadURL(url: String, extraHeaders: HashMap<String, String>){
        if (isX5) mX5?.loadUrl(url, extraHeaders)
        else mAndroidWebView?.loadUrl(url, extraHeaders)
    }

    fun loadDataWithBaseUrl(url: String, content: String){
        if (isX5) mX5?.loadDataWithBaseURL(url, content, "text/html", "utf8", url);
        else mAndroidWebView?.loadDataWithBaseURL(url, content, "text/html", "utf8", url);
    }

    fun addYnWebView(mRlRootView: RelativeLayout){
        mRlRootView.addView(if (isX5) mX5 else mAndroidWebView)
    }

    fun addNewJavaScript( mRlRootView: RelativeLayout, tag: String, url: String, content: String){
        if (isX5) {
            mX5!!.addJavascriptInterface(JSBridge(this, mX5), JSBridge::class.java.simpleName)
            X5Chrome.sViewRoot.add(mRlRootView)
            WebViewManager.addGameView(tag, mX5!!)
            setWeb("",mX5!!)
            mX5!!.setInjectContent(url, content)
        } else {
            mAndroidWebView!!.addJavascriptInterface(JSBridge(this, mAndroidWebView), JSBridge::class.java.simpleName)
            AndroidWebView.sViewRoot.add(mRlRootView)
            WebViewManager.addGameView(tag, mAndroidWebView!!)
            setWeb("",mAndroidWebView!!)
            mAndroidWebView!!.setInjectContent(url, content)
        }
    }

    fun addJavaScriptInterface( mRlRootView: RelativeLayout): JSIntercept{
        lateinit var mJsIntercept: JSIntercept
        if (isX5) {
            mJsIntercept = JSIntercept(this)
            mX5?.addJavascriptInterface(JSBridge(this, mX5), JSBridge::class.java.simpleName)
            mX5?.addJavascriptInterface(mJsIntercept, JSIntercept::class.java.simpleName)
            X5Chrome.sViewRoot.add(mRlRootView)
            WebViewManager.addGameView("default", mX5!!)
            setWeb("",mX5!!)
        } else {
            mJsIntercept = JSIntercept(this)
            mAndroidWebView?.addJavascriptInterface(JSBridge(this, mAndroidWebView), JSBridge::class.java.simpleName)
            mAndroidWebView?.addJavascriptInterface(mJsIntercept, JSIntercept::class.java.simpleName)
            AndroidWebView.sViewRoot.add(mRlRootView)
            WebViewManager.addGameView("default", mAndroidWebView!!)
            setWeb("",mAndroidWebView!!)
        }
        return mJsIntercept
    }


    //向webView通信
    fun evaluateJavascript(format: String){
        Log.d("js",format)
        if (isX5) mX5?.evaluateJavascript(format, null)
        else mAndroidWebView?.evaluateJavascript(format, null)
    }

    //截屏
    fun snapShotInWebView(bmpBlock : (bitmap : Bitmap)->Unit){
        if (!isX5) {
            mAndroidWebView!!.post {
                val snapShot = mAndroidWebView!!.capturePicture()
                val bmp = Bitmap.createBitmap(snapShot.width, snapShot.height, Bitmap.Config.ARGB_8888)
                val canvas = Canvas(bmp)
                snapShot.draw(canvas)
                bmpBlock(bmp)
            }
        } else {
            mX5!!.post {
                val contentWidth = mX5!!.getContentWidth()
                val contentHeight = mX5!!.getContentHeight()
                val bmp = Bitmap.createBitmap(contentWidth, contentHeight, Bitmap.Config.RGB_565)
                val canvas = Canvas(bmp)
                mX5!!.getX5WebViewExtension().snapshotWholePage(canvas, false, false)
                bmpBlock(bmp)
            }
        }
    }


    companion object {
        var isX5 = false
        lateinit var sAppCtx: Application

        //判断是否使用X5浏览器
        fun getX5Open(Ctx: Application) {
            sAppCtx = Ctx
            //读取文件，如果文件不存在打开WebView判断版本号，如果文件存在，读取文件内容（获取文件更新时间，超过30天重新写文件）
            val mBootPath = "/data/data/" + sAppCtx.packageName
            val path = "$mBootPath/apk_back/x5file.txt"
            val f = File(path)
            if (f.exists()){
                //获取文件修改时间
                val time = f.lastModified()
                val formatter = SimpleDateFormat("MM")
                val filemonth = formatter.format(time)
                Log.d("file",filemonth)
                //获取
                val nowTime = System.currentTimeMillis()
                val nowmonth = formatter.format(nowTime)
                Log.d("file",nowmonth)
                //如果在当月就读取文件内容，如果不在就查询
                if (nowmonth.equals(filemonth)){
                    val contents = f.readText()
                    println(contents)
                    isX5 = contents.equals("true")
                    Log.d("file", isX5.toString())
                }else{
                    x5Read(sAppCtx)
                }

            }else{
                Log.d("file", "file not exit")
                x5Read(sAppCtx)
            }

            if (isX5) {
                QbSdk.initX5Environment(sAppCtx, object : QbSdk.PreInitCallback {
                    override fun onViewInitFinished(isX5Core: Boolean) {}
                    override fun onCoreInitFinished() {}
                })
            }

        }

        fun x5Read(sAppCtx: Application){
            isX5 = !WebViewUtil.shouldUseAndroidWebView(android.webkit.WebView(sAppCtx), sAppCtx)
            //将结果写入文件
            val mBootPath = "/data/data/" + sAppCtx.packageName
            val path = "$mBootPath/apk_back"
            if (!File(path).exists()){
                File(path).mkdir()
            }
            val f = File(path,"x5file.txt")
            if (isX5) f.writeText("true")
            else f.writeText("false")
        }


        //创建webView
        fun createWebView(context: Context,name: String, url: String, headers: Map<*, *>, injectContent: String, ynWebView: YNWebView, defaultName: String):Any{
            if (isX5) {
                val view = X5Chrome(context)
                view.setWebViewClient(object : WebViewClient(){
                    override fun onPageFinished(p0: WebView?, p1: String?) {
                        super.onPageFinished(p0, p1)
                        val intent = Intent("send_message$defaultName")
                        intent.putExtra("web_view_name", name)
                        intent.putExtra("message","window['handle_native_event']('reptile', 'pageFinished','$name')")
                        intent.putExtra("rpc","false")
                        (ynWebView.getEnv(ynWebView.ACTIVITY) as Activity).sendBroadcast(intent)
                    }
                })
                if (injectContent != "") view.setInjectContent(url, injectContent)
                view.addJavascriptInterface(JSBridge(ynWebView, view), JSBridge::class.java.simpleName)
                view.loadUrl(url, headers as MutableMap<String, String>?)
                ynWebView.setWeb(name, view)
                return view
            } else {
                val view = AndroidWebView(context)
                view.webViewClient = object : android.webkit.WebViewClient(){
                    override fun onPageFinished(view: android.webkit.WebView?, url: String?) {
                        super.onPageFinished(view, url)
                        val intent = Intent("send_message$defaultName")
                        intent.putExtra("web_view_name", name)
                        intent.putExtra("message","window['handle_native_event']('reptile', 'pageFinished','$name')")
                        intent.putExtra("rpc","false")
                        (ynWebView.getEnv(ynWebView.ACTIVITY) as Activity).sendBroadcast(intent)
                    }
                }
                if (injectContent != "") view.setInjectContent(url, injectContent)
                view.addJavascriptInterface(JSBridge(ynWebView, view), JSBridge::class.java.simpleName)
                view.loadUrl(url, headers as MutableMap<String, String>?)
                ynWebView.setWeb(name, view)
                return view
            }
        }

        fun evaluateJavascript(ctx: Activity,view: Any, message: String, isRPC: String, sender: String ){
            var callFun = ""
            if (isRPC == "true" ){
                callFun = String.format("javascript:window.onWebViewPostMessage('%s','%s')", sender, message)
            }else{
                callFun = message
            }
            if (isX5) {
                ctx.runOnUiThread {   (view as X5Chrome).evaluateJavascript(callFun, null) }
            }else{
                ctx.runOnUiThread {   (view as AndroidWebView).evaluateJavascript(callFun, null)  }
            }
        }


        //销毁webView
        fun destroyWebView(view: Any){
            if (isX5) {
                (view as X5Chrome).destroy()
            } else {
                (view as AndroidWebView).destroy()
            }
        }

    }


}