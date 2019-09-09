package com.kuplay.pi_framework.piv8


object serviceRunCode{
    const val key: String = "runCode"

    /**
     * 向v8虚拟机注入JS代码
     */
    const val runScript = 0
    const val scriptKey = "script"

    /**
     * 与JSManager分发
     */
    const val sendMessage = 1

    const val messageKey = "messageKey"
    //chargeMessage分发
    const val chargeMessage = "chargeMessage"
    //ingame分发
    const val chargeInGameMessage = "chargeInGameMessage"
    //分享分发
    const val shareMessage = "shareMessage"

    /**
     * 支付
     */
    const val payKey = "payKey"
    const val payAmount = "payAmount"
    const val weChatPay = "weixinpay"
    const val aLiPay = "alipay"

    /**
     * 状态码
     */
    const val statusCodeKey = "statusCode"
    const val statusSuccess = 0
    const val statusFail = -1
}