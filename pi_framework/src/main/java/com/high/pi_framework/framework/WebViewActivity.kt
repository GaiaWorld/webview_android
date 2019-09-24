package com.high.pi_framework.framework

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.os.Bundle
import android.util.Log
import android.view.WindowManager
import android.widget.RelativeLayout
import com.high.pi_framework.R
import com.high.pi_framework.Util.FileUtil
import com.high.pi_framework.Util.PrefMgr
import com.high.pi_framework.Util.ViewUtil
import com.high.pi_framework.base.BaseWebView
import com.high.pi_framework.module.LocalLanguageMgr
import com.high.pi_framework.piv8.JSVMManager
import com.high.pi_service.V8
import com.high.pi_framework.piv8.piv8Service
import com.high.pi_framework.webview.YNWebView
import kotlinx.android.synthetic.main.layout_fake_status_bar_view.*
import java.io.File


class WebViewActivity : BaseWebView() {
    private lateinit var mJsIntercept: JSIntercept
    private lateinit var mRlRootView: RelativeLayout


    private lateinit var runtime: com.high.pi_service.V8
    /**
     * Get the layout resource from XML.
     *
     * @return layout resource from XML.
     */
    override val layoutResources: Int get() = R.layout.activity_webview

    override fun onCreate(savedInstanceState: Bundle?) {
        ynWebView.createYnWebView(this)
        YNWebView.addWithName("default",ynWebView)
        addJEV(this)
        super.onCreate(savedInstanceState)
        val intent = Intent(this, piv8Service::class.java)
        this.startService(intent)
    }


    /**
     * As the method name said,this method is used to initialize views on this activity.
     */
    override fun initViews() {
        mRlRootView = findViewById(R.id.app_main_rl_root_view)
        mRlRootView.removeAllViews()
        ynWebView.addYnWebView(mRlRootView)
        status_bar.layoutParams.height = ViewUtil.getStatusBarHeight(this).toInt()
    }

    /**
     * Initialize basic data.
     */
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

    override fun onRestart() {
        if (NewWebViewActivity.gameExit == true){
            startActivity(Intent(this, NewWebViewActivity::class.java))
            overridePendingTransition(0, 0)
        }
        super.onRestart()
        JSBridge.sendJS(ynWebView,"PI_App",ON_APP_RESUMED, arrayOf("App进入前台"))
    }




    override fun onBackPressed() {
        JSBridge.sendJS(ynWebView,"PI_Activity",ON_BACK_PRESSED, arrayOf("App进入后台"))
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        ynWebView.jsImpl!!.onActivityResult(requestCode, resultCode, data)
        super.onActivityResult(requestCode, resultCode, data)
    }

    private fun registerBc() {
        val intentFilter = IntentFilter()
        intentFilter.addAction("send_messagedefault")
        registerReceiver(mReceiver, intentFilter)
    }

    private val mReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context?, intent: Intent?) {
            val action = intent?.action ?: return
            when (action) {
                "send_messagedefault" -> {
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

    override fun onDestroy() {
        unregisterReceiver(mReceiver)
        super.onDestroy()
    }

    override fun onResume() {
        addJEV(this)
        super.onResume()
    }

    companion object {
        const val APP_RESULT_CODE = 912
        val URL_RES_ID = R.string.init_url
    }
}



