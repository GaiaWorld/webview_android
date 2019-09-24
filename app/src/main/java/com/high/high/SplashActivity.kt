package com.high.high

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import android.view.View
import com.high.pi_framework.framework.WebViewActivity

class SplashActivity : Activity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        if (!this.isTaskRoot && intent != null) {
            val action = intent.action
            if (intent.hasCategory(Intent.CATEGORY_LAUNCHER) && Intent.ACTION_MAIN == action) {
                finish()
                return
            }
        } else {
            val decorView = window.decorView
            val uiOptions = View.SYSTEM_UI_FLAG_HIDE_NAVIGATION or View.SYSTEM_UI_FLAG_FULLSCREEN
            decorView.systemUiVisibility = uiOptions
            startActivity(Intent(this, WebViewActivity::class.java))
            finish()
        }
    }


}