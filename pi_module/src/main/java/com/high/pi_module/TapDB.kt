package com.high.pi_module

import android.util.Log
import com.high.pi_framework.base.BaseJSModule
import com.high.pi_framework.webview.YNWebView
import com.tapdb.sdk.TapDB
import org.json.JSONObject

// 暴露给 TypeScript 调用的接口
class TapDB(ynWebView: YNWebView): BaseJSModule(ynWebView) {
    private fun debugMsg(msg: String) {
        if (com.high.pi_framework.module.TapDB.debug) {
            Log.e("TapDB", msg)
        }
    }

    // 获取 SDK 信息
    fun getSDKInfo(callback: (callType: Int, prames: Array<Any>) -> Unit) {
        val info = TapDB.getStartInfo()
        if (info == null) {
            callback(SUCCESS, arrayOf(""))
            return
        }
        val json = JSONObject()
        info.forEach {
            json.put(it.key, it.value)
        }

        callback(SUCCESS, arrayOf(json.toString()))
    }

    // 上报玩家ID
    fun setUser(userId: String, callback: (callType: Int, prames: Array<Any>)->Unit) {
        TapDB.setUser(userId)
        debugMsg("setUser: $userId")
        callback(SUCCESS, arrayOf(""))
    }

    // 上报玩家名称
    fun setName(name: String, callback: (callType: Int, prames: Array<Any>) -> Unit) {
        TapDB.setName(name)
        debugMsg("setName: $name")
        callback(SUCCESS, arrayOf(""))
    }

    // 上报玩家等级
    fun setLevel(level: Int, callback: (callType: Int, prames: Array<Any>) -> Unit) {
        TapDB.setLevel(level)
        debugMsg("setLevel: $level")
        callback(SUCCESS, arrayOf(""))
    }

    // 上报玩家所在服务器
    fun setServer(server: String, callback: (callType: Int, prames: Array<Any>) -> Unit) {
        TapDB.setServer(server)
        debugMsg("setServer: $server")
        callback(SUCCESS, arrayOf(""))
    }

    // 上报充值事件
    fun setCharge(
        orderId: String, product: String, amount: Long, currencyType: String,
        payment: String, callback: (callType: Int, prames: Array<Any>) -> Unit
    ) {
        TapDB.onCharge(orderId, product, amount, currencyType, payment)
        debugMsg("setCharge:: orderId: $orderId, product: $product, amount: $amount, type: $currencyType, payment: $payment")
        callback(SUCCESS, arrayOf(""))
    }

    // 上报自定义事件
    fun setEvent(
        eventCode: String, properties: String,
        callback: (callType: Int, prames: Array<Any>) -> Unit
    ) {
        val json = JSONObject(properties)
        TapDB.onEvent(eventCode, json)
        debugMsg("setEvent:: code:$eventCode, props: $json")
        callback(SUCCESS, arrayOf(""))
    }
}