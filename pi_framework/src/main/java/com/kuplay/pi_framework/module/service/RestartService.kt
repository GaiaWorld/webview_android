package com.kuplay.pi_framework.module.service

import android.app.Service
import android.content.Intent
import android.os.Handler
import android.os.IBinder

/***
 * 该服务只用来让APP重启，生命周期也仅仅是只是重启APP。重启完即自我杀死
 */
class RestartService : Service() {
    private val handler: Handler
    private var pgName: String? = null

    init {
        handler = Handler()
    }

    override fun onStartCommand(intent: Intent, flags: Int, startId: Int): Int {
        stopDelayed = intent.getLongExtra("Delayed", 5)
        pgName = intent.getStringExtra("PackageName")
        handler.postDelayed({
            val LaunchIntent = packageManager.getLaunchIntentForPackage(pgName!!)
            startActivity(LaunchIntent)
            this@RestartService.stopSelf()
        }, stopDelayed)

        return super.onStartCommand(intent, flags, startId)
    }


    override fun onBind(intent: Intent): IBinder? {
        return null
    }

    companion object {
        /**关闭应用后多久重新启动 */
        private var stopDelayed: Long = 5
    }

}