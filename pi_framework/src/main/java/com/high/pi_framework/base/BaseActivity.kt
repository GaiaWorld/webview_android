package com.high.pi_framework.base

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.os.Bundle
import android.support.v7.app.AppCompatActivity
import android.text.TextUtils
import android.widget.Toast
import com.high.pi_framework.Util.AndroidBug5497Workaround
import com.high.pi_framework.Util.AndroidWorkaround
import com.high.pi_framework.Util.Logger
import com.high.pi_framework.Util.ToastManager
import com.high.pi_framework.framework.JSBridge
import com.high.pi_framework.framework.WebViewActivity
import com.high.pi_framework.webview.YNWebView

abstract class BaseActivity : AppCompatActivity(), BaseView {

    var isHome: Boolean = false

    var ynWebView = YNWebView()

    private var registered = false

    /**
     * Get the layout resource from XML.
     *
     * @return layout resource from XML.
     */
    protected abstract val layoutResources: Int

    /**
     * mBackgroundReceiver is a listener to listen the application's lifecycle
     * when user lock the screen and press home key,the event will be push to ts.
     */
    private val mBackgroundReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context, intent: Intent) {
            val action = intent.action
            if (TextUtils.isEmpty(action)) return
            when (action) {
                //亮屏
                Intent.ACTION_SCREEN_ON -> { }
                //锁屏
                Intent.ACTION_SCREEN_OFF -> {
                    if (isHome) return
                    gotoBackground()
                }
                //解锁屏幕
                Intent.ACTION_USER_PRESENT -> {
                    if (isHome) return
                    gotoForeground()
                }
                Intent.ACTION_CLOSE_SYSTEM_DIALOGS -> {
                    val reason = intent.getStringExtra(SYSTEM_DIALOG_REASON_KEY)
                    if (null != reason) {
                        if (reason.equals(SYSTEM_DIALOG_REASON_HOME_LONG_KEY,true)) {
                            return
                        }
                        else if (reason.equals(SYSTEM_DIALOG_REASON_HOME_KEY,true)) {
                            if (isHome) return
                            isHome = true
                            gotoBackground()
                        }
                    }
                }
            }
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        if (NO_LAYOUT != layoutResources) {
            this.setContentView(layoutResources)
            this.setFitSystemWindows()
            this.initViews()
        }
        if (!registered) {
            registerAppLifeListener()
            registered = true
        }
        this.initData()
    }

    private fun setFitSystemWindows() {
        if (AndroidWorkaround.checkDeviceHasNavigationBar(this)) {
            AndroidWorkaround.assistActivity(findViewById(android.R.id.content))
        } else {
            AndroidBug5497Workaround.assistActivity(this)
        }
    }

    /**
     * As the method name said,this method is used to initialize views on this activity.
     */
    protected abstract fun initViews()

    /**
     * Initialize basic data.
     */
    protected abstract fun initData()

    /**
     * Show the toast tip
     *
     * @param resId the message's id of what would you like to tip
     */
    override fun onToast(resId: Int) {
        this.onToast(resources.getString(resId))
    }

    /**
     * Show the toast tip
     *
     * @param msg the message of what would you like to tip
     */
    override fun onToast(msg: String) {
        this.onToast(msg, Toast.LENGTH_SHORT)
    }

    /**
     * Show the toast tip
     *
     * @param msg      the message of what would you like to tip
     * @param duration the message last time.
     */
    override fun onToast(msg: String, @ToastManager.Duration duration: Int) {
        ToastManager.toast(this, msg, duration)
    }

    /**
     * Show the toast tip
     *
     * @param msg      the message's id of what would you like to tip.
     * @param duration the message last time.
     */
    override fun onToast(msg: Int, duration: Int) {
        this.onToast(resources.getString(msg), duration)
    }

    /**
     * Hide the content being prompted.
     */
    override fun onHideToast() {
        ToastManager.hideToast()
    }

    /**
     * Register the broadcast receiver.
     */
    private fun registerAppLifeListener() {
        val filter = IntentFilter()
        filter.addAction(Intent.ACTION_SCREEN_ON)//亮屏
        filter.addAction(Intent.ACTION_SCREEN_OFF)//锁屏
        filter.addAction(Intent.ACTION_USER_PRESENT)//解锁屏幕
        filter.addAction(Intent.ACTION_CLOSE_SYSTEM_DIALOGS)
        registerReceiver(mBackgroundReceiver, filter)
    }


    /**
     * App已经进入后台
     */
    private fun gotoBackground() {
//        WebViewActivity.isWebViewFirst = "true"
        Logger.error("BaseActivity", "App进入后台")
//        JSBridge.sendJS(ynWebView,"PI_App",ON_BACK_PRESSED, arrayOf("App进入后台"))

    }

    /**
     * App进入前台
     */
    private fun gotoForeground() {
        isHome = false
        Logger.error("BaseActivity", "App进入前台")
//        JSBridge.sendJS(ynWebView,"PI_App",ON_APP_RESUMED, arrayOf("App进入前台"))
    }


    override fun onDestroy() {
        if (registered) {
            try {
                unregisterReceiver(mBackgroundReceiver)
            } catch (e: IllegalArgumentException) {
                e.printStackTrace()
            }
            registered = false
        }
        super.onDestroy()
    }

    companion object {
        const val ON_APP_RESUMED = "onResumed"
        const val ON_BACK_PRESSED = "onBackPressed"
        private const val SYSTEM_DIALOG_REASON_KEY = "reason"
        private const val SYSTEM_DIALOG_REASON_HOME_KEY = "homekey"
        private const val SYSTEM_DIALOG_REASON_HOME_LONG_KEY = "recentapps"
        protected const val NO_LAYOUT = -1//No Layout Resources.
    }
}