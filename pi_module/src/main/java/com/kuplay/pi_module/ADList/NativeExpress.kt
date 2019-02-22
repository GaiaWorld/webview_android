package com.kuplay.pi_module.ADList

import android.util.Log
import android.view.ViewGroup
import com.kuplay.pi_framework.webview.YNWebView
import com.kuplay.pi_module.ADList.GDT.Constants
import com.kuplay.pi_module.R
import com.qq.e.ads.cfg.BrowserType
import com.qq.e.ads.cfg.DownAPPConfirmPolicy
import com.qq.e.ads.nativ.ADSize
import com.qq.e.ads.nativ.NativeExpressAD
import com.qq.e.ads.nativ.NativeExpressADView
import com.qq.e.comm.util.AdError

class NativeExpress(ynWebView: YNWebView) : NativeExpressAD.NativeExpressADListener,BaseAD(ynWebView) {
    private val ad: NativeExpressAD
    private var currentAd: NativeExpressADView? = null
    private val container: ViewGroup

    init {
        container = ctx!!.findViewById(R.id.app_main_rl_root_view)

        this.ad = NativeExpressAD(ctx!!, ADSize(ADSize.FULL_WIDTH, ADSize.AUTO_HEIGHT),
            Constants.APPID,
            Constants.NativeExpressPosID, this)

        //        一次只加载一个广告
        this.ad.loadAD(1)
    }

    /**
     * 显示广告链接的浏览器类型
     * @param bt Inner(App内置浏览器), Sys(系统浏览器), Default(sdk按照默认逻辑选择)
     */
    fun setBrowserType(bt: BrowserType) {
        this.ad.setBrowserType(bt)
    }

    /**
     * 指定点击app广告后是否展示二次确认
     * @param policy Default,(WiFi不展示，非WiFi展示), NoConfirm(所有情况均不展示)
     */
    fun setDownAppConfirmPolicy(policy: DownAPPConfirmPolicy) {
        this.ad.setDownAPPConfirmPolicy(policy)
    }

    //    广告加载成功，返回广告列表
    override fun onADLoaded(list: List<NativeExpressADView>) {
        if (currentAd != null) {
            currentAd!!.destroy()
        }
        currentAd = list[0]
        currentAd!!.render()
        container.addView(currentAd)
    }

    //    广告渲染失败
    override fun onRenderFail(nativeExpressADView: NativeExpressADView) {
        Log.e("GDTUnion", "native express ad render fail")
    }

    //    广告渲染成功
    override fun onRenderSuccess(nativeExpressADView: NativeExpressADView) {
        Log.e("GDTUnion", "native express ad render success")
    }

    //    广告曝光
    override fun onADExposure(nativeExpressADView: NativeExpressADView) {
        Log.e("GDTUnion", "native express ad exposure")
    }

    override fun onADClicked(nativeExpressADView: NativeExpressADView) {

    }

    //    广告关闭，广告资源已释放，不可再用
    override fun onADClosed(nativeExpressADView: NativeExpressADView) {
        Log.e("GDTUnion", "native express ad closed")
    }

    //    因为广告点击而离开当前app
    override fun onADLeftApplication(nativeExpressADView: NativeExpressADView) {
        Log.e("GDTUnion", "native express ad left app")
    }

    //    广告展开遮盖时调用
    override fun onADOpenOverlay(nativeExpressADView: NativeExpressADView) {
        Log.e("GDTUnion", "native express ad overlay open")
    }

    //    广告关闭遮盖时调用
    override fun onADCloseOverlay(nativeExpressADView: NativeExpressADView) {
        Log.e("GDTUnion", "native express ad overlay close")
    }

    //    广告加载失败
    override fun onNoAD(adError: AdError) {
        Log.e("GDTUnion", "native express ad error")
    }
}