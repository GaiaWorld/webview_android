package com.kuplay.pi_framework.framework

import android.app.Activity
import android.util.Base64
import android.util.Log
import android.webkit.JavascriptInterface
import android.widget.RelativeLayout
import com.kuplay.pi_framework.R
import com.kuplay.pi_framework.Util.FileUtil
import com.kuplay.pi_framework.module.AppUpdater
import com.kuplay.pi_framework.webview.YNWebView
import org.json.JSONObject
import java.io.File

class JSIntercept(ynWebView: YNWebView) {
    private var mBootFilePaths: JSONObject? = null
    private val mConfigPath: String
    private val mActivity = ynWebView.getEnv(ynWebView.ACTIVITY) as Activity
    val bootPath: String = "/data/data/" + mActivity.packageName
    val htmlPath: String = "$bootPath/html"
    val apkPath: String  = "$bootPath/apk_back"
    var isUpdate: Int = 0
    var name: String = ""
    var yn : YNWebView = ynWebView
    init {
        mConfigPath = "$htmlPath/bootFilePaths.json"

        val content = FileUtil.readFile(mConfigPath)
        try {
            if (content !== "") {
                mBootFilePaths = JSONObject(content)
            } else {
                mBootFilePaths = JSONObject()
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }

    }

    @JavascriptInterface
    fun restartApp() {
        //H5更新重启
        val url = mActivity.resources.getString(WebViewActivity.URL_RES_ID)
        var content = FileUtil.readFile(this.htmlPath + url)
        if (content == "") {
            val stream = mActivity.getAssets().open(url.substring(1))
            content = FileUtil.readFile(stream)
        }
        if (content != "") {
            mActivity.runOnUiThread { yn.loadDataWithBaseUrl("file:///android_asset" + url, content); }
        } else {
            Log.d("JSIntercept", "loadUrl Error!!!");
        }
        //android.os.Process.killProcess(android.os.Process.myPid())
    }

    @JavascriptInterface
    fun getAppVersion(listenerID: Int) {
        var name = ""
        try {
            val pm = mActivity.applicationContext.packageManager
            val info = pm.getPackageInfo(mActivity.applicationContext.packageName, 0)
            name = info.versionName
        } catch (e: Exception) {
            e.printStackTrace()
        }

        val func = String.format("window.handle_jsintercept_callback(%d, true, '%s','%d')", listenerID, name, isUpdate)
        mActivity.runOnUiThread(CallJSRunnable(func, yn))
    }

    @JavascriptInterface
    fun updateFinish(listenerID: Int){
        isUpdate = 0
        val versionPath = this.apkPath + "/apkversion.txt"
        val f = File(versionPath)
        f.writeText(name)
        val func = String.format("window.handle_jsintercept_callback(%d, true)",listenerID)
        mActivity.runOnUiThread(CallJSRunnable(func, yn))
    }

    @JavascriptInterface
    fun updateApp(cbID: Int, url: String,listenerID: Int) {
        val updater = AppUpdater(yn, listenerID, cbID)
        updater.updateApp(url)
    }

    @JavascriptInterface
    fun getBootFiles(listenerID: Int) {

        val result = JSONObject()

        try {
            val iterator = mBootFilePaths!!.keys()
            while (iterator.hasNext()) {
                val key = iterator.next() as String
                val fullPath = mBootFilePaths!!.getString(key)
                result.put(key, Base64.encodeToString(FileUtil.readFileToData(fullPath), Base64.NO_WRAP))
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }

        val func = String.format("window.handle_jsintercept_callback(%d, true, '%s')", listenerID, result.toString())
        mActivity.runOnUiThread(CallJSRunnable(func, yn))
    }

    @JavascriptInterface
    fun saveFile(path: String, base64Str: String, listenerID: Int) {
        var path = path
        try {
            if (path.contains(".depend")) {
                path = path.replace(".depend", "depend")
            }

            val fullPath = "$htmlPath/$path"
            val content = Base64.decode(base64Str, Base64.NO_WRAP)
            FileUtil.writeFile(fullPath, content)

            path = path.substring(path.lastIndexOf("/") + 1)
            mBootFilePaths!!.put(path, fullPath)
            FileUtil.writeFile(mConfigPath, mBootFilePaths!!.toString().toByteArray(Charsets.UTF_8))

            Log.d("Intercept", "JSIntercept.saveFile: $fullPath")
            val func = String.format("window.handle_jsintercept_callback(%d, true)", listenerID)
            mActivity.runOnUiThread(CallJSRunnable(func, yn))

        } catch (e: Exception) {
            e.printStackTrace()
        }

    }

}