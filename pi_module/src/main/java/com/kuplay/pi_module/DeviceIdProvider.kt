package com.kuplay.pi_module

import android.Manifest
import android.app.ActivityManager
import android.content.Context
import android.media.MediaCodec
import android.telephony.TelephonyManager
import android.text.format.Formatter
import com.github.dfqin.grantor.PermissionListener
import com.github.dfqin.grantor.PermissionsUtil
import com.kuplay.pi_framework.Util.GetDeviceId
import com.kuplay.pi_framework.base.BaseJSModule
import com.kuplay.pi_framework.webview.YNWebView
import com.kuplay.pi_module.Util.NetUtils
import java.io.*
import java.util.regex.Pattern

class DeviceIdProvider(ynWebView: YNWebView) : BaseJSModule(ynWebView) {

    /**
     *  *获取设备唯一标识
     */
    fun getUUId(callBack:(callType: Int, prames: Array<Any>)->Unit) {
        callBack(BaseJSModule.SUCCESS, arrayOf(GetDeviceId.getDeviceId(ctx)))
    }
    /**
     *
     *  *获取系统信息
     *  *MANUFACTURER  设备制造商
     *  *MODEL  设备名称
     *  *VERSION.RELEASE 系统版本号
     *
     */
    fun getSystem(callBack:(callType: Int, prames: Array<Any>)->Unit) {
        callBack(BaseJSModule.SUCCESS, arrayOf(android.os.Build.MANUFACTURER,android.os.Build.MODEL,android.os.Build.VERSION.RELEASE))
    }

    /**
     *
     *  *获取手机内存
     *  *totla  总内存
     *  *avail 可用内存
     *
     */
    fun getMemSize(callBack:(callType: Int, prames: Array<Any>)->Unit){
        callBack(BaseJSModule.SUCCESS, arrayOf(this.getTotalMemory(),this.getAvailMemory()))
    }

    /**
     *
     *  *获取网络状态
     *
     */
    fun getNetWorkStatus(callBack:(callType: Int, prames: Array<Any>)->Unit){
        PermissionsUtil.requestPermission(ctx!!, object : PermissionListener {
            override fun permissionGranted(permission: Array<String>) {
                val netWorkState = NetUtils.getNetworkState(ctx!!)
                callBack(BaseJSModule.SUCCESS, arrayOf(netWorkState))
            }
            override fun permissionDenied(permission: Array<String>) {
                //callBack(BaseJSModule.SUCCESS, arrayOf("用户拒绝了权限!"))
                //JSCallback.callJS(null, null, callbackId, JSCallback.getFAIL(), "用户拒绝了权限!")
            }
        }, arrayOf(Manifest.permission.ACCESS_NETWORK_STATE), true, mTipInfo)
    }

    /**
     *  *获取手机网络提供商
     */
    fun getOperatorName(callBack:(callType: Int, prames: Array<Any>)->Unit){
        val telephonyManager = ctx!!.getSystemService(Context.TELEPHONY_SERVICE) as TelephonyManager
        val operatorName = telephonyManager.simOperatorName
        callBack(BaseJSModule.SUCCESS, arrayOf(operatorName))
    }

    //内存工具
    private fun getAvailMemory():String{
        val am = ctx!!.getSystemService(Context.ACTIVITY_SERVICE) as ActivityManager
        val mi = ActivityManager.MemoryInfo()
        am.getMemoryInfo(mi)
        return Formatter.formatFileSize(ctx!!,mi.availMem)
    }

    private fun getTotalMemory():String{
        val path = "/proc/meminfo" //系统内存文件
        var i : String = ""
        try {
            val localFileReader = FileReader(path)
            val localBufferedReader = BufferedReader(localFileReader, 8192)
            val size = localBufferedReader.readLine() //读取meminfo第一行，系统内存总大小
            val sizeArray = size.split("\\s+")
            val mem = sizeArray.first()
            val matcher = Pattern.compile("\\d+").matcher(mem)
            while (matcher.find()){
                i = matcher.group()
            }
            localBufferedReader.close()
        }catch (e : IOException){

        }
        return  String.format("%.2fGB",(i.toFloat()/(1024*1024)))
    }

}