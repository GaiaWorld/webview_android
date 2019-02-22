package com.kuplay.kuplay

import android.app.Application
import com.bytedance.sdk.openadsdk.TTAdManager
import com.kuplay.pi_framework.webview.YNWebView

class App : Application() {
    override fun onCreate() {
        super.onCreate()
        YNWebView.getX5Open(this)
    }
}