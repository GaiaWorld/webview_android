package com.kuplay.pi_module.ADList

import android.app.Activity
import android.content.Intent
import android.util.Log
import android.view.ViewGroup
import com.kuplay.pi_module.ADList.GDT.Constants
import com.qq.e.ads.splash.SplashAD
import com.qq.e.ads.splash.SplashADListener
import com.qq.e.comm.util.AdError

class Splash : SplashADListener {
    private var splash: SplashAD? = null
    private var mActivity: Activity? = null
    private var nextActivity: Class<*>? = null

    /**
     * 添加闪屏广告
     * @param activity     将闪屏添加到该activity
     * @param nextActivity 闪屏结束的下一个activity
     */
    fun addSplashAD(activity: Activity, nextActivity: Class<*>) {
        mActivity = activity
        this.nextActivity = nextActivity

        val view = activity.window.decorView as ViewGroup

        splash = SplashAD(activity, view,
            Constants.APPID,
            Constants.SplashPosID, this)
    }

    //    闪屏结束
    override fun onADDismissed() {
        Log.e("GDTUnion", "splash dismissed")
        this.splashFinish()
    }

    //    广告加载失败
    override fun onNoAD(adError: AdError) {
        Log.e("GDTUnion", "splash no ad" + adError.errorMsg)
        this.splashFinish()
    }

    //    广告显示
    override fun onADPresent() {
        Log.e("GDTUnion", "splash showed")
    }

    override fun onADClicked() {
        Log.e("GDTUnion", "splash clicked")
    }

    //    广告剩余显示时间，单位ms
    override fun onADTick(l: Long) {
        //        Log.e("GDTUnion", "splash ticking:" + l);
    }

    //    广告曝光
    override fun onADExposure() {
        Log.e("GDTUnion", "splash exposured")
    }

    //    闪屏结束，进入新的activity
    private fun splashFinish() {
        mActivity!!.startActivity(Intent(mActivity, nextActivity))
        mActivity!!.finish()
    }
}