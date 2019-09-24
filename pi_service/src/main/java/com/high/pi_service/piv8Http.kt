package com.high.pi_service

import android.os.Handler
import android.os.Looper
import android.util.Base64
import android.util.Log
import okhttp3.*
import org.json.JSONObject
import java.io.IOException
import java.util.concurrent.TimeUnit

class piv8Http(private val v8: V8){

    var mainHandler = Handler(Looper.getMainLooper())

    fun request(type :String, url:String, headers: String, reqData:String, reqType:String, respType:String, callBack: V8Function, errorCallBack: V8Function, progressCallBack: V8Function){
        var successCallback = callBack.twin()
        var errCallback = errorCallBack.twin()

        val okHttpClient = OkHttpClient.Builder().connectTimeout(10, TimeUnit.SECONDS).writeTimeout(10, TimeUnit.SECONDS).readTimeout(30,
            TimeUnit.SECONDS).build()
        var request: Request? = null
        val re = Request.Builder().url(url)
        if (headers != ""){
            val hd = JSONObject(headers)
            for (x in hd.keys()){
                re.addHeader(x,hd.getString(x))
            }
        }
        if (reqType == "string" || reqType == "json"){
            val tson = MediaType.parse("application/json; charset=utf-8")
            val body = RequestBody.create(tson,reqData)
            request = re.method(type, body).build()
        }else if (reqType == "bin"){
            val tson = MediaType.parse("application/bin; charset=utf-8")
            val data = Base64.decode(reqData, Base64.NO_WRAP)
            val body = RequestBody.create(tson,data)
            request = re.method(type, body).build()
        }else{
            request = re.get().build()
        }
        val call = okHttpClient.newCall(request)
        call.enqueue(object : Callback {
            override fun onResponse(call: Call?, response: Response?) {
                if (respType == "bin"){
                    val s = response!!.body()!!.bytes()
                    val st = Base64.encodeToString(s, Base64.NO_WRAP)
                    mainHandler.post { val arr = V8Array(v8);arr.push(st);successCallback.call(null, arr);arr.close(); successCallback.close() }
                }else if(respType == "json") {
                    Log.d("piv8","javascript打印 = 我需要一个JSON对象，现在还没有实现")
                }else {
                    val s = response!!.body()!!.string()
                    mainHandler.post { val arr = V8Array(v8);arr.push(s);successCallback.call(null, arr);arr.close(); successCallback.close() }

                }
            }
            override fun onFailure(call: Call?, e: IOException?) {
                mainHandler.post { val arr = V8Array(v8);arr.push(e!!.message);errCallback.call(null, arr);arr.close(); errCallback.close() }
            }
        })

    }


}