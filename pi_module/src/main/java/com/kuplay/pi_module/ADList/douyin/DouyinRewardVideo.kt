package com.kuplay.pi_module.ADList.douyin


import com.bytedance.sdk.openadsdk.*
import com.kuplay.pi_framework.base.BaseJSModule
import com.kuplay.pi_framework.framework.CallJSRunnable
import com.kuplay.pi_framework.webview.YNWebView
import com.kuplay.pi_module.ADList.BaseAD

class DouyinRewardVideo(ynWebView: YNWebView):BaseAD(ynWebView) {
    //step1:初始化sdk
    val ttAdManager = TTAdManagerHolder.getInstance(ctx!!)
    //step2:(可选，强烈建议在合适的时机调用):申请部分权限，如read_phone_state,防止获取不了imei时候，下载类广告没有填充的问题。
    //step3:创建TTAdNative对象,用于调用广告请求接口
    var mTTAdNative : TTAdNative
    var mttRewardVideoAd : TTRewardVideoAd? = null
    var cb = 0
    init {
        ttAdManager.requestPermissionIfNecessary(ctx!!)
        mTTAdNative = ttAdManager.createAdNative(ctx!!)
    }
    private var mHasShowDownloadActive = false
    var mAdList = mutableListOf<Any>()

    fun showAd(cbID:Int,callBack: (callType: Int, prames: Array<Any>)->Unit){
        cb = cbID
        this.callBack = callBack
        if(!mAdList.isNotEmpty()){
            val func = "window['handle_Native_Message']($cb, 100, 0, '发放奖励', '没有广告')"
            ctx!!.runOnUiThread ( CallJSRunnable(func,yn!!) )
        }else{
            mttRewardVideoAd = mAdList[0] as TTRewardVideoAd
            mttRewardVideoAd!!.setRewardAdInteractionListener(object : TTRewardVideoAd.RewardAdInteractionListener {

                override fun onAdShow() {
                    //TToast.show(ctx!!, "rewardVideoAd show")
                }

                override fun onAdVideoBarClick() {
                    //TToast.show(ctx!!, "rewardVideoAd bar click")
                }

                override fun onAdClose() {
                    val func = "window['handle_Native_Message']($cb, 100, 1, '关闭广告', '成功')"
                    ctx!!.runOnUiThread ( CallJSRunnable(func,yn!!) )

                    callBack(BaseJSModule.SUCCESS, arrayOf(""))
                    //TToast.show(ctx!!, "rewardVideoAd close")
                }

                //视频播放完成回调
                override fun onVideoComplete() {
                    //TToast.show(ctx!!, "rewardVideoAd complete")
                }

                override fun onVideoError() {
                    val func = "window['handle_Native_Message']($cb, 100, 0, '发放奖励', '失败')"
                    ctx!!.runOnUiThread ( CallJSRunnable(func,yn!!) )
                    //TToast.show(ctx!!, "rewardVideoAd error")
                }

                //视频播放完成后，奖励验证回调，rewardVerify：是否有效，rewardAmount：奖励梳理，rewardName：奖励名称
                override fun onRewardVerify(rewardVerify: Boolean, rewardAmount: Int, rewardName: String) {
                    val func = "window['handle_Native_Message']($cb, 100, 1, '发放奖励', '成功')"
                    ctx!!.runOnUiThread ( CallJSRunnable(func,yn!!) )
                    //callBack(BaseJSModule.SUCCESS, arrayOf("success"))
                }
            })
            mttRewardVideoAd!!.setDownloadListener(object : TTAppDownloadListener {
                override fun onIdle() {
                    mHasShowDownloadActive = false
                }

                override fun onDownloadActive(
                    totalBytes: Long,
                    currBytes: Long,
                    fileName: String,
                    appName: String
                ) {
                    if (!mHasShowDownloadActive) {
                        mHasShowDownloadActive = true
                        //TToast.show(ctx!!, "下载中，点击下载区域暂停", Toast.LENGTH_LONG)
                    }
                }

                override fun onDownloadPaused(
                    totalBytes: Long,
                    currBytes: Long,
                    fileName: String,
                    appName: String
                ) {
                    //TToast.show(ctx!!, "下载暂停，点击下载区域继续", Toast.LENGTH_LONG)
                }

                override fun onDownloadFailed(
                    totalBytes: Long,
                    currBytes: Long,
                    fileName: String,
                    appName: String
                ) {
                    //TToast.show(ctx!!, "下载失败，点击下载区域重新下载", Toast.LENGTH_LONG)
                }

                override fun onDownloadFinished(totalBytes: Long, fileName: String, appName: String) {
                    //TToast.show(ctx!!, "下载失败，点击下载区域重新下载", Toast.LENGTH_LONG)
                }

                override fun onInstalled(fileName: String, appName: String) {
                    //TToast.show(ctx!!, "安装完成，点击下载区域打开", Toast.LENGTH_LONG)
                }
            })
            ctx!!.runOnUiThread {  mttRewardVideoAd!!.showRewardVideoAd(ctx!!)  }
            mAdList.removeAt(0)
        }
    }

    fun fetchAD(callBack: (callType: Int, prames: Array<Any>) -> Unit){

        val codeId = "901121365"
        val orientation = TTAdConstant.VERTICAL
        //step4:创建广告请求参数AdSlot,具体参数含义参考文档
        val adSlot = AdSlot.Builder()
            .setCodeId(codeId)
            .setSupportDeepLink(true)
            .setImageAcceptedSize(1080, 1920)
            .setRewardName("金币") //奖励的名称
            .setRewardAmount(3)  //奖励的数量
            .setUserID("user123")//用户id,必传参数
            .setMediaExtra("media_extra") //附加参数，可选
            .setOrientation(orientation) //必填参数，期望视频的播放方向：TTAdConstant.HORIZONTAL 或 TTAdConstant.VERTICAL
            .build()
        //step5:请求广告
        mTTAdNative.loadRewardVideoAd(adSlot, object : TTAdNative.RewardVideoAdListener {
            override fun onError(code: Int, message: String) {
                //TToast.show(ctx!!, message)
            }

            //视频广告加载后，视频资源缓存到本地的回调，在此回调后，播放本地视频，流畅不阻塞。
            override fun onRewardVideoCached() {
                //TToast.show(ctx!!, "rewardVideoAd video cached")
            }

            //视频广告的素材加载完毕，比如视频url等，在此回调后，可以播放在线视频，网络不好可能出现加载缓冲，影响体验。
            override fun onRewardVideoAdLoad(ad: TTRewardVideoAd) {
                //TToast.show(ctx!!, "rewardVideoAd loaded")]
                //mttRewardVideoAd = ad
                //播放广告
                //                mttRewardVideoAd.setShowDownLoadBar(false);
                mAdList.add(ad)
                //mttRewardVideoAd = ad
                callBack(BaseJSModule.SUCCESS, arrayOf(""))


            }
        })
    }

}