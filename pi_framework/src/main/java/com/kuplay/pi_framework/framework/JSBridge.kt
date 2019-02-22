package com.kuplay.pi_framework.framework

import android.app.Activity
import android.util.Log
import android.webkit.JavascriptInterface
import com.kuplay.pi_framework.Util.ClassInfo
import com.kuplay.pi_framework.Util.CodeUtil
import com.kuplay.pi_framework.Util.ContainerUtil
import com.kuplay.pi_framework.base.BaseJSModule
import com.kuplay.pi_framework.base.JSExecutable
import com.kuplay.pi_framework.module.WebViewManager
import com.kuplay.pi_framework.webview.YNWebView
import org.json.JSONArray
import java.util.HashMap

class JSBridge(ynWebView: YNWebView) {
    var webView : YNWebView = ynWebView
    private var currID = 0
    /**
     * 对象映射表，键从1开始递增
     */
    private val objMap = HashMap<Int, Any>()
    /**
     * 类映射表，键是类名
     */
    private val clsMap = HashMap<String, ClassInfo>()
    init {
        val classes = CodeUtil.getAllClassByInterface(JSExecutable::class.java)
        if (!ContainerUtil.isNullOrEmpty(classes)){
            for (clazz in classes) {
                setClass(clazz.simpleName, clazz)
            }
        }

    }




    private fun setClass(className: String, clazz: Class<*>) {
        val info = ClassInfo(clazz)
        clsMap[className] = info
        val ms = clazz.declaredMethods
        for (m in ms) {
            info.methods!![m.name] = m
        }
    }

    @JavascriptInterface
    fun postMessage(className: String, methodName: String, nativeID: Int, listenerID: Int, jsonArray: String){
        Log.d("JSBridge","$className,$methodName,$jsonArray")
        var callBack = { callType: Int, prames: Array<Any> ->
            //if (callType == BaseJSModule.SUCCESS){
            callJS(webView.getEnv(webView.ACTIVITY) as Activity?, webView.getEnv(webView.WEBVIEW), listenerID, callType, prames)
            //}else if (callType == BaseJSModule.FAIL){
            //    callJS(webView.getEnv(webView.ACTIVITY) as Activity?, webView.getEnv(webView.WEBVIEW), listenerID, callType, prames)
            //}
        }
        try {
            val js = JSONArray(jsonArray)
            val params = arrayOfNulls<Any>(1 + js.length())
            for (i in 0 until params.size) {
                if (i == js.length()){
                    params[i] = callBack
                }
                else {
                    params[i] = js.get(i)
                }
            }
            when (methodName) {
                METHOD_INIT -> {
                    val id = newInstance(className, webView)
                    callJS(webView.getEnv(webView.ACTIVITY) as Activity?, webView.getEnv(webView.WEBVIEW), listenerID, BaseJSModule.SUCCESS, arrayOf(id))
                }
                METHOD_CLOSE -> {
                    removeObject(nativeID)
                    callJS(webView.getEnv(webView.ACTIVITY) as Activity?, webView.getEnv(webView.WEBVIEW), listenerID, BaseJSModule.SUCCESS, emptyArray())
                }
                else -> call(className, methodName, nativeID, params)

            }
        } catch (e: Exception) {
            throwJS(webView, webView.getEnv(webView.ACTIVITY) as Activity, webView.getEnv(webView.WEBVIEW), className, methodName, e.message!!)
        }
    }



    fun callJS(activity: Activity?, webview: Any?, listenerId: Int, @BaseJSModule.Companion.StatusCode statusCode: Int, params: Array<Any>) {
        var activity = activity
        var webview = webview
        if (activity == null) {
            activity = webView.getEnv(webView.ACTIVITY) as Activity
        }
        if (webview == null) {
            webview = webView.getEnv(webView.WEBVIEW)
        }
        val func = StringBuilder("window['handle_Native_Message']($listenerId, $statusCode")
        if (null != params)
            for (o in params) {
                Log.d("callJS","$o")
                if (o is Byte) {
                    val v = o.toInt()
                    func.append(", ").append(v)
                } else if (o is Short) {
                    val v = o.toInt()
                    func.append(", ").append(v)
                } else if (o is Int) {
                    val v = o
                    func.append(", ").append(v)
                } else if (o is Float) {
                    val v = o
                    func.append(", ").append(v)
                } else if (o is Double) {
                    val v = o
                    func.append(", ").append(v)
                } else if (o is Boolean) {
                    val v = o
                    func.append(", ").append(if (v) 1 else 0)
                } else if (o is String) {
                    val s = o as String
                    func.append(String.format(", '%s'", s))
                } else {
                    throwJS(webView, activity, webview, "Android", "CallJS", "Internal Error, CallJS params error!")
                    return
                }
            }
        func.append(")")

        Log.d("JSBridge", "callJS: " + func.toString())
        activity.runOnUiThread(CallJSRunnable(func.toString(),webView))
    }



    fun throwJS(ynWebView: YNWebView, activity: Activity, webview: Any?, className: String, methodName: String, message: String) {
        val func = String.format("handle_Native_ThrowError('%s', '%s', '%s'", className, methodName, message)
        Log.d("JSBridge", "throwJS: $func")
        activity.runOnUiThread(CallJSRunnable(func, ynWebView))
    }

    /**
     * 移除对象
     */
    fun removeObject(id: Int) {
        objMap.remove(id)
    }

    /**
     * 根据ID取对象
     */
    fun getObject(id: Int): Any? {
        return objMap[id]
    }

    /**
     * 添加对象，获得对象的id
     */
    fun addObject(o: Any): Int {
        val id = ++currID
        objMap[id] = o
        return id
    }

    /**
     * 生成对象的实例，返回id
     */
    @Throws(Exception::class)
    fun newInstance(className: String, ynWebView: YNWebView): Int {
        val info = clsMap[className] ?: throw Exception("JSEnv.call class $className don't find")
        val id: Int
        try {
            val c = info.clazz.constructors[0]
            val o = c.newInstance(ynWebView)
            id = addObject(o)
        } catch (e: Exception) {
            e.printStackTrace()
            throw Exception(e)
        }

        return id
    }

    /**
     * 通用调用
     */
    @Throws(Exception::class)
    fun call(className: String, methodName: String, objectID: Int, params: Array<Any?>): Any? {
        var obj: Any? = null
        if (objectID > 0) {
            obj = getObject(objectID)
        }
        val info = clsMap[className] ?: throw Exception("JSEnv.call class $className don't find")

        val m = info.methods!![methodName]
            ?: throw Exception("call method " + methodName + "in class " + className + " don't find")
        var r: Any? = null
        try {
            for (o in params){
                Log.d("call","${obj.toString()},${o.toString()}")
            }

            r = m.invoke(obj, *params)
        } catch (e: Exception) {
            e.printStackTrace()
        }

        return r
    }

    companion object {
        private val TAG = JSBridge::class.java.name
        private val METHOD_INIT = "init"//method name->init
        private val METHOD_CLOSE = "close"//method name->close
    }
}

class CallJSRunnable(private val func: String, val ynWebView: YNWebView) : Runnable {
    override fun run() {
        ynWebView.evaluateJavascript(func)
    }
}
