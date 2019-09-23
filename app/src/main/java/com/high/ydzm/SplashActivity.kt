package com.high.ydzm

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import android.os.Handler
import android.util.Log
import android.view.View
import com.high.pi_framework.framework.NewWebViewActivity
import com.high.pi_framework.framework.WebViewActivity

class SplashActivity : Activity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        Handler().postDelayed(Runnable {
            if (!this.isTaskRoot) {
                Log.d("splashActivtity", "54321")
                val action = intent.action
                if (intent.hasCategory(Intent.CATEGORY_LAUNCHER) && Intent.ACTION_MAIN == action) {
                    finish()
                }
            }
//            } else {
//                if (NewWebViewActivity.gameExit == true && NewWebViewActivity.isDefaultClose != false ){
//                    Log.d("splashActivtity","12345")
//                    WebViewActivity.isWebViewFirst = "false"
//                    startActivity(Intent(this, NewWebViewActivity::class.java))
//                    overridePendingTransition(0, 0);
//                    finishAndRemoveTask()
//                }
            else{
                    Log.d("splashActivtity","11111")
                    val decorView = window.decorView
                    val uiOptions = View.SYSTEM_UI_FLAG_HIDE_NAVIGATION or View.SYSTEM_UI_FLAG_FULLSCREEN
                    decorView.systemUiVisibility = uiOptions
                    startActivity(Intent(this, WebViewActivity::class.java))
                    overridePendingTransition(0, 0);
                    finish()
            }

        }, 500)

    }


}