package com.kuplay.pi_framework.base

import android.app.Activity
import android.content.Intent
import android.support.annotation.IntDef
import com.github.dfqin.grantor.PermissionsUtil
import com.kuplay.pi_framework.R
import com.kuplay.pi_framework.webview.YNWebView
import java.lang.annotation.Retention
import java.lang.annotation.RetentionPolicy

abstract class BaseJSModule constructor(ynWebView: YNWebView) : JSExecutable, JSInterface {

    val yn = ynWebView

    //回调
    lateinit var callBack: (callType: Int, prames: Array<Any>)->Unit

    var ctx: Activity? = null
    /**
     * TipInfo:When the application is missing the necessary permissions
     * are displayed to the user's prompt o message.
     */
    var mTipInfo: PermissionsUtil.TipInfo

    private val tipContentWithoutPermission: String
        get() = ctx!!.resources.getString(R.string.tip_misseed_permission_default_prompt)


    init {
        ctx = ynWebView.getEnv(ynWebView.ACTIVITY) as Activity?
        mTipInfo = PermissionsUtil.TipInfo((ynWebView.getEnv(ynWebView.CONTEXT) as Activity).resources.getString(R.string.dialog_title_prompt), tipContentWithoutPermission, (ynWebView.getEnv(ynWebView.CONTEXT) as Activity).resources.getString(R.string.dialog_title_cancel), (ynWebView.getEnv(ynWebView.CONTEXT) as Activity).resources.getString(R.string.dialog_title_ok))
        ynWebView.jsImpl = this
    }

    /**
     * Activity's visibility changes from invisible to visible.
     */
    override fun onResume() {}

    /**
     * Dispatch incoming result to the correct fragment.
     *
     * @param requestCode request code
     * @param resultCode  the code of result,this mark is set by user,this will be used as mark.
     * @param data        Callback data from last Activity.
     */
    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {}

    companion object {
        const val SUCCESS = 0
        const val FAIL = 1
        const val CALLBACK = 100

        @IntDef(SUCCESS, FAIL, CALLBACK)
        @Retention(RetentionPolicy.SOURCE)
        annotation class StatusCode
    }

}