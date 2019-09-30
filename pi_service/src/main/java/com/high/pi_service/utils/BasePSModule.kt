package com.high.pi_service.utils

import android.content.Context
import android.support.annotation.IntDef
import com.high.pi_service.V8
import java.lang.annotation.Retention
import java.lang.annotation.RetentionPolicy

abstract class BasePSModule constructor(ctx: Context ,v8: V8) : PSExecutable,PSInterface {
    //回调
    lateinit var callBack: (callType: Int, prames: Array<Any>)->Unit

    val v8: V8 = v8
    val ctx: Context = ctx

    override fun onDestroy() {
        super.onDestroy()
    }


    companion object {
        const val SUCCESS = 0
        const val FAIL = 1
        const val CALLBACK = 2
        const val CALLERROR = 3

        @IntDef(SUCCESS, FAIL, CALLBACK, CALLERROR)
        @Retention(RetentionPolicy.SOURCE)
        annotation class StatusCode
    }
}