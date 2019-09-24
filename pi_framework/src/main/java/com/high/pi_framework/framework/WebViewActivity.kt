package com.high.pi_framework.framework

import android.app.ActivityManager
import android.content.*
import android.content.pm.ActivityInfo
import android.os.Bundle
import android.os.Handler
import android.support.v7.app.AlertDialog
import android.util.Log
import android.view.View
import android.view.ViewTreeObserver
import android.view.WindowManager
import android.widget.RelativeLayout
import com.high.pi_framework.R
import com.high.pi_framework.Util.FileUtil
import com.high.pi_framework.Util.PrefMgr
import com.high.pi_framework.base.BaseWebView
import com.high.pi_framework.module.LocalLanguageMgr
import java.io.File
import java.util.*


class WebViewActivity : BaseWebView(), ViewTreeObserver.OnGlobalLayoutListener {
    private lateinit var mJsIntercept: JSIntercept
    private lateinit var mRlRootView: RelativeLayout
    private var timer: Timer? = null
    private val delay: Long = 2000
    override val layoutResources: Int get() = R.layout.activity_webview
    private val mReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context?, intent: Intent?) {
            val action = intent?.action ?: return
            when (action) {
                "send_messagedefault" -> {
                    val message = intent.getStringExtra("message")
                    val sender = intent.getStringExtra("from_web_view")
                    val callFun = String.format("javascript:window.onWebViewPostMessage('%s','%s')", sender, message)
                    ynWebView.evaluateJavascript(callFun)
                }
                "relive_webView" -> {
                    reliveWebView()
                }
                "close_webView" -> {
                    closeWebView()
                }
            }
        }
    }

    //==============life==========
    override fun onCreate(savedInstanceState: Bundle?) {
        if (isWebViewFirst == "false"){
            requestedOrientation = ActivityInfo.SCREEN_ORIENTATION_PORTRAIT
        }
        hideSystemNavigationBar()
        ynWebView.createYnWebView(this)
        addJEV(this)
        super.onCreate(savedInstanceState)
    }

    override fun initViews() {
        mRlRootView = findViewById(R.id.app_main_rl_root_view)
        mRlRootView.viewTreeObserver.addOnGlobalLayoutListener (this)
        mRlRootView.removeAllViews()
        ynWebView.addYnWebView(mRlRootView)
    }

    override fun initData() {
        loadWebView(isWebViewFirst)
        registerBc()
    }

    override fun onNewIntent(intent: Intent?) {
        super.onNewIntent(intent)
        Log.d("activity","onNewIntent")
        val screenOrientation = intent?.getStringExtra("screen")
        if (screenOrientation == "portrait"){
            requestedOrientation = ActivityInfo.SCREEN_ORIENTATION_PORTRAIT
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
        Log.d("webView","onDestroy")
        ynWebView.iterationDestroy()
        unregisterReceiver(mReceiver)
        super.onDestroy()
    }

    override fun onResume() {
        addJEV(this)
        super.onResume()
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        ynWebView.iterationOnActivityResult(requestCode, resultCode, data)
        super.onActivityResult(requestCode, resultCode, data)
    }

    //===========delegates==========
    override fun onGlobalLayout() {
        if (timer != null){
            timer!!.cancel()
            timer!!.purge()
        }
        timer = Timer()
        val task = object : TimerTask() {
            override fun run() {
                hideSystemNavigationBar()
            }
        }
        timer!!.schedule(task, delay);
    }

    //==========private==============
    private fun loadWebView(stage: String){
        mJsIntercept = ynWebView.addJavaScriptInterface( mRlRootView)
        addJEV(this)
        LocalLanguageMgr(ynWebView).setAppLanguage(
            PrefMgr.getInstance(this).appLan,
            callBack = { callType, prames -> JSBridge(ynWebView).callJS(null, null, 0, callType, prames) })
        onloadUrl(stage)
    }

    private fun onloadUrl(stage: String){
        //获取当前app版本号
        val pm = this.applicationContext.packageManager
        val info = pm.getPackageInfo(this.applicationContext.packageName, 0)
        val name = info.versionCode
        //判断版本号
        val versionPath = mJsIntercept.apkPath + "/apkversion.txt"
        val version = FileUtil.readFile(versionPath)
        if (version == ""){
            //如果documents中没有版本号文件，将版本号文件写入documents中
            val f = File(versionPath)
            f.writeText(name.toString())
        }else{
            //如果documents中有版本号文件，将版本号与当前app进行对比
            if (name > version.toInt()){
                val htmlFile = File(mJsIntercept.htmlPath)
                FileUtil.RecursionDeleteFile(htmlFile)
                mJsIntercept.isUpdate = 1
                mJsIntercept.name = name.toString()
            }
        }
        val url = resources.getString(URL_RES_ID)
        if (url.startsWith("/")) {
            var content = FileUtil.readFile(mJsIntercept.htmlPath + url)
            if (content == "") {
                val stream = this.getAssets().open(url.substring(1))
                content = FileUtil.readFile(stream)
            }
            if (content != "") {
                content = "<script>window.isFirst=$stage</script>$content"
                super.loadDataWithBaseUrl("file:///android_asset" + url, content);
            } else {
                Log.d("JSIntercept", "loadUrl Error!!!");
            }
        } else {
            super.loadUrl(url)
        }
    }

    private fun registerBc() {
        val intentFilter = IntentFilter()
        intentFilter.addAction("send_messagedefault")
        intentFilter.addAction("relive_webView")
        intentFilter.addAction("close_webView")
        registerReceiver(mReceiver, intentFilter)
    }

    private fun hideSystemNavigationBar() {
        val _window = window.decorView
        val uiOptions =   View.SYSTEM_UI_FLAG_HIDE_NAVIGATION or View.SYSTEM_UI_FLAG_FULLSCREEN or View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY or View.SYSTEM_UI_FLAG_LAYOUT_STABLE;
        this.runOnUiThread { _window.systemUiVisibility = uiOptions; window.addFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_NAVIGATION) }

    }

    fun closeWebView(){
        Log.d("webView","close WebView")
        isWebViewFirst = "false"
        NewWebViewActivity.isDefaultClose = true
        ynWebView.destroyYnWebView()
        this.finish()
    }

    fun reliveWebView(){
        loadWebView("false")
    }

    companion object {
        const val APP_RESULT_CODE = 912
        val URL_RES_ID = R.string.init_url
        var isWebViewFirst: String = "true"
    }
}