package com.kuplay.pi_framework.framework

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.os.Bundle
import android.util.Base64
import android.util.Log
import android.view.ViewGroup
import android.view.WindowManager
import android.widget.ImageView
import android.widget.RelativeLayout
import com.kuplay.pi_framework.R
import com.kuplay.pi_framework.Util.FileUtil
import com.kuplay.pi_framework.Util.PrefMgr
import com.kuplay.pi_framework.Util.ViewUtil
import com.kuplay.pi_framework.base.BaseActivity
import com.kuplay.pi_framework.base.BaseWebView
import com.kuplay.pi_framework.module.LocalLanguageMgr
import kotlinx.android.synthetic.main.layout_fake_status_bar_view.*
import java.io.File
import android.view.ViewGroup.LayoutParams.FILL_PARENT



class WebViewActivity : BaseWebView() {
    private lateinit var mJsIntercept: JSIntercept
    private lateinit var mRlRootView: RelativeLayout
//    private lateinit var mImageView: ImageView
    /**
     * Get the layout resource from XML.
     *
     * @return layout resource from XML.
     */
    override val layoutResources: Int get() = R.layout.activity_webview

    override fun onCreate(savedInstanceState: Bundle?) {
        setTheme(R.style.FullScreenWithoutAny)
        ynWebView.createYnWebView(this)
        addJEV(this)
        super.onCreate(savedInstanceState)

    }


    /**
     * As the method name said,this method is used to initialize views on this activity.
     */
    override fun initViews() {
        mRlRootView = findViewById(R.id.app_main_rl_root_view)
        mRlRootView.removeAllViews()
//        mImageView = ImageView(this)
//        mImageView.setImageResource(R.drawable.splash)
//        mRlRootView.addView(mImageView,0)
        ynWebView.addYnWebView(mRlRootView)
        status_bar.layoutParams.height = ViewUtil.getStatusBarHeight(this).toInt()
//        AndroidBug5497Workaround.assistActivity(this)
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
            callBack = { callType, prames -> JSBridge(ynWebView).callJS(null, null, 0, callType, prames) })
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
            val urlFile = File(mJsIntercept.bootPath + url)
            //var content = urlFile.readText()
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


    override fun onBackPressed() {
        ynWebView.evaluateJavascript(String.format(BaseActivity.JS_CALLBACK, BaseActivity.ON_BACK_PRESSED))
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
                    val message = intent.getStringExtra("message")
                    val sender = intent.getStringExtra("from_web_view")
                    val callFun = String.format("javascript:window.onWebViewPostMessage('%s','%s')", sender, message)
                    ynWebView.evaluateJavascript(callFun)
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
        //        const val URL = "http://47.75.254.166:8080/wallet/app/boot/index.html"
        //        const val URL = "http://192.168.33.113/wallet/app/boot/index.html"
        val URL_RES_ID = R.string.init_url
        //        const val URL = "https://www.baidu.com"
    }
}