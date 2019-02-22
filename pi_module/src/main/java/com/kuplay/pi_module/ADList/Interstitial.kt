package com.kuplay.pi_module.ADList

import android.util.Log
import com.kuplay.pi_framework.webview.YNWebView
import com.kuplay.pi_module.ADList.GDT.Constants
import com.qq.e.ads.interstitial.InterstitialAD
import com.qq.e.ads.interstitial.InterstitialADListener
import com.qq.e.comm.util.AdError

//插屏广告   withMask 是否有遮罩层
class Interstitial(private var withMask: Boolean, val ynwebView: YNWebView) : InterstitialADListener,BaseAD(ynwebView) {
    private val interstitialAD: InterstitialAD
    init {
        interstitialAD = InterstitialAD(ctx!!,
            Constants.APPID,
            Constants.InterteristalPosID
        )
        interstitialAD.setADListener(this)
        interstitialAD.loadAD()
    }

    //    广告加载完成
    override fun onADReceive() {
        Log.e("GDTUnion", "interstitialAD received")
        if (withMask) {
            //            广告有遮罩层
            interstitialAD.show()
        } else {
            //            广告无遮罩层
            interstitialAD.showAsPopupWindow()
        }
    }

    //    加载广告失败
    override fun onNoAD(adError: AdError) {

    }

    override fun onADOpened() {

    }

    //    广告曝光
    override fun onADExposure() {

    }

    //    广告点击
    override fun onADClicked() {

    }

    //    因为点击广告而离开app
    override fun onADLeftApplication() {

    }

    //    广告关闭
    override fun onADClosed() {

    }
}