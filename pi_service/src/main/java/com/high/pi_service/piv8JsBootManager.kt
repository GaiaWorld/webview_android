package com.high.pi_service

import android.content.Context
import android.os.Handler
import android.os.Looper
import android.util.Log
import com.kuplay.pi_framework.piv8.utils.DataHandleManager
import com.kuplay.pi_framework.piv8.utils.FileUtil
import okhttp3.*
import org.json.JSONArray
import org.json.JSONObject
import java.io.BufferedReader
import java.io.IOException
import java.io.InputStreamReader
import java.util.concurrent.TimeUnit

class PiV8JsBootManager(private val context: Context, private val v8: V8){

    private val mainHander = Handler(Looper.getMainLooper())
    private val bootPath: String = "/data/data/" + context.packageName
    val htmlPath: String = "$bootPath/html/vm"
    val apkPath: String  = "$bootPath/apk_back"
    var update: Int = 0
    private var mBootFilePaths: JSONObject? = null
    private val mConfigPath: String = "$htmlPath/bootFilePaths.json"

    init {
        val context = FileUtil.readFile(mConfigPath)
        try {
            if(context == ""){
                mBootFilePaths = JSONObject()
            }else{
                mBootFilePaths = JSONObject(context)
            }
        }catch (e: Exception){
            e.printStackTrace()
        }
    }


    fun saveFile(path: String, content: String){
        var sPath = path
        try {
            if (sPath.contains(".depend")) {
                sPath = sPath.replace(".depend", "depend")
            }

            val fullPath = "$htmlPath/$path"
            FileUtil.writeFile(fullPath, content.toByteArray(Charsets.UTF_8), false)

            sPath = sPath.substring(sPath.lastIndexOf("/") + 1)
            mBootFilePaths!!.put(sPath, fullPath)
            FileUtil.writeFile(mConfigPath, mBootFilePaths!!.toString().toByteArray(Charsets.UTF_8),false)

            Log.d("Intercept", "JSIntercept.saveFile: $fullPath")
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    fun getMobileBootFiles(callback: V8Function){
        val cb = callback.twin()
        val result = JSONObject()
        try {
            val iterator = mBootFilePaths!!.keys()
            while (iterator.hasNext()) {
                val key = iterator.next() as String
                val fullPath = mBootFilePaths!!.getString(key)
                val content = FileUtil.readFile(fullPath)
                val dhi = DataHandleManager.createNewDataHandle()
                DataHandleManager.setContent(dhi,content,key)
                result.put(key, dhi)
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
        mainHander.post { val v8Array = V8Array(v8); v8Array.push(result.toString()); cb.call(null,v8Array); v8Array.close(); cb.close() }
    }

    fun restartJSVM(){
        mainHander.post { JSVMManager.get().restartJSVM() }
    }

    fun loadJS(defaultDomains: String, path: String):Int{

        if(defaultDomains.contains("file:///android_asset")){
            var subPath = path.subSequence(1,path.length)
            val temp = context.getAssets().open(subPath.toString())
            val br = BufferedReader(InputStreamReader(temp))
            val sb = StringBuffer()
            var strLine = br.readLine()
            while (strLine  != null) {
                sb.append(strLine).append("\r\n")
                strLine = br.readLine()
            }
            br.close()
            val dh = DataHandleManager.createNewDataHandle()
            DataHandleManager.setContent(dh, sb.toString(), path)
            return dh
        }else{
            val fullPath = defaultDomains + path
            val content = FileUtil.readFile(fullPath)
            val dh = DataHandleManager.createNewDataHandle()
            DataHandleManager.setContent(dh,content,path)
            return dh
        }
    }

    fun updateApp(url: String){
        //下载app（JSVM不需要下载）
        Log.d("piv8","javascript打印 = 下载地址 = $url")
    }

    fun getAppVersion(cb: V8Function){
        var name = ""
        try {
            val pm = context.applicationContext.packageManager
            val info = pm.getPackageInfo(context.applicationContext.packageName, 0)
            name = info.versionName
        } catch (e: Exception) {
            e.printStackTrace()
        }
        val arr = V8Array(v8)
        arr.push(true)
        arr.push(name)
        arr.push(update)
        cb.call(null,arr)
        arr.close()
    }

    fun updateFinish(){
        update = 0
    }

    fun updateDownload(domains: V8Array, url: String, files: String, success: V8Function, fail: V8Function, progress: V8Function){
        val successCB = success.twin()
        val failCB = fail.twin()
        var start = 0
        var i = 0
        var obj = JSONArray(files)
        goDownload(domains,url,obj, { file, dh ->
            start = start + 1
            mainHander.post {
                val arr = V8Array(v8)
                arr.push(file)
                arr.push(dh)
                successCB.call(null,arr)
                if (start >= files.length){
                    successCB.close()
                }
                arr.close()
                failCB.close()
            }
        }, {
            val arr = V8Array(v8)
            arr.push("downLoad fail")
            failCB.call(null,arr)
            arr.close()
            failCB.close()
            successCB.close()
        },{

        },0)
    }

    fun saveDepend(content: String){
        saveFile(".depend",content)
    }

    fun saveIndexJS(content: String){
        saveFile("boot/jsindex.js",content)
    }

    fun goDownload(domains: V8Array, url: String, files: JSONArray, successCallBack:(name: String, dh: Int)->Unit, failCallBack:()->Unit, progressCallBack:()->Unit, retry:Int){
        if (retry >= domains.length()){
            failCallBack()
            return
        }
        val fullPath = domains[retry].toString() + url
        val okHttpClient = OkHttpClient.Builder().readTimeout(5,TimeUnit.SECONDS).build()
        val request = Request.Builder().url(fullPath).get().build()
        val call = okHttpClient.newCall(request)
        call.enqueue(object : Callback{
            override fun onFailure(call: Call, e: IOException) {
                goDownload(domains,url,files,successCallBack,failCallBack,progressCallBack,retry+1)
            }

            override fun onResponse(call: Call, response: Response) {
                val isn = response.body()!!.bytes()
                var start = 0
                var end = 0
                var i = 0
                while ( i < files.length()){
                    var file = files[i] as JSONObject
                    start = start + end
                    end = end + file.get("size") as Int
                    var name = file.get("path").toString()
                    var data:ByteArray = isn.copyOfRange(start, end)
                    var content: String = data.toString(Charsets.UTF_8)
                    var dhi = DataHandleManager.createNewDataHandle()
                    DataHandleManager.setContent(dhi, content, name)
                    successCallBack(file.toString(), dhi)
                    if (name.contains("boot")){
                        //保存到documents
                        saveFile(name,content)
                    }
                    i = i + 1
                }
            }
        })
    }


}