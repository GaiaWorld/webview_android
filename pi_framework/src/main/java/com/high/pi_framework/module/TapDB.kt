package com.high.pi_framework.module

import android.app.Activity
import android.content.Context
import android.util.Log
import com.tapdb.sdk.TapDB

// 原生代码调用的接口
class TapDB {
    companion object {
        // 是否打印调试信息
        val debug = true

        private fun debugMsg(msg: String) {
            if (debug) {
                Log.e("TapDB", msg)
            }
        }

        // TODO: SDK参数(每个项目根据自己的实际情况填写)
        // 在taptap控制台注册得到的 APP ID，不能为空
        private val appid = "gxi3tmdwvhajttwj"
        // 分包渠道: 可以为空(null)
        private val channel = "high"
        // 游戏版本: 可以为空(null)，为空时，自动获取游戏安装包的版本(AndroidManifest.xml中的versionName)
        private val gameVersion = null

        fun initSDK(ctx: Context) {
            TapDB.init(ctx, appid, channel, gameVersion)
            val info = TapDB.getStartInfo()
            debugMsg("startInfo: $info")
        }

        fun onResume(activity: Activity) {
            TapDB.onResume(activity)
            debugMsg("resume: " + activity.localClassName)
        }

        fun onStop(activity: Activity) {
            TapDB.onStop(activity)
            debugMsg("stop: " + activity.localClassName)
        }
    }
}