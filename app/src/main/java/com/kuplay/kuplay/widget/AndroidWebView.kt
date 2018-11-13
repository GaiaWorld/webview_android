package com.kuplay.kuplay.widget

import android.annotation.SuppressLint
import android.content.Context
import android.content.Intent
import android.graphics.Bitmap
import android.net.Uri
import android.os.Handler
import android.os.Message
import android.support.v7.app.AlertDialog
import android.util.AttributeSet
import android.util.Log
import android.webkit.*
import android.widget.EditText
import android.widget.RelativeLayout
import com.kuplay.kuplay.R
import com.kuplay.kuplay.callback.WebViewLoadProgressCallback
import com.kuplay.kuplay.intercepter.Interceptor
import com.kuplay.kuplay.module.ImagePicker
import java.lang.ref.WeakReference
import java.util.*

/**
 * Created by "iqos_jay@outlook.com" on 2018/9/26.
 */
class AndroidWebView constructor(private val ctx: Context, attr: AttributeSet? = null) : WebView(ctx, attr) {
    private val connectTimeOut = ctx.resources.getString(R.string.connect_url_time_out_value)
    private var onlyInterceptWeb3: Boolean = false
    private var loadCallback: WebViewLoadProgressCallback? = null
    private val mTimerOutHandler = TimerOutHandler(this)
    private var mTimer: Timer? = null
    private var isShowTimeOut = false

    init {
        initClient(this@AndroidWebView)
        initSettings(this@AndroidWebView)
    }

    /**
     * 初始化它的设置
     */
    @SuppressLint("SetJavaScriptEnabled")
    private fun initSettings(awv: AndroidWebView, initLp: Boolean = true) {
        val settings = awv.settings
        val ua = settings.userAgentString
        settings.userAgentString = "$ua YINENG_ANDROID/1.0"
        settings.javaScriptEnabled = true//可以与js交互
        // 设置自适应屏幕，两者合用
        settings.useWideViewPort = true//将图片调整到适合webView的大小
        settings.loadWithOverviewMode = true//缩放至屏幕的大小
        settings.allowFileAccess = true//设置可以访问文件
        settings.allowFileAccessFromFileURLs = true
        settings.allowUniversalAccessFromFileURLs = true
        settings.loadsImagesAutomatically = true//支持自动加载图片
        settings.defaultTextEncodingName = "utf-8"//设置编码格式
        settings.cacheMode = WebSettings.LOAD_DEFAULT//默认 根据cache-control决定是否从网络上取数据。
        settings.domStorageEnabled = true//开启 DOM storage API 功能
        settings.databaseEnabled = true//开启 database storage API 功能
        settings.setAppCacheEnabled(true)//开启 Application Caches 功能
        val cacheDirPath = ctx.filesDir.absolutePath + ctx.resources.getString(R.string.app_name)
        settings.setAppCachePath(cacheDirPath) //设置  Application Caches 缓存目录
        // 缩放操作
        settings.setSupportZoom(true)//支持缩放，默认为true。是下面那个的前提。
        settings.builtInZoomControls = true//设置内置的缩放控件。若为false，则该WebView不可缩放
        settings.displayZoomControls = false//隐藏原生的缩放控件
        settings.setSupportMultipleWindows(true)
        settings.javaScriptCanOpenWindowsAutomatically = true
        settings.setSupportMultipleWindows(true)// 设置允许开启多窗口
        if (initLp) {
            val layoutParams = RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.MATCH_PARENT, RelativeLayout.LayoutParams.MATCH_PARENT)
            awv.layoutParams = layoutParams
        }
        setWebContentsDebuggingEnabled(true)
    }

    /**
     * 初始化内部
     */
    private fun initClient(awv: AndroidWebView) {
        try {
            awv.webChromeClient = MyWebChromeClient()
            awv.webViewClient = MyWebViewClient()
        } catch (e: Exception) {
            e.printStackTrace()
        }

    }

    /**
     * Handler:will be used to update UI,must use weak reference,
     * else will leaks.
     */
    private class TimerOutHandler(androidWebView: AndroidWebView) : Handler() {
        private val weak: WeakReference<AndroidWebView> = WeakReference(androidWebView)

        override fun handleMessage(msg: Message) {
            super.handleMessage(msg)
            val androidWebView = weak.get() ?: return
            when (msg.what) {
                //start load url
                START_CONN -> {
                    if (androidWebView.progress < 100) {
                        androidWebView.mTimerOutHandler.sendEmptyMessage(CONNECT_TIME_OUT)
                        androidWebView.mTimer?.cancel()
                        androidWebView.mTimer?.purge()
                    }
                }
                //connect time out
                CONNECT_TIME_OUT -> {
                    if (!androidWebView.isShowTimeOut) {
                        androidWebView.loadCallback?.onLoadTimeOut()
                        androidWebView.isShowTimeOut = true
                    }
                }
                else -> super.handleMessage(msg)
            }
        }
    }

    private inner class MyWebViewClient : WebViewClient() {
        override fun onPageStarted(view: WebView?, url: String?, favicon: Bitmap?) {
            super.onPageStarted(view, url, favicon)
            isShowTimeOut = false
            mTimer?.cancel()
            mTimer?.purge()
            mTimer = Timer()
            val timerTask = object : TimerTask() {
                override fun run() {
                    mTimerOutHandler.sendEmptyMessage(START_CONN)
                }
            }
            mTimer?.schedule(timerTask, connectTimeOut.toLong(), 10)
        }

        override fun onPageFinished(view: WebView, url: String) {
            super.onPageFinished(view, url)
            loadCallback?.onLoadFinished()
            mTimer?.cancel()
            mTimer?.purge()
        }

        override fun shouldOverrideUrlLoading(view: WebView, url: String?): Boolean {
            if (null == url) return false
            if (url.startsWith("http") || url.startsWith("file")) {
                val extraHeaders = HashMap<String, String>()
                extraHeaders["Referer"] = view.url // 需要加上referer，否则有些服务器会拒绝加载页面
                view.loadUrl(url, extraHeaders)
                return true
            }
            try {
                val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
                intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_SINGLE_TOP
                view.context.startActivity(intent)
            } catch (e: Exception) {
                // 防止没有安装的情况
                e.printStackTrace()
            }

            return true
        }

        override fun shouldInterceptRequest(view: WebView, request: WebResourceRequest): WebResourceResponse? {
            val interceptor = Interceptor(ctx)
            val uri = request.url
            interceptor.setWebView(view)
            interceptor.setOnlyInterceptWeb3((view as AndroidWebView).onlyInterceptWeb3)
            val handler = interceptor.GetInterceptHandle(uri)
                    ?: return super.shouldInterceptRequest(view, request)
            var response = handler.handle(interceptor)
                    ?: return super.shouldInterceptRequest(view, request)
            response = response as WebResourceResponse
            val extraHeaders = HashMap<String, String>()
            extraHeaders["Referer"] = uri.toString()
            // 设置一个本地加载标签
            extraHeaders["X-From-Mobile"] = "1"
            response.responseHeaders = extraHeaders
            return response
        }
    }

    private inner class MyWebChromeClient : WebChromeClient() {

        override fun onJsAlert(view: WebView, url: String, message: String, result: JsResult): Boolean {
            AlertDialog.Builder(ctx)
                    .setTitle(R.string.dialog_title_prompt)
                    .setMessage(message)
                    .setPositiveButton(R.string.dialog_title_ok) { _, _ -> result.confirm() }
                    .setCancelable(false)
                    .create()
                    .show()
            return true
        }

        override fun onJsPrompt(view: WebView, url: String, message: String, defaultValue: String, result: JsPromptResult): Boolean {
            val editText = EditText(ctx)
            AlertDialog.Builder(ctx)
                    .setMessage(message)
                    .setView(editText)
                    .setPositiveButton(R.string.dialog_title_ok) { _, _ ->
                        result.confirm(editText.text.toString())
                        editText.setText("")
                    }
                    .setNegativeButton(R.string.dialog_title_cancel) { _, _ -> result.cancel() }
                    .setCancelable(false)
                    .create()
                    .show()
            return true
        }

        override fun onJsConfirm(view: WebView, url: String, message: String, result: JsResult): Boolean {
            AlertDialog.Builder(ctx)
                    .setMessage(message)
                    .setPositiveButton(R.string.dialog_title_ok) { _, _ -> result.confirm() }
                    .setNegativeButton(R.string.dialog_title_cancel) { _, _ -> result.cancel() }
                    .setCancelable(false)
                    .create()
                    .show()
            return true
        }

        override fun onCreateWindow(view: WebView, isDialog: Boolean, isUserGesture: Boolean, resultMsg: Message): Boolean {
            val childView = AndroidWebView(ctx)
            sViewRoot[0].addView(childView)
            initClient(childView)
            initSettings(childView)
            // Create dynamically a new view
            val transport = resultMsg.obj as WebView.WebViewTransport
            transport.webView = childView
            resultMsg.sendToTarget()
            return true
        }

        override fun onCloseWindow(window: WebView?) {
            try {
                val root = sViewRoot[0]
                val childCount = root.childCount
                if (childCount > 1) {
                    root.removeViewAt(childCount - 1)
                }
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }


        override fun onShowFileChooser(webView: WebView?, filePathCallback: ValueCallback<Array<Uri>>?, fileChooserParams: FileChooserParams?): Boolean {
            ImagePicker().chooseImage(0, 1, 1, 1)

            return true
        }

    }

    /**
     * Setter
     *
     * @param loadCallback WebViewLoadProgressCallback impl
     */
    fun setLoadCallback(loadCallback: WebViewLoadProgressCallback) {
        this.loadCallback = loadCallback
    }

    fun setOnlyInterceptWeb3(only: Boolean) {
        this.onlyInterceptWeb3 = only
    }

    companion object {
        private const val START_CONN = 1//While AndroidWebView start load url,this value will be send to handler.
        private const val CONNECT_TIME_OUT = 2//Have been time out.
        /**
         * The min value of connect time out,you can't set value less than this value
         */
        private const val MIN_TIME_OUT = 1000
        val sViewRoot = mutableListOf<RelativeLayout>()
    }
}

