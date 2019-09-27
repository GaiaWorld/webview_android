package com.high.ydzm

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import android.os.Handler
import android.util.Log
import android.view.View
import com.high.pi_framework.framework.NewWebViewActivity
import com.high.pi_framework.framework.WebViewActivity
import com.high.pi_framework.webview.YNWebView

class SplashActivity : Activity() {

    //================life=============
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        if (!this.isTaskRoot) {
            val action = intent.action
            if (intent.hasCategory(Intent.CATEGORY_LAUNCHER) && Intent.ACTION_MAIN == action) {
                finish()
            }
        }else{
            val decorView = window.decorView
            val uiOptions = View.SYSTEM_UI_FLAG_HIDE_NAVIGATION or View.SYSTEM_UI_FLAG_FULLSCREEN
            decorView.systemUiVisibility = uiOptions
            YNWebView.getX5Open {
                val handler = Handler()
                // handler.postDelayed( Runnable {
                    startActivity(Intent(this, WebViewActivity::class.java))
                    overridePendingTransition(0, 0);
                    finish()
                // },200)
            }
        }
    }
}