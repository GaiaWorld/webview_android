package com.baomix.pi_module
import android.Manifest
import android.support.v4.app.ActivityCompat
import com.github.dfqin.grantor.PermissionListener
import com.github.dfqin.grantor.PermissionsUtil
import com.baomix.pi_framework.base.BaseJSModule
import com.baomix.pi_framework.webview.YNWebView
import com.baomix.pi_module.ADList.RewardVideo
import com.baomix.pi_module.ADList.douyin.DouyinRewardVideo

class ADUnion(ynWebView: YNWebView):BaseJSModule(ynWebView) {
    private var GDTRewardVideo : RewardVideo
    private var DYRewardVideo : DouyinRewardVideo
    init {
        GDTRewardVideo = RewardVideo(yn)
        DYRewardVideo = DouyinRewardVideo(yn)
    }

    fun showRewardVideoAD(platform: Int,callBack: (callType: Int, prames: Array<Any>)->Unit) {
        PermissionsUtil.requestPermission(ctx!!, object : PermissionListener {
            override fun permissionGranted(permission: Array<String>) {
                if (ctx != null) {
                    if (!ActivityCompat.shouldShowRequestPermissionRationale(ctx!!, Manifest.permission.WRITE_EXTERNAL_STORAGE)) {
                        ActivityCompat.requestPermissions(ctx!!, arrayOf(Manifest.permission.WRITE_EXTERNAL_STORAGE), 0)
                    }
                    if (platform == 1) {
                        if (GDTRewardVideo.mAdList.count()>0){
                            GDTRewardVideo.showAD(callBack)
                        }else{
                            GDTRewardVideo.fetchAD { callType, prames ->
                                if (callType == BaseJSModule.SUCCESS){
                                    GDTRewardVideo.showAD(callBack)
                                }else{
                                    callBack(BaseJSModule.FAIL, arrayOf("用户拒绝了权限"))
                                }
                            }
                        }
                    }
                    else if (platform == 2){
                        if (DYRewardVideo.mAdList.count()>0){
                            DYRewardVideo.showAd(callBack)
                        }else{
                            DYRewardVideo.fetchAD { callType, prames ->
                                if (callType == BaseJSModule.SUCCESS){
                                    DYRewardVideo.showAd(callBack)
                                }else{
                                    callBack(BaseJSModule.FAIL, arrayOf("用户拒绝了权限"))
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

    fun loadRewardVideoAD(platform: Int,callBack: (callType: Int, prames: Array<Any>)->Unit) {
        PermissionsUtil.requestPermission(ctx!!, object : PermissionListener {
            override fun permissionGranted(permission: Array<String>) {
                if (ctx != null) {
                    if (!ActivityCompat.shouldShowRequestPermissionRationale(ctx!!, Manifest.permission.WRITE_EXTERNAL_STORAGE)) {
                        ActivityCompat.requestPermissions(ctx!!, arrayOf(Manifest.permission.WRITE_EXTERNAL_STORAGE), 0)
                    }
                    if (platform == 1) GDTRewardVideo.fetchAD(callBack)
                    else if (platform == 2)DYRewardVideo.fetchAD(callBack)
                }
            }
            override fun permissionDenied(permission: Array<String>) {
                callBack(BaseJSModule.FAIL, arrayOf( "用户拒绝了权限"))
            }
        }, arrayOf(Manifest.permission.WRITE_EXTERNAL_STORAGE), true, mTipInfo)
    }

}
