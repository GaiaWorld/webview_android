package com.high.pi_service.module

import android.content.Context
import com.high.pi_service.V8
import com.high.pi_service.utils.BasePSModule
import com.high.pi_service.utils.GetDeviceId

class DeviceIdProvider(ctx: Context, v8: V8):BasePSModule(ctx,v8) {
    fun getUUId(callBack:(callType: Int, prames: Array<Any>)->Unit) {
        callBack(BasePSModule.SUCCESS, arrayOf(GetDeviceId.getDeviceId(ctx)))
    }
}