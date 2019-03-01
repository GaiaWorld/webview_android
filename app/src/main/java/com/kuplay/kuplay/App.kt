package com.kuplay.kuplay

import android.app.Application
import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.graphics.Color
import android.os.Build
import android.util.Log
import com.kuplay.pi_framework.webview.YNWebView
import com.alibaba.sdk.android.push.CommonCallback
import com.alibaba.sdk.android.push.noonesdk.PushServiceFactory
import com.alibaba.sdk.android.push.register.HuaWeiRegister
import com.alibaba.sdk.android.push.register.MiPushRegister

class App : Application(){
    private val TAG = "Init"
    override fun onCreate() {
        super.onCreate()
        YNWebView.getX5Open(this)
        initCloudChannel(this)
    }



    /**
     * 初始化云推送通道
     * @param applicationContext
     */
    private fun initCloudChannel(applicationContext: Context) {
        createNotificationChannel()
        PushServiceFactory.init(applicationContext)
        val pushService = PushServiceFactory.getCloudPushService()
        // 注册方法会自动判断是否支持小米系统推送，如不支持会跳过注册。
        MiPushRegister.register(applicationContext, "2882303761517862496", "5611786234496");
        // 注册方法会自动判断是否支持华为系统推送，如不支持会跳过注册。
        HuaWeiRegister.register(applicationContext);
        pushService.register(applicationContext, "25706201","3f23e416c16ab516b6602480d0891b45",object : CommonCallback {
            override fun onSuccess(response: String) {
                Log.d(TAG, "init cloudchannel success")
                Log.d(TAG, pushService.deviceId)
                turnOn()
            }

            override fun onFailed(errorCode: String, errorMessage: String) {
                Log.d(TAG, "init cloudchannel failed -- errorcode:$errorCode -- errorMessage:$errorMessage")
            }
        })
    }

//    MiPushRegister.register(applicationContext, "XIAOMI_ID", "XIAOMI_KEY"); // 初始化小米辅助推送
//    HuaWeiRegister.register(applicationContext); // 接入华为辅助推送
//    GcmRegister.register(applicationContext, "send_id", "application_id"); // 接入FCM/GCM初始化推送

    private fun turnOn(){
        val pushService = PushServiceFactory.getCloudPushService()
        pushService.turnOnPushChannel(object : CommonCallback {
            override fun onSuccess(response: String) {
                Log.d(TAG, "turnOn success")
            }

            override fun onFailed(errorCode: String, errorMessage: String) {
                Log.d(TAG, "turnOn failed -- errorcode:$errorCode -- errorMessage:$errorMessage")
            }
        })
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val mNotificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            // 通知渠道的id
            val id = "1022"
            // 用户可以看到的通知渠道的名字.
            val name = "notification channel"
            // 用户可以看到的通知渠道的描述
            val description = "notification description"
            val importance = NotificationManager.IMPORTANCE_HIGH
            val mChannel = NotificationChannel(id, name, importance)
            // 配置通知渠道的属性
            mChannel.setDescription(description)
            // 设置通知出现时的闪灯（如果 android 设备支持的话）
            mChannel.enableLights(true)
            mChannel.setLightColor(Color.RED)
            // 设置通知出现时的震动（如果 android 设备支持的话）
            mChannel.enableVibration(true)
            mChannel.setVibrationPattern(longArrayOf(100, 200, 300, 400, 500, 400, 300, 200, 400))
            //最后在notificationmanager中创建该通知渠道
            mNotificationManager.createNotificationChannel(mChannel)


        }
    }



}