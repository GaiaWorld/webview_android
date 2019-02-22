package com.kuplay.pi_framework.module

import com.kuplay.pi_framework.Util.PrefMgr
import com.kuplay.pi_framework.base.BaseJSModule
import com.kuplay.pi_framework.webview.YNWebView
import java.util.*

class LocalLanguageMgr(ynWebView: YNWebView) : BaseJSModule(ynWebView) {

    /**
     * Get the Language which the system is it now.
     * When the function get the system language successful,is will be callback
     * the ts with a parameter as following
     * [.LANGUAGE_CHINESE_SIMPLIFY]
     * [.LANGUAGE_CHINESE_TRADITIONAL]
     * [.LANGUAGE_ENGLISH]
     * [.LANGUAGE_JAPANESE]
     *
     * @param callbackId Ts callback id
     */
    fun getSystemLanguage(callBack:(callType: Int, prames: Array<Any>)->Unit) {
        //默认是简体中文
        var result = LocalLanguageMgr.LANGUAGE_CHINESE_SIMPLIFY
        val country = Locale.getDefault().toString()
        when (country) {
            "zh_TW" -> result = LocalLanguageMgr.LANGUAGE_CHINESE_TRADITIONAL
            "ja" -> result = LocalLanguageMgr.LANGUAGE_JAPANESE
            "en_US", "en_UK", "en" -> result = LocalLanguageMgr.LANGUAGE_ENGLISH
            "zh_CN" -> result = LocalLanguageMgr.LANGUAGE_CHINESE_SIMPLIFY
        }
        callBack(BaseJSModule.SUCCESS, arrayOf(result.toString()))
    }

    /**
     * Get the Language which the application is using.
     * When the function get the language successful,is will be callback
     * the ts with a parameter as following
     * [.LANGUAGE_SYSTEM]
     * [.LANGUAGE_CHINESE_SIMPLIFY]
     * [.LANGUAGE_CHINESE_TRADITIONAL]
     * [.LANGUAGE_ENGLISH]
     * [.LANGUAGE_JAPANESE]
     *
     * @param callbackId Ts callback id
     */
    fun getAppLanguage(callBack:(callType: Int, prames: Array<Any>)->Unit) {
        val result = PrefMgr.getInstance(ctx).appLan
        callBack(BaseJSModule.SUCCESS, arrayOf(result.toString()))
        //JSCallback.callJS(null, null, callbackId, JSCallback.getSUCCESS(), result.toString())
    }

    /**
     * Set the application's language.
     *
     * @param language   The language that you would like set to,is could accept the parameter
     * as following:
     * [.LANGUAGE_SYSTEM]
     * [.LANGUAGE_CHINESE_SIMPLIFY]
     * [.LANGUAGE_CHINESE_TRADITIONAL]
     * [.LANGUAGE_ENGLISH]
     * [.LANGUAGE_JAPANESE]
     */
    fun setAppLanguage(language: Int, callBack:(callType: Int, prames: Array<Any>)->Unit) {
        val resources = ctx!!.resources
        val dm = resources.displayMetrics
        val config = resources.configuration
        // 应用用户选择语言
        when (language) {
            //简体中文
            LANGUAGE_CHINESE_SIMPLIFY -> config.locale = Locale.SIMPLIFIED_CHINESE
            //繁体中文
            LANGUAGE_CHINESE_TRADITIONAL -> config.locale = Locale.TRADITIONAL_CHINESE
            //英语
            LANGUAGE_ENGLISH -> config.locale = Locale.ENGLISH
            //日语
            LANGUAGE_JAPANESE -> config.locale = Locale.JAPANESE
            //跟随系统
            LANGUAGE_SYSTEM -> config.locale = Locale.getDefault()
            else -> config.locale = Locale.getDefault()
        }
        resources.updateConfiguration(config, dm)
        callBack(BaseJSModule.SUCCESS, arrayOf(""))
        //JSCallback.callJS(null, null, callbackId, JSCallback.getSUCCESS(), "")
        PrefMgr.getInstance(ctx).saveAppLan(language)
    }

    companion object {
        private val LANGUAGE_SYSTEM = 1//跟随系统
        private val LANGUAGE_CHINESE_SIMPLIFY = 2//简体中文
        private val LANGUAGE_CHINESE_TRADITIONAL = 3//繁体中文
        private val LANGUAGE_ENGLISH = 4//英语
        private val LANGUAGE_JAPANESE = 5//日语
    }


    /*@Retention(RetentionPolicy.SOURCE)
    @IntDef({LANGUAGE_SYSTEM, LANGUAGE_CHINESE_SIMPLIFY, LANGUAGE_CHINESE_TRADITIONAL, LANGUAGE_ENGLISH, LANGUAGE_JAPANESE})
    @interface LanguageType {
    }*/
}