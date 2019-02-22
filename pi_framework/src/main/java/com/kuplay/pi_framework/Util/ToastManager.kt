package com.kuplay.pi_framework.Util

import android.content.Context
import android.support.annotation.IntDef
import android.text.TextUtils
import android.widget.Toast
import java.lang.annotation.Retention
import java.lang.annotation.RetentionPolicy
import android.widget.Toast.LENGTH_LONG
import android.widget.Toast.LENGTH_SHORT

class ToastManager {
    @IntDef(LENGTH_SHORT, LENGTH_LONG)
    @Retention(RetentionPolicy.SOURCE)
    annotation class Duration

    companion object {
        private var sToast: Toast? = null

        /**
         * Tip user message by toast tip.
         *
         * @param ctx Context
         * @param msg the message what would you like tip.
         */
        fun toast(ctx: Context, msg: String) {
            toast(ctx, msg, LENGTH_SHORT)
        }

        /**
         * Tip user message by toast tip.
         *
         * @param ctx      Context
         * @param msg      the message what would you like tip.
         * @param duration the last time of tip.
         */
        fun toast(ctx: Context?, msg: String, @Duration duration: Int) {
            if (null == ctx || TextUtils.isEmpty(msg)) return
            if (null == sToast)
                sToast = Toast.makeText(ctx, msg, duration)
            else
                sToast!!.setText(msg)
            sToast!!.show()
        }

        /**
         * No ever what message is showing,when you call this method will hide the tip.
         */
        fun hideToast() {
            if (null != sToast) {
                sToast!!.cancel()
            }
        }
    }

}