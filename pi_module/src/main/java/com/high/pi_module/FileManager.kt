package com.high.pi_module

import com.high.pi_framework.Util.FileUtil
import com.high.pi_framework.base.BaseJSModule
import com.high.pi_framework.webview.YNWebView

class FileManager(ynWebView: YNWebView) : BaseJSModule(ynWebView)  {

    private val gamePath = ctx!!.filesDir.path + "/game/"
    /**
     * 文件存储到沙盒目录中
     * @param fileName : 文件存储名
     * @param content: 存储内容
     */
    fun saveFile(fileName: String, content: String, append: Number, callBack:(callType: Int, prames: Array<Any>)->Unit){
        val ad = (append == 0)
        FileUtil.writeFile(gamePath+fileName,content.toByteArray(), ad)
        callBack(BaseJSModule.SUCCESS, arrayOf(""))
    }

    /**
     * 读取文件内容，读取成功之后删除文件
     *
     */
    fun readFile(fileName: String, callBack:(callType: Int, prames: Array<Any>)->Unit){
        val content = FileUtil.readFile(gamePath+fileName)
        FileUtil.removeFile(gamePath+fileName)
        callBack(BaseJSModule.SUCCESS, arrayOf(content))
    }

}