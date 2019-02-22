package com.kuplay.kuplay

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import android.view.View
import com.kuplay.pi_framework.framework.WebViewActivity

class SplashActivity : Activity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        if (!this.isTaskRoot && intent != null) {
            val action = intent.action
            if (intent.hasCategory(Intent.CATEGORY_LAUNCHER) && Intent.ACTION_MAIN == action) {
                finish()
                return
            }
        } else {
            super.onCreate(savedInstanceState)
            val decorView = window.decorView
            val uiOptions = View.SYSTEM_UI_FLAG_HIDE_NAVIGATION or View.SYSTEM_UI_FLAG_FULLSCREEN
            decorView.systemUiVisibility = uiOptions
            startActivity(Intent(this, WebViewActivity::class.java))
            finish()
        }
    }
}