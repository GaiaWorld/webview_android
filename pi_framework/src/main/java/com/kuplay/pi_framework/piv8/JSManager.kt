package com.kuplay.pi_framework.piv8

import android.annotation.SuppressLint
import android.app.Activity
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.util.Log
import com.kuplay.pi_framework.R
import com.kuplay.pi_framework.Util.FileUtil
import com.kuplay.pi_framework.framework.CallJSRunnable
import com.kuplay.pi_framework.gameView.ChargeActivity
import com.kuplay.pi_framework.gameView.ChargeInGameActivity
import com.kuplay.pi_framework.module.StageUtils
import com.kuplay.pi_framework.module.WeChatPay
import com.kuplay.pi_framework.piv8.utils.DataHandleManager
import com.kuplay.pi_framework.piv8.utils.PiEthBtcWrapper
import com.kuplay.pi_framework.webview.YNWebView
import java.io.BufferedReader
import java.io.File
import java.io.InputStreamReader
import java.security.SecureRandom

class JSVMManager constructor(){

    private var runtime: V8? = null
    private var ctx: Context? = null

    private var chareSuccessFunction: V8Function? = null
    private var chareFailFunction: V8Function? = null
    private var chareInGameSuccessFunction: V8Function? = null
    private var chareInGameFailFunction: V8Function? = null

    fun getRuntime():V8?{
        return runtime
    }

    fun createV8(context: Context){

        val logCallBack = JavaVoidCallback { receiver, parameters ->
            var log = ""
            for (i in 0 until parameters.length()) {
                val x = parameters.get(i)
                log += x.toString()
                if (x is Releasable) x.close()
            }
            Log.d("piv8","javascript打印=$log")
        }

        val alertCallBack = JavaVoidCallback { receiver, parameters ->
            var log = ""
            for (i in 0 until parameters.length()) {
                val x = parameters.get(i)
                log += x.toString()
                if (x is Releasable) x.close()
            }
            Log.d("piv8","javascript打印=$log")
        }

        this.ctx = context
        runtime = V8.createV8Runtime("window")
        runtime!!.executeVoidScript("var self = window")
        val v8Console = V8Object(runtime)
        val v8DataHandle = V8Object(runtime)
        runtime!!.add("piv8DHManager",v8DataHandle)
        runtime!!.add("console",v8Console)
        runtime!!.registerJavaMethod(alertCallBack,"alert")
        v8Console.registerJavaMethod(logCallBack,"log")
        val vmBridge = VMBridge(runtime)
        val piv8timer = piv8Timer()
        val piv8dataHandle = DataHandleManager
        piv8dataHandle.setV8(runtime!!)
        val piv8http = piv8Http(runtime!!)
        val piv8ws = piv8WebSocket(runtime!!)
        val piEthBtcWrapper = PiEthBtcWrapper(runtime!!)
        val piv8db = piv8DB(ctx!!,runtime!!)
        val bootManager = PiV8JsBootManager(ctx!!,runtime!!)
        runtime!!.executeVoidScript("var JSVM = {};var piv8WebSocket = {};JSVM.store = {};JSVM.Boot = {};")
        runtime!!.executeVoidScript("var api = {};api.eth = {};api.btc = {};api.cipher = {};")
        val jsWS = runtime!!.getObject("piv8WebSocket")
        val jsvm = runtime!!.getObject("JSVM")
        val store = jsvm.getObject("store")
        val boot = jsvm.getObject("Boot")
        val api  = runtime!!.getObject("api")
        val eth = api.getObject("eth")
        val btc = api.getObject("btc")
        val cipher = api.getObject("cipher")
        v8DataHandle.registerJavaMethod(piv8dataHandle,"createNewDataHandle", "createNewDataHandle" , arrayOf())
        v8DataHandle.registerJavaMethod(piv8dataHandle,"getContent", "getContent" , arrayOf<Class<*>>(Int::class.java))
        v8DataHandle.registerJavaMethod(piv8dataHandle,"runScript", "runScript" , arrayOf<Class<*>>(Int::class.java))
        v8DataHandle.registerJavaMethod(piv8dataHandle,"setContent", "setContent" , arrayOf<Class<*>>(Int::class.java, String::class.java, String::class.java))
        jsvm.registerJavaMethod(vmBridge,"postMessage","messageReciver", arrayOf<Class<*>>(Array<Any>::class.java))
        jsvm.registerJavaMethod(this,"getRandomValues","getRandomValues", arrayOf())
        jsvm.registerJavaMethod(this,"getDownRead","getDownReadDH", arrayOf<Class<*>>(String::class.java, String::class.java, V8Function::class.java, V8Function::class.java))
        jsvm.registerJavaMethod(this,"getReady","getReady", arrayOf<Class<*>>(String::class.java))
        jsvm.registerJavaMethod(this,"postMessage","postMessage", arrayOf<Class<*>>(String::class.java, String::class.java))
        jsvm.registerJavaMethod(piv8http, "request", "request", arrayOf<Class<*>>(String::class.java,String::class.java,String::class.java,String::class.java,String::class.java,String::class.java,V8Function::class.java,V8Function::class.java,V8Function::class.java))
        jsWS.registerJavaMethod(piv8ws, "startWebSocket", "startWebSocket", arrayOf<Class<*>>(String::class.java))
        jsWS.registerJavaMethod(piv8ws, "onOpen", "onOpen", arrayOf<Class<*>>(String::class.java,V8Function::class.java))
        jsWS.registerJavaMethod(piv8ws, "onFail", "onFail", arrayOf<Class<*>>(String::class.java,V8Function::class.java))
        jsWS.registerJavaMethod(piv8ws, "onMessage", "onMessage", arrayOf<Class<*>>(String::class.java,V8Function::class.java))
        jsWS.registerJavaMethod(piv8ws, "onClose", "onClose", arrayOf<Class<*>>(String::class.java,V8Function::class.java))
        jsWS.registerJavaMethod(piv8ws, "close", "close", arrayOf<Class<*>>(String::class.java))
        jsWS.registerJavaMethod(piv8ws, "sendMsg", "sendMsg", arrayOf<Class<*>>(String::class.java,String::class.java,String::class.java))
        runtime!!.registerJavaMethod(piv8timer, "setTimeout", "setTimeout", arrayOf<Class<*>>(V8Function::class.java,Int::class.java))
        runtime!!.registerJavaMethod(piv8timer, "clearTimeout", "clearTimeout", arrayOf<Class<*>>(Int::class.java))
        runtime!!.registerJavaMethod(piv8timer, "setInterval", "setInterval", arrayOf<Class<*>>(V8Function::class.java,Int::class.java))
        store.registerJavaMethod(piv8db,"create","create",arrayOf<Class<*>>(String::class.java,V8Function::class.java,V8Function::class.java,V8Function::class.java))
        store.registerJavaMethod(piv8db,"delete","delete",arrayOf<Class<*>>(String::class.java,V8Function::class.java,V8Function::class.java,V8Function::class.java))
        store.registerJavaMethod(piv8db,"iterate","iterate",arrayOf<Class<*>>(String::class.java,V8Function::class.java,V8Function::class.java,V8Function::class.java))
        store.registerJavaMethod(piv8db,"read","readDH",arrayOf<Class<*>>(String::class.java,String::class.java,V8Function::class.java,V8Function::class.java,V8Function::class.java))
        store.registerJavaMethod(piv8db,"remove","remove",arrayOf<Class<*>>(String::class.java,String::class.java,V8Function::class.java,V8Function::class.java,V8Function::class.java))
        store.registerJavaMethod(piv8db,"write","write",arrayOf<Class<*>>(String::class.java,String::class.java,String::class.java,V8Function::class.java,V8Function::class.java,V8Function::class.java))
//        boot.registerJavaMethod(bootManager, "saveFile", "saveFile", arrayOf<Class<*>>(String::class.java, String::class.java, V8Function::class.java))
        boot.registerJavaMethod(bootManager, "getMobileBootFiles", "getMobileBootFilesDH", arrayOf<Class<*>>(V8Function::class.java))
        boot.registerJavaMethod(bootManager, "restartJSVM", "restartJSVM", arrayOf())
        boot.registerJavaMethod(bootManager,"loadJS","loadJSDH", arrayOf<Class<*>>(String::class.java,String::class.java))
        boot.registerJavaMethod(bootManager,"updateApp","updateApp", arrayOf<Class<*>>(String::class.java))
        boot.registerJavaMethod(bootManager,"getAppVersion","getAppVersion", arrayOf<Class<*>>(V8Function::class.java))
        boot.registerJavaMethod(bootManager,"updateFinish","updateFinish", arrayOf())
        boot.registerJavaMethod(bootManager,"updateDownload","updateDownloadDH", arrayOf<Class<*>>(V8Array::class.java,String::class.java,String::class.java,V8Function::class.java,V8Function::class.java,V8Function::class.java))
        boot.registerJavaMethod(bootManager,"saveDepend","saveDepend", arrayOf<Class<*>>(String::class.java))
        boot.registerJavaMethod(bootManager,"saveIndexJS","saveIndexJS", arrayOf<Class<*>>(String::class.java))
        jsvm.registerJavaMethod(this, "goChareActivity", "goChareActivity", arrayOf<Class<*>>(Int::class.java))
        jsvm.registerJavaMethod(this, "removeChareActionListen", "removeChareActionListen", arrayOf())
        jsvm.registerJavaMethod(this, "addChareActionListen", "addChareActionListen", arrayOf<Class<*>>(V8Function::class.java, V8Function::class.java))
        jsvm.registerJavaMethod(this, "goChareInGameActivity", "goChareInGameActivity", arrayOf<Class<*>>(String::class.java,String::class.java,String::class.java,String::class.java,String::class.java,Int::class.java))
        jsvm.registerJavaMethod(this, "removeChareInGameActionListen", "removeChareInGameActionListen", arrayOf())
        jsvm.registerJavaMethod(this, "addChareInGameActionListen", "addChareInGameActionListen", arrayOf<Class<*>>(V8Function::class.java, V8Function::class.java))
        jsvm.registerJavaMethod(this, "goWXPay", "goWXPay", arrayOf<Class<*>>(String::class.java,String::class.java,String::class.java,String::class.java,String::class.java,String::class.java,String::class.java, V8Function::class.java))
        eth.registerJavaMethod(piEthBtcWrapper, "eth_from_mnemonic","eth_from_mnemonic", arrayOf<Class<*>>(String::class.java, String::class.java))
        eth.registerJavaMethod(piEthBtcWrapper, "eth_generate","eth_generate", arrayOf<Class<*>>(Int::class.java, String::class.java))
        eth.registerJavaMethod(piEthBtcWrapper, "eth_select_wallet","eth_select_wallet", arrayOf<Class<*>>(String::class.java, String::class.java, Int::class.java))
        eth.registerJavaMethod(piEthBtcWrapper, "eth_sign_raw_transaction","eth_sign_raw_transaction", arrayOf<Class<*>>(Int::class.java, String::class.java, String::class.java, String::class.java, String::class.java, String::class.java, String::class.java, String::class.java))
        eth.registerJavaMethod(piEthBtcWrapper, "get_public_key_by_mnemonic","get_public_key_by_mnemonic", arrayOf<Class<*>>(String::class.java, String::class.java))
        eth.registerJavaMethod(piEthBtcWrapper, "token_balance_call_data","token_balance_call_data", arrayOf<Class<*>>(String::class.java))
        eth.registerJavaMethod(piEthBtcWrapper, "token_transfer_call_data","token_transfer_call_data", arrayOf<Class<*>>(String::class.java, String::class.java))
        btc.registerJavaMethod(piEthBtcWrapper, "btc_build_raw_transaction_from_single_address","btc_build_raw_transaction_from_single_address", arrayOf<Class<*>>(String::class.java,String::class.java,String::class.java,String::class.java))
        btc.registerJavaMethod(piEthBtcWrapper, "btc_from_mnemonic","btc_from_mnemonic", arrayOf<Class<*>>(String::class.java,String::class.java,String::class.java,String::class.java))
        btc.registerJavaMethod(piEthBtcWrapper, "btc_from_seed","btc_from_seed", arrayOf<Class<*>>(String::class.java,String::class.java,String::class.java))
        btc.registerJavaMethod(piEthBtcWrapper, "btc_generate","btc_generate", arrayOf<Class<*>>(Int::class.java,String::class.java,String::class.java,String::class.java))
        btc.registerJavaMethod(piEthBtcWrapper, "btc_private_key_of","btc_private_key_of", arrayOf<Class<*>>(Int::class.java, String::class.java))
        btc.registerJavaMethod(piEthBtcWrapper, "btc_to_address","btc_to_address", arrayOf<Class<*>>(String::class.java,String::class.java))
        btc.registerJavaMethod(piEthBtcWrapper, "btc_build_pay_to_pub_key_hash","btc_build_pay_to_pub_key_hash", arrayOf<Class<*>>(String::class.java))
        cipher.registerJavaMethod(piEthBtcWrapper, "rust_decrypt","rust_decrypt", arrayOf<Class<*>>(String::class.java,String::class.java,String::class.java,String::class.java))
        cipher.registerJavaMethod(piEthBtcWrapper, "rust_encrypt","rust_encrypt", arrayOf<Class<*>>(String::class.java,String::class.java,String::class.java,String::class.java))
        cipher.registerJavaMethod(piEthBtcWrapper, "rust_sha256","rust_sha256", arrayOf<Class<*>>(String::class.java))
        cipher.registerJavaMethod(piEthBtcWrapper, "rust_sign","rust_sign", arrayOf<Class<*>>(String::class.java, String::class.java))


        val base64js = getLocalJSScript("base64js.min.js")
        runtime!!.executeScript(base64js!!,"base64js.min.js",0)

        val globaljs = getLocalJSScript("globalValue.js")
        runtime!!.executeScript(globaljs!!,"globalValue.js",0)

        val envjs = getLocalJSScript("env.js")
        runtime!!.executeScript(envjs!!,"env.js",0)

        val dhManagerjs = getLocalJSScript("piv8DHManager.js")
        runtime!!.executeScript(dhManagerjs!!,"piv8DHManager.js",0)

        val cryptojs = getLocalJSScript("crypto.js")
        runtime!!.executeScript(cryptojs!!,"crypto.js",0)

//        runtime?.startDebugger()

        val pm = ctx!!.packageManager
        val info = pm.getPackageInfo(ctx!!.packageName, 0)
        val name = info.versionCode
        //判断版本号
        val versionPath = bootManager.apkPath + "/apkversion.txt"
        val version = FileUtil.readFile(versionPath)
        if (version == ""){
            //如果documents中没有版本号文件，将版本号文件写入documents中
            val f = File(versionPath)
            f.writeText(name.toString())
        }else{
            //如果documents中有版本号文件，将版本号与当前app进行对比
            if (name > version.toInt()){
                val htmlFile = File(bootManager.htmlPath)
                FileUtil.RecursionDeleteFile(htmlFile)
                bootManager.update = 1
            }
        }
        var url = ctx!!.resources.getString(vm_url)
        var content = FileUtil.readFile(bootManager.htmlPath + url)
        if (content == "") {
            val stream = ctx!!.assets.open(url.substring(1))
            content = FileUtil.readFile(stream)
        }
        runtime!!.executeScript( content, url,0)

        eth.close()
        btc.close()
        cipher.close()
        api.close()
        v8Console.close()
        jsWS.close()
        boot.close()
        store.close()
        jsvm.close()

    }

    fun restartJSVM(){
        runtime = null
        createV8(ctx!!)
    }

    fun postMessage(webName: String, message: String){
        val ynWebView = YNWebView.getYNWebView(webName)
        val fullCode: String = "window['onWebViewPostMessage']('JSVM', '"+ message + "')"
        (ynWebView!!.getEnv(ynWebView!!.ACTIVITY) as Activity).runOnUiThread { CallJSRunnable(fullCode, ynWebView.getWeb("")) }
    }

    fun getReady(stage: String){
        val b = StageUtils.makeStages(stage,"JSVM")
        if (b){
            val fullCode = "window['onLoadTranslation']('" + stage + "')"
            Handler(Looper.getMainLooper()).post {
                CallJSRunnable(fullCode, YNWebView.getYNWebView("default")!!.getWeb(""))
            }
            runtime!!.executeVoidScript(fullCode)
        }
    }

    fun getDownRead(filePath: String, fileName: String, okCB: V8Function, errCB: V8Function){
        val ok = okCB.twin()
        val err = errCB.twin()
        val handler = Handler()
        handler.post {
            var fullPath = ""
            if (filePath.contains("file:///android_asset")){
                fullPath = filePath.subSequence("file:///android_asset/".length,filePath.length).toString()
            }
            val fileString = getLocalJSScript(fullPath)
            if (fileString == null){
                Handler(Looper.getMainLooper()).post {
                    val arr = V8Array(runtime!!); arr.push("can not find"); err.call(null,arr); arr.close(); err.close();ok.close();
                }
            }else{
                val dh = DataHandleManager.createNewDataHandle()
                DataHandleManager.setContent(dh,fileString!!,fileName)
                Handler(Looper.getMainLooper()).post {
                    val arr = V8Array(runtime!!); arr.push(dh); arr.push(fileName); ok.call(null,arr); arr.close(); err.close();ok.close();
                }
            }
        }
    }


    /**
     * 生成密码安全的伪随机数
     */
    fun getRandomValues():Int{
        val sercurirandom = SecureRandom()
        val bytes = ByteArray(4)
        sercurirandom.nextBytes(bytes)
        val results = bytes.getUIntAt(0).toInt()
        return results
    }



    /**
     * 打开去充值界面
     */
    fun goChareActivity(slv: Int){
        val intent = Intent(ctx!!,ChargeActivity::class.java)
        intent.putExtra("balance",slv.toString())
        ctx!!.startActivity(intent)
    }

    /**
     * 打开充值界面监听
     */
    fun addChareActionListen(success: V8Function, fail: V8Function){
        chareSuccessFunction = success.twin()
        chareFailFunction = fail.twin()
    }

    /**
     * 释放充值界面监听
     */
    fun removeChareActionListen(){
        if (chareSuccessFunction != null && !chareSuccessFunction!!.isReleased){
            chareSuccessFunction!!.close()
            chareSuccessFunction = null
        }
        if (chareFailFunction != null && !chareFailFunction!!.isReleased){
            chareFailFunction!!.close()
            chareFailFunction = null
        }
    }

    /**
     * 打开游戏内支付界面
     */
    fun goChareInGameActivity(orderId: String, kupayId: String, balance: String, seller: String, price: String, pay: Int){
        val intent = Intent(ctx!!, ChargeInGameActivity::class.java)
        intent.putExtra("balance",balance)
        intent.putExtra("orderId",orderId)
        intent.putExtra("kupayId",kupayId)
        intent.putExtra("seller",seller)
        intent.putExtra("price",price)
        intent.putExtra("pay",pay)
        ctx!!.startActivity(intent)
    }

    /**
     * 打开游戏内支付充值界面监听
     */
    fun addChareInGameActionListen(success: V8Function, fail: V8Function){
        chareSuccessFunction = success.twin()
        chareFailFunction = fail.twin()
    }

    /**
     * 释放游戏内支付充值界面监听
     */
    fun removeChareInGameActionListen(){
        if (chareInGameSuccessFunction != null && !chareInGameSuccessFunction!!.isReleased){
            chareInGameSuccessFunction!!.close()
            chareInGameSuccessFunction = null
        }
        if (chareInGameFailFunction != null && !chareInGameFailFunction!!.isReleased){
            chareInGameFailFunction!!.close()
            chareInGameFailFunction = null
        }
    }

    //打开微信宝控件
    fun goWXPay(app_id: String, partnerid: String, prepayid: String, packages: String, noncestr: String, timestamp: String, sign: String, callBack: V8Function){
        val weChatPay = WeChatPay(ctx!!, runtime!!)
        weChatPay.goWXPay(app_id, partnerid, prepayid, packages, noncestr, timestamp, sign, callBack)
    }

    //打开阿里支付控件
    fun goAliPay(app_id: String, biz_content: String, chareset: String, method: String, sign_type: String, timestamp: String, callBack: V8Function){

    }

    fun distributionMessage(messageKey: String, bundle: Bundle){
        when(messageKey){
            serviceRunCode.chargeMessage -> {
                val code = bundle.getInt(serviceRunCode.statusCodeKey)
                if (code == serviceRunCode.statusSuccess){
                    val payWay = bundle.getString(serviceRunCode.payKey)
                    val payAmount = bundle.getInt(serviceRunCode.payAmount)
                    Handler(Looper.getMainLooper()).post {
                        val array = V8Array(runtime)
                        array.push(payAmount)
                        array.push(payWay!!)
                        functionCallWithOutNull(chareSuccessFunction, array)
                        array.close()
                    }
                }else{
                    Handler(Looper.getMainLooper()).post {
                        val array = V8Array(runtime)
                        array.push(code)
                        functionCallWithOutNull(chareFailFunction, array)
                        array.close()
                    }
                }

            }
            serviceRunCode.chargeInGameMessage -> {
                val code = bundle.getInt(serviceRunCode.statusCodeKey)
                if (code == serviceRunCode.statusSuccess){
                    val payWay = bundle.getString(serviceRunCode.payKey)
                    Handler(Looper.getMainLooper()).post {
                        val array = V8Array(runtime)
                        array.push(payWay!!)
                        functionCallWithOutNull(chareInGameSuccessFunction, array)
                        array.close()
                    }
                }else{
                    Handler(Looper.getMainLooper()).post {
                        val array = V8Array(runtime)
                        array.push(code)
                        functionCallWithOutNull(chareInGameFailFunction, array)
                        array.close()
                    }
                }

            }
            serviceRunCode.shareMessage -> {
                //返回结果

            }
        }
    }

    private fun functionCallWithOutNull(func: V8Function?, array: V8Array){
        if (func != null){
            if (!func.isReleased){
                func.call(null, array)
            }
        }
    }

    /**
     * 加载assets中的JS文件
     */
    private fun getLocalJSScript(fileName: String): String? {
        try {
            val temp = ctx!!.getAssets().open(fileName)
            val br = BufferedReader(InputStreamReader(temp))
            val sb = StringBuffer()
            var strLine = br.readLine()
            while (strLine  != null) {
                sb.append(strLine).append("\r\n")
                strLine = br.readLine()
            }
            br.close()
            return sb.toString()
        } catch (e: Exception) {
            e.printStackTrace()
        }

        return null
    }

    private fun ByteArray.getUIntAt(idx: Int) =
        ((this[3].toInt() and 0xFF) shl 24 or (this[2].toInt() and 0xFF) shl 16 or (this[1].toInt() and 0xFF) shl 8 or (this[0].toInt() and 0xFF)).toLong()




    companion object {
        private val vm_url = R.string.vm_url
        @SuppressLint("StaticFieldLeak")
        private var instance: JSVMManager? = null
            get() {
                if (field == null) {
                    field = JSVMManager()
                }
                return field
            }
        @Synchronized
        fun get(): JSVMManager{
            return instance!!
        }
    }

}