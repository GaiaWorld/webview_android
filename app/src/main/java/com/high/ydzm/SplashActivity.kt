package com.high.ydzm

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import android.view.View
import com.high.pi_framework.framework.NewWebViewActivity
import com.high.pi_framework.framework.WebViewActivity
import com.high.pi_framework.framework.splashUtil
import org.json.JSONObject

class SplashActivity : Activity() {

    /**
     * 读取文件内容
     * 约定1：钱包名：wallet
     * 约定2：钱包不全屏
     *
     */

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
            regToService()

            val content = splashUtil.read()
            if (content.equals("")){
                startActivity(Intent(this, WebViewActivity::class.java))
                finish()
            }else{
                val js = JSONObject(content)
                val init_name = js.getString("init_name")
                if (init_name == "wallet"){
                    startActivity(Intent(this, WebViewActivity::class.java))
                    finish()
                }else{
                    startActivity(Intent(this, NewWebViewActivity::class.java))
                    finish()
                }
            }
        }
    }


    private fun regToService(){
        val intent = Intent("com.high.ydzm.piservice")
        intent.setPackage("com.high.ydzm");
        startService(intent)
    }


}