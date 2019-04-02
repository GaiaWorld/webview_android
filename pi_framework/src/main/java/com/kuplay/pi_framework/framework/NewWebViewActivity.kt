package com.kuplay.pi_framework.framework

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.os.Bundle
import android.util.Log
import android.widget.RelativeLayout
import com.kuplay.pi_framework.R
import com.kuplay.pi_framework.Util.ViewUtil
import com.kuplay.pi_framework.base.BaseWebView
import com.kuplay.pi_framework.module.WebViewManager
import android.view.View
import kotlinx.android.synthetic.main.activity_new_web_view.*
import java.io.File


class NewWebViewActivity : BaseWebView(){
    private lateinit var mRlRootView: RelativeLayout
    private var tag: String? = null
    /**
     * Get the layout resource from XML.
     *
     * @return layout resource from XML.
     */
    override val layoutResources: Int get() = R.layout.activity_new_web_view

    override fun onCreate(savedInstanceState: Bundle?) {
        gameExit = true
        hideSystemNavigationBar()

        val uAgent = intent?.getStringExtra("uagent")
        if ( uAgent != null){
            ynWebView.createYnWebView(this, uAgent)
        }else{
            ynWebView.createYnWebView(this)
        }
        addJEV(this)
        super.onCreate(savedInstanceState)
    }



    /**
     * As the method name said,this method is used to initialize views on this activity.
     */
    override fun initViews() {
        mRlRootView = root_view
        val bootView = boot_view
        bootView.layoutParams.height = ViewUtil.getStatusBarHeight(this).toInt()
        mRlRootView.removeAllViews()
        ynWebView.addYnWebView(mRlRootView)
//        status_bar.layoutParams.height = ViewUtil.getStatusBarHeight(this).toInt()
    }

    /**
     * Initialize basic data.
     */
    override fun initData() {
        Log.d("WebView", "new WebView: " + intent?.getStringExtra("tag"))
        tag = intent?.getStringExtra("tag")
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
        val childCount = mRlRootView.childCount
        if (childCount > 1) {
            mRlRootView.removeViewAt(childCount - 1)
        }
        else {
            JSBridge.sendJS(ynWebView,"PI_Activity", ON_BACK_PRESSED, arrayOf("页面即将关闭"))
        }
    }

    fun closeActivicty(){
        gameExit = false
        val closeIntent = Intent(this, WebViewActivity::class.java)
        startActivity(closeIntent)
        finish()
    }

    private fun hideSystemNavigationBar() {
        val _window = window
        val params = _window.attributes
        params.systemUiVisibility = View.SYSTEM_UI_FLAG_HIDE_NAVIGATION or View.SYSTEM_UI_FLAG_IMMERSIVE
        _window.attributes = params
    }

    fun minsizeActivity(){
        gameExit = false
        JSBridge.sendJS(ynWebView,"PI_Activity",ON_BACK_PRESSED, arrayOf("Activity进入后台"))
        val minintent = Intent(this, WebViewActivity::class.java)
        startActivity(minintent)
    }


    override fun onNewIntent(intent: Intent?) {
        super.onNewIntent(intent)
        JSBridge.sendJS(ynWebView,"PI_Activity", ON_APP_RESUMED, arrayOf("Activity进入前台"))
        gameExit = true
        if (intent?.getStringExtra("tag") == null){
            return
        }
        if (tag != intent.getStringExtra("tag") && tag != null){
            if (WebViewManager.isWebViewNameExists(tag!!)){
                WebViewManager.removeWebView(tag!!)
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
                    val message = intent.getStringExtra("message")
                    val sender = intent.getStringExtra("from_web_view")
                    val callFun = String.format("javascript:window.onWebViewPostMessage('%s','%s')", sender, message)
                    ynWebView.evaluateJavascript(callFun)
                }
            }
        }
    }

    override fun onDestroy() {
        WebViewManager.removeWebView(this.tag!!)
        unregisterReceiver(mCloseReceiver)
        super.onDestroy()
    }


    companion object {
        var gameExit: Boolean = false
    }

}