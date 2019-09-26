package com.high.pi_framework.framework

import android.app.ActivityManager
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.content.pm.ActivityInfo
import android.content.res.Configuration
import android.graphics.BitmapFactory
import android.os.Bundle
import android.util.Log
import android.widget.RelativeLayout
import com.high.pi_framework.R
import com.high.pi_framework.base.BaseWebView
import com.high.pi_framework.module.WebViewManager
import android.view.View
import android.view.ViewTreeObserver
import android.widget.ImageView
import com.high.pi_framework.Util.FileUtil
import kotlinx.android.synthetic.main.activity_new_web_view.*
import java.io.File
import java.util.*
import android.util.DisplayMetrics
import android.content.DialogInterface
import android.support.v7.app.AlertDialog
import com.high.pi_framework.module.TapDB


class NewWebViewActivity : BaseWebView(), ViewTreeObserver.OnGlobalLayoutListener{
    private lateinit var mRlRootView: RelativeLayout
    private var tag: String? = null
    private var timer: Timer? = null
    private val delay: Long = 2000
    override val layoutResources: Int get() = R.layout.activity_new_web_view
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
                    val screen = intent.getStringExtra("screen")
                    this@NewWebViewActivity.minsizeActivity(screen)
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

    //====================life===================
    override fun onCreate(savedInstanceState: Bundle?) {
        gameExit = true
        hideSystemNavigationBar()
        val screenOrientation = intent?.getStringExtra("screenOrientation")
        if (screenOrientation == "portrait"){
            requestedOrientation = ActivityInfo.SCREEN_ORIENTATION_PORTRAIT
        }
        val uAgent = intent?.getStringExtra("uagent")
        if ( uAgent != null){
            ynWebView.createYnWebView(this, uAgent)
        }else{
            ynWebView.createYnWebView(this)
        }
        addJEV(this)
        super.onCreate(savedInstanceState)
        TapDB.initSDK(this)
    }

    override fun onResume() {
        super.onResume()
        TapDB.onResume(this)
    }

    override fun onStop() {
        super.onStop()
        TapDB.onStop(this)
    }

    override fun initViews() {
        mRlRootView = root_view
        mRlRootView.viewTreeObserver.addOnGlobalLayoutListener (this)
        ynWebView.addYnWebView(mRlRootView)
    }

    override fun initData() {
        Log.d("WebView", "new WebView: " + intent?.getStringExtra("tag"))
        tag = intent?.getStringExtra("tag")
        if (null == tag) throw Exception("The tag can't be null!")
        val path = intent.getStringExtra("inject") ?: ""
        var content = ""
        if (path != "") {
            val file = File(path)
            content = file.readText()
            file.delete()
        }

        val url = intent?.getStringExtra("load_url") ?: "https://cn.bing.com"
        val tagStr = tag as String
        ynWebView.addNewJavaScript( mRlRootView, tagStr, url, content, R.drawable.ydzm)
        addJEV(this)
        if (url.startsWith("/")) {
            try {
                val stream = this.getAssets().open(url.substring(1))
                var ct = FileUtil.readFile(stream)
                if (ct != "") {
                    ct = "<script>$content</script>$ct"
                    super.loadDataWithBaseUrl("file:///android_asset" + url, ct)
                } else {
                    Log.d("JSIntercept", "loadUrl Error!!!");
                }
            } catch (e: java.lang.Exception) {
                // 假设：如果以/开头，同时又没有assets包对应的资源，那么就content就肯定是网页的内容。
                if (content != "") {
                    super.loadDataWithBaseUrl("file:///android_asset" + url, content)
                } else {
                    AlertDialog.Builder(this)
                        .setTitle("Error")
                        .setMessage("程序出错，请重启App")
                        .create()
                        .show()
                    return
                }
            }
        } else {
            super.loadUrl(url)
        }
        registerCloseReceiver()
    }

    override fun onNewIntent(intent: Intent?) {
        super.onNewIntent(intent)
//        JSBridge.sendJS(ynWebView,"PI_Activity", ON_APP_RESUMED, arrayOf("Activity进入前台"))
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
            ynWebView.addNewJavaScript( mRlRootView, tagStr, url, content, R.drawable.ydzm)
            if (url.startsWith("/")) {
                val stream = this.getAssets().open(url.substring(1))
                var ct = FileUtil.readFile(stream)
                if (ct != "") {
                    ct = "<script>$content</script>$ct"
                    super.loadDataWithBaseUrl("file:///android_asset" + url, ct)

                } else {
                    Log.d("JSIntercept", "loadUrl Error!!!");
                }
            } else {
                super.loadUrl(url)
            }
            addJEV(this)
            registerCloseReceiver()
        }
    }

    override fun onBackPressed() {
        AlertDialog.Builder(this)
            .setTitle("退出")
            .setMessage("是否立即退出游戏？")
            .setNegativeButton("取消", null)
            .setPositiveButton("确定", DialogInterface.OnClickListener { dialog, which ->
                val activityManager = this.applicationContext.getSystemService(Context.ACTIVITY_SERVICE) as ActivityManager
                for (appTask in activityManager.appTasks){
                    appTask.finishAndRemoveTask()
                }
                System.exit(0)
            }).show()
    }

    override fun onDestroy() {
        Log.d("webView","newwebView onDestroy")
        ynWebView.iterationDestroy()
        WebViewManager.removeWebView(this.tag!!)
        unregisterReceiver(mCloseReceiver)
        super.onDestroy()
    }

    //=============delegate============
    override fun onGlobalLayout() {
        if (timer != null){
            timer!!.cancel()
            timer!!.purge()
        }
        timer = Timer()
        val task = object : TimerTask() {
            override fun run() {
                runOnUiThread { hideSystemNavigationBar() }
            }
        }
        timer!!.schedule(task, delay);
    }

    //==============orivate===========
    fun closeActivicty(){
        gameExit = false
        val closeIntent = Intent(this, WebViewActivity::class.java)
        startActivity(closeIntent)
        finish()
    }

    private fun hideSystemNavigationBar() {
        val _window = window
        val params = _window.attributes
        params.systemUiVisibility =   View.SYSTEM_UI_FLAG_HIDE_NAVIGATION or View.SYSTEM_UI_FLAG_FULLSCREEN or View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY;
        _window.attributes = params

    }

    fun minsizeActivity(screen: String){
        gameExit = false
        val minintent = Intent(this, WebViewActivity::class.java)
        minintent.putExtra("screen", screen)
        startActivity(minintent)
        overridePendingTransition(0, 0);
    }

    private fun registerCloseReceiver() {
        val intentFilter = IntentFilter()
        intentFilter.addAction("close_web_view")
        intentFilter.addAction("send_message$tag")
        intentFilter.addAction("mine_size_activity")
        registerReceiver(mCloseReceiver, intentFilter)
    }

    companion object {
        var gameExit: Boolean = false
        var isDefaultClose: Boolean = true
    }

}