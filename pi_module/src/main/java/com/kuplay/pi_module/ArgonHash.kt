package com.kuplay.pi_module

import android.os.AsyncTask
import android.text.TextUtils
import com.kuplay.pi_framework.base.BaseJSModule
import com.kuplay.pi_framework.webview.YNWebView
import de.wuthoehle.argon2jni.Argon2
import de.wuthoehle.argon2jni.EncodedArgon2Result
import de.wuthoehle.argon2jni.SecurityParameters
import java.io.UnsupportedEncodingException
import java.lang.ref.WeakReference

class ArgonHash(ynWebView: YNWebView) : BaseJSModule(ynWebView) {
    private var t: Int = 0
    private var m: Int = 0
    private var p: Int = 0
    private var type: Int = 0
    private var hashLen: Int = 0
    private var pwd: String? = null
    private var salt: String? = null
    //    private final ProgressDialog dialog;

    /* public ArgonHash() {
        dialog = new ProgressDialog(ctx);
        dialog.setProgressStyle(ProgressDialog.STYLE_SPINNER);
        dialog.setCancelable(false);
        dialog.setTitle("请稍等...");
        dialog.setMessage("正在计算Hash值");
    }*/

    /**
     * 计算Argon2 Hash
     *
     * @param callbackId js调用此方法的回调Id
     * @param t          迭代次数
     * @param m          内存，单位：KB
     * @param p          并行数量
     * @param pwd        密码
     * @param salt       盐
     * @param type       算法类型(0 1 2)
     * @param hashLen    结果长度
     */
    fun getArgon2Hash(t: Int, m: Int, p: Int, pwd: String, salt: String, type: Int, hashLen: Int, callBack:(callType: Int, prames: Array<Any>)->Unit) {
        this.callBack = callBack
        this.t = t
        this.m = m
        this.p = p
        this.type = type
        this.hashLen = hashLen
        this.pwd = pwd
        this.salt = salt
        CalcHashTask(this, this.callBack).execute()
    }

    /**
     * 计算可能会是一个耗时的操作
     * 防止ANR的出现以及内存泄露的出现
     * 使用静态内部类异步执行任务
     */
    private class CalcHashTask internal constructor(hash: ArgonHash, callBack:(callType: Int, prames: Array<Any>)->Unit) : AsyncTask<Void, Void, String>() {
        private val weak: WeakReference<ArgonHash>
        var CB = callBack
        init {
            weak = WeakReference(hash)
        }

        /*@Override
        protected void onPreExecute() {
            ArgonHash hash = weak.get();
            if (null == hash) return;
            if (!hash.dialog.isShowing()) {
                hash.dialog.show();
            }
        }*/

        override fun doInBackground(vararg voids: Void): String {
            try {
                val hash = weak.get() ?: return ""
                val version = Argon2.VersionIdentifiers.VERSION_13
                val securityParameters = SecurityParameters(hash.t, hash.m, hash.p)
                val argon = Argon2(securityParameters, hash.hashLen, hash.type, version)
                val result = argon.argon2_hash(hash.pwd!!.toByteArray(charset("US-ASCII")), hash.salt!!.toByteArray(charset("US-ASCII")))
                return hash.bytesToHex(result).toString()
            } catch (e: UnsupportedEncodingException) {
                e.printStackTrace()
                return ""
            }

        }

        override fun onPostExecute(s: String) {
            val hash = weak.get() ?: return
/*if (hash.dialog.isShowing()) {
                hash.dialog.dismiss();
            }*/
            if (TextUtils.isEmpty(s)) {
                CB(BaseJSModule.FAIL, arrayOf(""))
                //JSCallback.callJS(null, null, hash.getCallbackId(), JSCallback.getFAIL(), "")
            } else {
                CB(BaseJSModule.SUCCESS, arrayOf(s))
            }
        }
    }


    /**
     * Convert char to byte
     * @param c char
     * *
     * @return byte
     */
    private fun charToByte(c: Char): Byte {

        return "0123456789ABCDEF".indexOf(c).toByte()
    }

    /* 这里我们可以将byte转换成int，然后利用Integer.toHexString(int)来转换成16进制字符串。
        * @param src byte[] data
        * @return hex string
        */
    fun bytesToHex(result: EncodedArgon2Result): String? {
        var src = result.result
        val stringBuilder = StringBuilder("")
        if (src == null || src.size <= 0) {
            return null
        }
        for (i in 0 until src.size-1) {
            val v = src[i].toInt() and 0xFF
            val hv = Integer.toHexString(v)
            if (hv.length < 2) {
                stringBuilder.append(0)
            }
            stringBuilder.append(hv)
        }
        return stringBuilder.toString()
    }
}