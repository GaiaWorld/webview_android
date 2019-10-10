package com.high.pi_framework.framework

import com.high.pi_framework.Util.FileUtil

object splashUtil {
    val filePath = "/data/data/com.high.ydzm/splashUtile.txt"

    fun read(): String{
        val file = FileUtil.readFile(filePath)
        return file
    }



}