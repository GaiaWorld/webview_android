package com.kuplay.pi_module.ADList

import android.animation.ValueAnimator
import android.view.View
import android.view.ViewGroup
import com.kuplay.pi_framework.webview.YNWebView
import com.kuplay.pi_module.ADList.GDT.Constants
import com.qq.e.ads.banner.ADSize
import com.qq.e.ads.banner.BannerADListener
import com.qq.e.ads.banner.BannerView
import com.qq.e.comm.util.AdError

class Banner(ynWebView: YNWebView) : BannerADListener,BaseAD(ynWebView) {
    private val bannerView: BannerView = BannerView(ctx!!, ADSize.BANNER,
        Constants.APPID,
        Constants.BannerPosID
    )
    private var bannerShowed = false
    private var bannerHeight = 0
    init {
        //        banner广告自动轮播刷新频率，为0或30~120之间的数字，单位为s，
        //        为0时不自动轮播，默认30s
        bannerView.setRefresh(30)

        //        设置广告回调
        bannerView.setADListener(this)

        bannerView.loadAD()

        //        显示广告关闭按钮，此处设置显示，默认不显示
        bannerView.setShowClose(true)
    }

    //    广告加载失败
    override fun onNoAD(adError: AdError) {

    }

    //    广告加载成功，广告资源已加载完毕
    override fun onADReceiv() {
        val params = ViewGroup.MarginLayoutParams(
            ViewGroup.MarginLayoutParams.MATCH_PARENT,
            ViewGroup.MarginLayoutParams.WRAP_CONTENT
        )
        //        显示广告
        ctx!!.addContentView(bannerView, params)
    }

    //    广告曝光(显示)回调
    override fun onADExposure() {
        val bh = bannerView.height
        bannerHeight = bh
        (bannerView.layoutParams as ViewGroup.MarginLayoutParams).topMargin = -bh



        val webHeight = (webView as View).height

        //        如果广告未显示(即新建广告，而不是广告自己刷新)，webview下移并减小高度，
        //        过度用属性动画完成
        if (!bannerShowed) {
            bannerShowed = true
            //            params.height = webHeight - bannerHeight;
            //            params.width = webWidth;
            //            params.topMargin = bannerHeight;

            val va = ValueAnimator.ofInt(0, bannerHeight)
            va.addUpdateListener { animation ->
                val top = animation.animatedValue as Int

                ((webView as View).layoutParams as ViewGroup.MarginLayoutParams).topMargin = top
                (webView as View).layoutParams.height = webHeight - top
                (webView as View).requestLayout()

                (bannerView.layoutParams as ViewGroup.MarginLayoutParams).topMargin = top - bannerHeight
                bannerView.requestLayout()
            }
            va.duration = 500
            va.start()
        }
    }

    //    点击广告关闭按钮回调
    override fun onADClosed() {
        bannerShowed = false

        //        属性动画
        val va = ValueAnimator.ofInt(0, bannerHeight)
        va.addUpdateListener { animation ->
            val cur = animation.animatedValue as Int

            ((webView as View).layoutParams as ViewGroup.MarginLayoutParams).topMargin = bannerHeight - cur
            (webView as View).layoutParams.height += cur
            (webView as View).requestLayout()

            (bannerView.layoutParams as ViewGroup.MarginLayoutParams).topMargin = -cur
            bannerView.requestLayout()
            if (cur == bannerHeight) {
                bannerView.destroy()
            }
        }
        va.duration = 500
        va.start()
    }

    //    点击广告
    override fun onADClicked() {

    }

    //    由于点击广告离开app
    override fun onADLeftApplication() {

    }

    //    当广告打开浮层时调用，如打开内置浏览器、内容展示浮层，一般发生在点击之后
    override fun onADOpenOverlay() {

    }

    //    浮层关闭
    override fun onADCloseOverlay() {

    }
}