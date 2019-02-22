package com.kuplay.pi_module

import android.Manifest
import android.content.Intent
import android.os.Environment
import android.provider.MediaStore
import android.support.v4.app.ActivityCompat
import android.support.v4.content.FileProvider
import com.bytedance.sdk.openadsdk.TTAdManager
import com.github.dfqin.grantor.PermissionListener
import com.github.dfqin.grantor.PermissionsUtil
import com.kuplay.pi_framework.base.BaseJSModule
import com.kuplay.pi_framework.webview.YNWebView
import com.kuplay.pi_module.ADList.Banner
import com.kuplay.pi_module.ADList.Interstitial
import com.kuplay.pi_module.ADList.NativeExpress
import com.kuplay.pi_module.ADList.RewardVideo
import com.kuplay.pi_module.ADList.douyin.DouyinRewardVideo
import java.io.File
import java.io.IOException

class ADUnion(ynWebView: YNWebView):BaseJSModule(ynWebView) {
    private var interstitialWithMask = false
    private val GDT_TYPE = 1
    private val DY_TYPE = 2
    private lateinit var GDTRewardVideo : RewardVideo
    private lateinit var DYRewardVideo : DouyinRewardVideo
    init {
        GDTRewardVideo = RewardVideo(yn)
        DYRewardVideo = DouyinRewardVideo(yn)
    }

    fun showRewardVideoAD(cbID: Int,adType: Int,callBack: (callType: Int, prames: Array<Any>)->Unit) {
        PermissionsUtil.requestPermission(ctx!!, object : PermissionListener {
            override fun permissionGranted(permission: Array<String>) {
                if (ctx != null) {
                    if (!ActivityCompat.shouldShowRequestPermissionRationale(ctx!!, Manifest.permission.WRITE_EXTERNAL_STORAGE)) {
                        ActivityCompat.requestPermissions(ctx!!, arrayOf(Manifest.permission.WRITE_EXTERNAL_STORAGE), 0)
                    }
                    if (adType == 1) {
                        if (GDTRewardVideo.mAdList.count()>0){
                            GDTRewardVideo.showAD(cbID,callBack)
                        }else{
                            GDTRewardVideo.fetchAD { callType, prames ->
                                if (callType == BaseJSModule.SUCCESS){
                                    GDTRewardVideo.showAD(cbID,callBack)
                                }
                            }
                        }
                    }
                    else if (adType == 2){
                        if (DYRewardVideo.mAdList.count()>0){
                            DYRewardVideo.showAd(cbID,callBack)
                        }else{
                            DYRewardVideo.fetchAD { callType, prames ->
                                if (callType == BaseJSModule.SUCCESS){
                                    DYRewardVideo.showAd(cbID,callBack)
                                }
                            }
                        }
                    }
                }
            }
            override fun permissionDenied(permission: Array<String>) {
                callBack(BaseJSModule.FAIL, arrayOf( "用户拒绝了权限"))
            }
        }, arrayOf(Manifest.permission.WRITE_EXTERNAL_STORAGE), true, mTipInfo)

    }

    fun loadRewardVideoAD(adType: Int,callBack: (callType: Int, prames: Array<Any>)->Unit) {
        PermissionsUtil.requestPermission(ctx!!, object : PermissionListener {
            override fun permissionGranted(permission: Array<String>) {
                if (ctx != null) {
                    if (!ActivityCompat.shouldShowRequestPermissionRationale(ctx!!, Manifest.permission.WRITE_EXTERNAL_STORAGE)) {
                        ActivityCompat.requestPermissions(ctx!!, arrayOf(Manifest.permission.WRITE_EXTERNAL_STORAGE), 0)
                    }
                    if (adType == 1) GDTRewardVideo.fetchAD(callBack)
                    else if (adType == 2)DYRewardVideo.fetchAD(callBack)
                }
            }
            override fun permissionDenied(permission: Array<String>) {
                callBack(BaseJSModule.FAIL, arrayOf( "用户拒绝了权限"))
            }
        }, arrayOf(Manifest.permission.WRITE_EXTERNAL_STORAGE), true, mTipInfo)
    }

}