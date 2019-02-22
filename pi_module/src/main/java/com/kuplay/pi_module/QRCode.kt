package com.kuplay.pi_module

import android.Manifest
import android.content.Intent
import android.os.Build
import android.text.TextUtils
import com.github.dfqin.grantor.PermissionListener
import com.github.dfqin.grantor.PermissionsUtil
import com.iqos.qrscanner.app.QRScannerActivity
import com.kuplay.pi_framework.base.BaseJSModule
import com.kuplay.pi_framework.webview.YNWebView

class QRCode(ynWebView: YNWebView) : BaseJSModule(ynWebView) {

    /**
     * What would you like to prompt user "You Missed Permission".
     *
     * @return the message content you want to prompt user.
     */
    protected val tipContentWithoutPermission: String
        get() = ctx!!.resources.getString(R.string.tip_please_allow_app_scan_qr_code)

    fun scan(callBack:(callType: Int, prames: Array<Any>)->Unit) {
        this.callBack = callBack
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            PermissionsUtil.requestPermission(ctx, object : PermissionListener {
                override fun permissionGranted(permission: Array<String>) {
                    jumpToScanQRCode()
                }
                override fun permissionDenied(permission: Array<String>) {
                }
            }, Manifest.permission.CAMERA)
        } else {
            jumpToScanQRCode()
        }
    }

    /**
     * 跳转到扫码
     */
    private fun jumpToScanQRCode() {
        val intent = Intent(ctx, QRScannerActivity::class.java)
        ctx!!.startActivityForResult(intent, QRScannerActivity.SCAN_RESULT_CODE)
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        when (resultCode) {
            QRScannerActivity.SCAN_RESULT_CODE -> {
                if (null == data) {
                    callBack(BaseJSModule.FAIL, arrayOf("空"))
                    //JSCallback.callJS(null, null, getCallbackId(), JSCallback.getFAIL(), "空")

                }else{
                    val result = data.getStringExtra(QRScannerActivity.SCAN_RESULT)
                    if (TextUtils.isEmpty(result)) {
                        callBack(BaseJSModule.FAIL, arrayOf("空"))
                        //JSCallback.callJS(null, null, getCallbackId(), JSCallback.getFAIL(), "空")
                    } else {
                        callBack(BaseJSModule.SUCCESS, arrayOf(result))
                        //JSCallback.callJS(null, null, getCallbackId(), JSCallback.getSUCCESS(), result)
                    }
                }

            }
        }
    }
}