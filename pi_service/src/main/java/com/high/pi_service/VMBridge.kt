package com.high.pi_service

import android.content.Context
import android.os.Handler
import android.os.Looper
import android.util.Log
import com.high.pi_service.utils.*
import java.util.HashMap

class VMBridge(private val ctx: Context, private val runtime: V8) {

    //获取主线程
    private val mainHandler = Handler(Looper.getMainLooper())

    private var currID = 0
    /**
     * 对象映射表，键从1开始递增
     */
    private val objMap = HashMap<Int, Any>()
    /**
     * 类映射表，键是类名
     */
    val clsMap = HashMap<String, ClassInfo>()
    init {
        val classes = CodeUtil.getAllClassByInterface(PSExecutable::class.java)
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

    //高层调用底层
    fun postMessage(arr: V8Array){

        val className: String = arr[0].toString()
        val methodName: String = arr[1].toString()
        val nativeID: Int = arr[2] as Int
        val listenerID: Int = arr[3] as Int
        Log.d("VMBridge","$className,$methodName,$nativeID,$listenerID")
        var callBack = { callType: Int, prames: Array<Any> ->
            if (callType == 3){
                throwJS(className,methodName,prames[0] as String)
            }else{
                callJS( listenerID, callType, prames)
            }
        }
        try {
            var params = arrayOfNulls<Any>(1 )
            if (arr.length() > 4){
                params = arrayOfNulls<Any>(arr.length() - 3)
                for (i in 4 until (arr.length() + 1)){
                    if (i == arr.length()){
                        params[i-4] = callBack
                    }else{
                        var js = arr[i]
                        if (js.toString().contains("\\\\")){
                            js = js.toString().replace("\\\\","\\\\\\\\")
                        }
                        params[i-4] = js
                    }
                }
            }else{
                params[0] = callBack
            }
            when (methodName) {
                METHOD_INIT -> {

                    val id = newInstance(className, ctx, runtime)
                    callJS(listenerID, BasePSModule.SUCCESS, arrayOf(id))
                }
                METHOD_CLOSE -> {
                    removeObject(nativeID)
                    callJS( listenerID, BasePSModule.SUCCESS, emptyArray())
                }
                else -> call(className, methodName, nativeID, params)

            }
        } catch (e: Exception) {
            Log.d("VMBridge",e.message!!)
            //throwJS(webView, webView.getEnv(webView.ACTIVITY) as Activity, className, methodName, e.message!!)
        }
    }

    fun callJS( listenerId: Int, @BasePSModule.Companion.StatusCode statusCode: Int, params: Array<Any>) {

        val func = StringBuilder("window['handle_native_message']($listenerId, $statusCode")
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
                    throwJS("Android", "CallJS", "Internal Error, CallJS params error!")
                    return
                }
            }
        func.append(")")

        Log.d("VMBridge", "callJS: " + func.toString())
        mainHandler.post {
            runtime.executeVoidScript(func.toString())
        }
    }



    fun throwJS(className: String, methodName: String, message: String) {
        val func = String.format("handle_native_throwerror('%s', '%s', '%s')", className, methodName, message)
        Log.d("VMBridge", "throwJS: $func")
        mainHandler.post {
            runtime.executeVoidScript(func)
        }
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
    fun newInstance(className: String, ctx: Context, runtime: V8): Int {
        val info = clsMap[className] ?: throw Exception("JSEnv.call class $className do not find")
        val id: Int
        try {
            val c = info.clazz.constructors[0]
            val o = c.newInstance(ctx, runtime)
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
        val info = clsMap[className] ?: throw Exception("JSEnv.call class $className do not find")

        val m = info.methods!![methodName]
            ?: throw Exception("call method " + methodName + "in class " + className + " do not find")
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

    fun onDestroy(){

    }

    companion object {
        private val METHOD_INIT = "init"//method name->init
        private val METHOD_CLOSE = "close"//method name->close

    }

}