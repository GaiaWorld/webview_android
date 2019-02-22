package com.kuplay.pi_module.ADList

import android.content.Context
import android.os.SystemClock
import android.util.Log
import com.kuplay.pi_framework.base.BaseJSModule
import com.kuplay.pi_framework.framework.CallJSRunnable
import com.kuplay.pi_framework.webview.YNWebView
import com.kuplay.pi_module.ADList.GDT.Constants
import com.qq.e.ads.rewardvideo.RewardVideoAD
import com.qq.e.ads.rewardvideo.RewardVideoADListener
import com.qq.e.comm.util.AdError

class RewardVideo(ynWebView: YNWebView) : RewardVideoADListener,BaseAD(ynWebView) {
    private var rewardVideoAD: RewardVideoAD? = null
    //    广告过期时间,过期后不能使用
    //private var expireTimestamp: Long = 0

    private lateinit var fetchBack : (callType: Int, prames: Array<Any>)->Unit

    var mAdList = mutableListOf<Any>()

    var cb = 0

    //    拉取广告
    fun fetchAD(callBack: (callType: Int, prames: Array<Any>)->Unit) {
        fetchBack = callBack
        val r = RewardVideoAD(ctx!!, Constants.APPID, Constants.RewardVideoADPosIDSupportH, this)
        r.loadAD()
        mAdList.add(r)
    }

    //  播放广告
    fun showAD(cbID: Int,callBack: (callType: Int, prames: Array<Any>)->Unit){
        val delta: Long = 1000   // 加个保险，防止广告过期
        cb = cbID
        this.callBack = callBack
        //删除过期视频
        //激励视频广告只能显示一次，如果广告已显示，或已过期，则重新拉取广告显示
        for (r in mAdList){
            if ((r as RewardVideoAD).hasShown() && SystemClock.elapsedRealtime() > (r as RewardVideoAD).expireTimestamp - delta) mAdList.remove(r)
            else break
        }
        if (mAdList.isEmpty()){
            val func = "window['handle_Native_Message']($cb, 100, 0, '发放奖励', '没有广告')"
            ctx!!.runOnUiThread ( CallJSRunnable(func,yn!!) )
        }else{
            rewardVideoAD = mAdList[0] as RewardVideoAD
            rewardVideoAD!!.showAD()
        }


    }

    //    广告加载成功
    override fun onADLoad() {
        //expireTimestamp = rewardVideoAD!!.expireTimestamp
        //Log.e("GDT", "reward video deadline:$expireTimestamp")
    }

    //    视频素材缓存成功，可在此处对广告进行展示
    override fun onVideoCached() {
        fetchBack(BaseJSModule.SUCCESS, arrayOf(""))
    }

    //    广告显示回调
    override fun onADShow() {
        Log.e("GDT", "reward video have shown")
    }

    //    广告曝光
    override fun onADExpose() {
        Log.e("GDT", "reward video expose")
    }

    //    在此发放奖励
    override fun onReward() {
        mAdList.remove(rewardVideoAD!!)
        //
        val func = "window['handle_Native_Message']($cb, 100, 1, '发放奖励', '成功')"
        ctx!!.runOnUiThread ( CallJSRunnable(func,yn!!) )

        //callBack(BaseJSModule.SUCCESS, arrayOf("success"))

        Log.e("GDT", "reward video should reward.")
    }


    override fun onADClick() {

    }

    override fun onVideoComplete() {
        Log.e("GDT", "reward video complete")
    }

    override fun onADClose() {
        val func = "window['handle_Native_Message']($cb, 100, 1, '关闭广告', '成功')"
        ctx!!.runOnUiThread ( CallJSRunnable(func,yn!!) )
        callBack(BaseJSModule.SUCCESS, arrayOf(""))
        Log.e("GDT", "reward video close")
    }

    override fun onError(adError: AdError) {
        Log.e("GDT", "reward video error")
    }
}
