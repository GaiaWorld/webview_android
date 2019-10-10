package com.high.pi_framework.framework

import android.content.*
import android.os.Bundle
import android.os.IBinder
import android.os.Parcel
import android.util.Log
import android.view.WindowManager
import android.widget.RelativeLayout
import com.high.pi_framework.R
import com.high.pi_framework.Util.FileUtil
import com.high.pi_framework.Util.PrefMgr
import com.high.pi_framework.Util.ViewUtil
import com.high.pi_framework.base.BaseWebView
import com.high.pi_framework.module.LocalLanguageMgr
import com.high.pi_framework.webview.YNWebView
import com.high.pi_service.piservice
import com.high.pi_service.piserviceCallBack
import kotlinx.android.synthetic.main.layout_fake_status_bar_view.*
import java.io.File


class WebViewActivity : BaseWebView() {
    private var tag: String = ""
    private lateinit var mJsIntercept: JSIntercept
    private lateinit var mRlRootView: RelativeLayout
    private var ps: piservice? = null
    private val conn = webViewConn()
    override val layoutResources: Int get() = R.layout.activity_webview

    //============life==================
    override fun onCreate(savedInstanceState: Bundle?) {
        tag = resources.getString(R.string.init_name)
        ynWebView.createYnWebView(this)
        YNWebView.addWithName(tag, ynWebView)
        addJEV(this)
        val intent = Intent("com.high.ydzm.piservice")
        intent.setPackage("com.high.ydzm");
        bindService(intent, conn, BIND_AUTO_CREATE)
        super.onCreate(savedInstanceState)
    }

    override fun initViews() {
        mRlRootView = findViewById(R.id.app_main_rl_root_view)
        mRlRootView.removeAllViews()
        ynWebView.addYnWebView(mRlRootView)
        status_bar.layoutParams.height = ViewUtil.getStatusBarHeight(this).toInt()
    }

    override fun initData() {
        window.addFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS)// 在setContentView之后，适配顶部状态栏
        window.addFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_NAVIGATION)// 适配底部导航栏
        mJsIntercept = ynWebView.addJavaScriptInterface( mRlRootView)
        addJEV(this)
        LocalLanguageMgr(ynWebView).setAppLanguage(
            PrefMgr.getInstance(this).appLan,
            callBack = { callType, prames -> JSBridge(ynWebView,ynWebView.getWeb("")).callJS(null, null, 0, callType, prames) })
        onloadUrl()
        registerBc()
    }

    override fun onResume() {
        addJEV(this)
        super.onResume()
    }

    override fun onRestart() {
        super.onRestart()
        JSBridge.sendJS(ynWebView,"PI_App",ON_APP_RESUMED, arrayOf("App进入前台"))
    }

    override fun onBackPressed() {
        JSBridge.sendJS(ynWebView,"PI_Activity",ON_BACK_PRESSED, arrayOf("App进入后台"))
    }

    override fun onDestroy() {
        unbindService(conn)
        unregisterReceiver(mReceiver)
        super.onDestroy()
    }


    //==========private==========
    private fun onloadUrl(){
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
                super.loadDataWithBaseUrl("file:///android_asset" + url, content);
            } else {
                Log.d("JSIntercept", "loadUrl Error!!!");
            }
        } else {
            super.loadUrl(url)
        }
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        ynWebView.jsImpl!!.onActivityResult(requestCode, resultCode, data)
        super.onActivityResult(requestCode, resultCode, data)
    }

    private fun registerBc() {
        val intentFilter = IntentFilter()
        intentFilter.addAction("send_message$tag")
        registerReceiver(mReceiver, intentFilter)
    }

    private val mReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context?, intent: Intent?) {
            val action = intent?.action ?: return
            when (action) {
                "send_message$tag" -> {
                    val rpc = intent.getStringExtra("rpc")
                    val message = intent.getStringExtra("message")
                    val sender = intent.getStringExtra("from_web_view")
                    if (rpc == "true" ){
                        val callFun = String.format("javascript:window.onWebViewPostMessage('%s','%s')", sender, message)
                        ynWebView.evaluateJavascript(callFun)
                    }else{
                        ynWebView.evaluateJavascript(message)
                    }
                }
            }
        }
    }

    fun webViewBindService(message: String){
        if (ps != null){
            val ms = "window['handle_native_event']('ServiceAction', 'bind','$tag','$message')"
            ps!!.sendMessage(tag, ms)
        }
    }

    fun webViewPostMessage(sender: String, message: String){
        if (ps != null){
            val ms = "window.onWebViewPostMessage('$sender','$message')"
            ps!!.sendMessage(tag, ms)
        }
    }

    inner class webViewConn(): ServiceConnection{
        override fun onServiceConnected(name: ComponentName?, service: IBinder?) {
            ps = piservice.Stub.asInterface(service)
            ps!!.onMessage(tag, object : piserviceCallBack.Stub(){
                override fun sendMessage(statuCode: Int, message: String?) {
                    var ms = ""
                    if (statuCode == 200){
                        ms = "javascript:window.pi_sdk.piService.onBindService(undefined, '$message')"
                    }else if(statuCode == 400){
                        ms = "javascript:window.pi_sdk.piService.onBindService({code: -4, reason: $message},undefined)"
                    }else if (statuCode == 600){
                        var newMessage = message
                        if (message!!.contains("\\")){
                            newMessage = message.replace("\\","\\\\\\")
                            Log.d("piservice","javascript:$newMessage")
                        }
                        ms = String.format("javascript:window.onWebViewPostMessage('%s','%s')", "JSVM", newMessage)
                    }
                    runOnUiThread { ynWebView.evaluateJavascript(ms) }
                }
            })
        }

        override fun onServiceDisconnected(name: ComponentName?) {

        }
    }




    companion object {
        const val APP_RESULT_CODE = 912
        val URL_RES_ID = R.string.init_url
    }
}



