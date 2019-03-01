package com.kuplay.kuplay.module

import com.alibaba.sdk.android.push.CloudPushService
import com.alibaba.sdk.android.push.CommonCallback
import com.alibaba.sdk.android.push.noonesdk.PushServiceFactory
import com.kuplay.pi_framework.base.BaseJSModule
import com.kuplay.pi_framework.webview.YNWebView

class MessagePost(ynWebView: YNWebView) : BaseJSModule(ynWebView)  {
    private var pushService : CloudPushService
    init {
        pushService = PushServiceFactory.getCloudPushService()
    }


    fun bindAccount(account: String,callBack:(callType: Int, prames: Array<Any>)->Unit){
        pushService.bindAccount(account, object : CommonCallback{
            override fun onSuccess(p0: String?) {
                callBack(BaseJSModule.SUCCESS, arrayOf(""))
            }

            override fun onFailed(p0: String?, p1: String?) {
                callBack(BaseJSModule.SUCCESS, arrayOf(p1!!))
            }
        })
    }

    fun unbindAccount(callBack:(callType: Int, prames: Array<Any>)->Unit){
        pushService.unbindAccount(object : CommonCallback{
            override fun onSuccess(p0: String?) {
                callBack(BaseJSModule.SUCCESS, arrayOf(""))
            }

            override fun onFailed(p0: String?, p1: String?) {
                callBack(BaseJSModule.SUCCESS, arrayOf(p1!!))
            }
        })
    }

    fun bindTag(target: Int, tags: Array<String>, alias: String, callBack:(callType: Int, prames: Array<Any>)->Unit){
        pushService.bindTag(target,tags,alias,object : CommonCallback{
            override fun onSuccess(p0: String?) {
                callBack(BaseJSModule.SUCCESS, arrayOf(""))
            }

            override fun onFailed(p0: String?, p1: String?) {
                callBack(BaseJSModule.SUCCESS, arrayOf(p1!!))
            }
        })
    }

    fun unbindTag(target: Int, tags: Array<String>, alias: String, callBack:(callType: Int, prames: Array<Any>)->Unit){
        pushService.unbindTag(target,tags,alias,object : CommonCallback{
            override fun onSuccess(p0: String?) {
                callBack(BaseJSModule.SUCCESS, arrayOf(""))
            }

            override fun onFailed(p0: String?, p1: String?) {
                callBack(BaseJSModule.SUCCESS, arrayOf(p1!!))
            }
        })
    }

    fun listTags(target: Int, callBack:(callType: Int, prames: Array<Any>)->Unit){
        pushService.listTags(target, object : CommonCallback{
            override fun onSuccess(p0: String?) {
                callBack(BaseJSModule.SUCCESS, arrayOf(""))
            }

            override fun onFailed(p0: String?, p1: String?) {
                callBack(BaseJSModule.SUCCESS, arrayOf(p1!!))
            }
        })
    }

    fun addAlias(alias: String, callBack:(callType: Int, prames: Array<Any>)->Unit){
        pushService.addAlias(alias, object : CommonCallback{
            override fun onSuccess(p0: String?) {
                callBack(BaseJSModule.SUCCESS, arrayOf(""))
            }

            override fun onFailed(p0: String?, p1: String?) {
                callBack(BaseJSModule.SUCCESS, arrayOf(p1!!))
            }
        })
    }

    fun removeAlias(alias: String, callBack:(callType: Int, prames: Array<Any>)->Unit){
        pushService.removeAlias(alias, object : CommonCallback{
            override fun onSuccess(p0: String?) {
                callBack(BaseJSModule.SUCCESS, arrayOf(""))
            }

            override fun onFailed(p0: String?, p1: String?) {
                callBack(BaseJSModule.SUCCESS, arrayOf(p1!!))
            }
        })
    }

    fun listAliases(callBack:(callType: Int, prames: Array<Any>)->Unit){
        pushService.listAliases(object : CommonCallback{
            override fun onSuccess(p0: String?) {
                callBack(BaseJSModule.SUCCESS, arrayOf(""))
            }

            override fun onFailed(p0: String?, p1: String?) {
                callBack(BaseJSModule.SUCCESS, arrayOf(p1!!))
            }
        })
    }


}