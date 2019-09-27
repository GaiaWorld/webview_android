package com.high.pi_framework.framework

import android.content.*
import android.os.Bundle
import android.os.IBinder
import android.util.Log
import android.widget.RelativeLayout
import com.high.pi_framework.R
import com.high.pi_framework.Util.ViewUtil
import com.high.pi_framework.base.BaseWebView
import com.high.pi_framework.module.WebViewManager
import android.view.View
import android.view.ViewTreeObserver
import android.view.WindowManager
import com.high.pi_framework.webview.YNWebView
import com.high.pi_service.piservice
import com.high.pi_service.piserviceCallBack
import kotlinx.android.synthetic.main.activity_new_web_view.*
import java.io.File
import java.util.*


class NewWebViewActivity : BaseWebView(), ViewTreeObserver.OnGlobalLayoutListener{
    private lateinit var mRlRootView: RelativeLayout
    private var tag: String? = null
    private var timer: Timer? = null
    private var delay: Long = 2000
    private var ps: piservice? = null
    private val conn = webViewConn()

    override val layoutResources: Int get() = R.layout.activity_new_web_view

    //=============life================
    override fun onCreate(savedInstanceState: Bundle?) {
        Log.d("WebView", "new WebView: " + intent?.getStringExtra("tag"))
        tag = intent!!.getStringExtra("tag")
        gameExit = true
        hideSystemNavigationBar()
        val uAgent = intent?.getStringExtra("uagent")
        if ( uAgent != null){
            ynWebView.createYnWebView(this, uAgent)
        }else{
            ynWebView.createYnWebView(this)
        }
        addJEV(this)
        val intent = Intent("com.high.high.piservice")
        intent.setPackage("com.high.high");
        bindService(intent, conn, BIND_AUTO_CREATE)
        super.onCreate(savedInstanceState)
    }

    override fun initViews() {
        mRlRootView = root_view
        mRlRootView.viewTreeObserver.addOnGlobalLayoutListener(this)
        val bootView = boot_view
        bootView.layoutParams.height = ViewUtil.getStatusBarHeight(this).toInt()
        mRlRootView.removeAllViews()
        ynWebView.addYnWebView(mRlRootView)
//        status_bar.layoutParams.height = ViewUtil.getStatusBarHeight(this).toInt()
    }

    override fun initData() {
        YNWebView.addWithName(tag!!,ynWebView)
        if (null == tag) throw Exception("The tag can't be null!")
        val path = intent.getStringExtra("inject") ?: ""
        val file = File(path)
        val content = file.readText()
        file.delete()
        val url = intent?.getStringExtra("load_url") ?: "https://cn.bing.com"
        val tagStr = tag as String
        ynWebView.addNewJavaScript( mRlRootView, tagStr, url, content)
        addJEV(this)
        super.loadUrl(url)
        registerCloseReceiver()
    }

    override fun onRestart() {
        super.onRestart()
        JSBridge.sendJS(ynWebView,"PI_App", ON_APP_RESUMED, arrayOf("App进入前台"))
    }

    override fun onBackPressed() {
//        val childCount = mRlRootView.childCount
//        if (childCount > 1) {
//            mRlRootView.removeViewAt(childCount - 1)
//        }
//        else {
            JSBridge.sendJS(ynWebView,"PI_Activity", ON_BACK_PRESSED, arrayOf("页面即将关闭"))
//        }
    }

    override fun onNewIntent(intent: Intent?) {
        super.onNewIntent(intent)
        gameExit = true
        if (intent?.getStringExtra("tag") == null){
            return
        }
        if (tag != intent.getStringExtra("tag") && tag != null){
            if (WebViewManager.isGameViewExists(tag!!)){
                WebViewManager.removeGameView(tag!!)
            }
            tag = intent.getStringExtra("tag")
            val path = intent.getStringExtra("inject") ?: ""
            val file = File(path)
            val content = file.readText()
            file.delete()
            val url = intent.getStringExtra("load_url") ?: "https://cn.bing.com"
            val tagStr = tag as String
            ynWebView.addNewJavaScript( mRlRootView, tagStr, url, content)
            addJEV(this)
            super.loadUrl(url)
            registerCloseReceiver()
        }
    }


    override fun onDestroy() {
        WebViewManager.removeGameView(this.tag!!)
        unregisterReceiver(mCloseReceiver)
        super.onDestroy()
    }


    //============private===============

    fun closeActivicty(){
        gameExit = false
        val closeIntent = Intent(this, WebViewActivity::class.java)
        startActivity(closeIntent)
        finish()
    }

    private fun hideSystemNavigationBar() {
        val v = window.decorView
        val UIOpts = ( View.SYSTEM_UI_FLAG_HIDE_NAVIGATION or View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION or View.SYSTEM_UI_FLAG_IMMERSIVE )
        v.systemUiVisibility = UIOpts
        window.addFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_NAVIGATION)
        window.clearFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN)
    }

    fun minsizeActivity(){
        gameExit = false
        val minintent = Intent(this, WebViewActivity::class.java)
        startActivity(minintent)
    }

    fun webViewBindService(message: String){
        if (ps != null){
            val ms = "window['handle_native_event']('ServiceAction', 'bind','$tag','$message')"
            ps!!.sendMessage(tag, ms)
        }
    }


    //============delegate=============
    override fun onGlobalLayout() {
        if (timer != null){
            timer!!.cancel()
            timer!!.purge()
        }
        timer = Timer()
        val task = object : TimerTask() {
            override fun run() {
                mRlRootView.post { kotlin.run { hideSystemNavigationBar() } }
            }
        }
        timer!!.schedule(task,delay)
    }


    private fun registerCloseReceiver() {
        val intentFilter = IntentFilter()
        intentFilter.addAction("close_web_view")
        intentFilter.addAction("send_message$tag")
        intentFilter.addAction("mine_size_activity")
        registerReceiver(mCloseReceiver, intentFilter)
    }

    private val mCloseReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context?, intent: Intent?) {
            val action = intent?.action ?: return
            when (action) {
                "close_web_view" -> {
                    if (tag == intent.getStringExtra("web_view_name")) {
                        this@NewWebViewActivity.closeActivicty()
                    }
                }
                "mine_size_activity" -> {
                    this@NewWebViewActivity.minsizeActivity()
                }
                "send_message$tag" -> {
                    val rpc = intent.getStringExtra("rpc")
                    val message = intent.getStringExtra("message")
                    val sender = intent.getStringExtra("from_web_view")
                    if (rpc == "true"){
                        val callFun = String.format("javascript:window.onWebViewPostMessage('%s','%s')", sender, message)
                        ynWebView.evaluateJavascript(callFun)
                    }else{
                        ynWebView.evaluateJavascript(message)
                    }
                }
            }
        }
    }

    inner class webViewConn(): ServiceConnection {
        override fun onServiceConnected(name: ComponentName?, service: IBinder?) {
            ps = piservice.Stub.asInterface(service)
            ps!!.onMessage(tag, object : piserviceCallBack.Stub(){
                override fun sendMessage(statuCode: Int, message: String?) {
                    if (statuCode == 0){
                        val ms = "javascript:window.pi_sdk.piService.onBindService(undefined, $message)"
                        ynWebView.evaluateJavascript(ms)
                    }else{
                        val ms = "javascript:window.pi_sdk.piService.onBindService({code: -4, reason: $message})"
                        ynWebView.evaluateJavascript(ms)
                    }
                }
            })
        }

        override fun onServiceDisconnected(name: ComponentName?) {

        }
    }





    companion object {
        var gameExit: Boolean = false
    }

}