package com.kuplay.pi_framework.module.service

import android.app.Service
import android.content.Intent
import android.os.*
import okhttp3.*
import java.io.File
import java.io.FileOutputStream
import java.io.IOException
import java.io.InputStream
import java.lang.ref.WeakReference

class UpdateAppService : Service() {
    private var mDownloadProgressListener: ((total: Int, progress: Int) -> Unit)? = null
    private var mDownloadFinishListener: ((filePath: String) -> Unit)? = null
    override fun onBind(intent: Intent): IBinder = UpdateBinder()
    private val mHandler = DownloadHandler(this)
    private var maxLen = 0L
    private var currentLen = 0
    private var running = false
    private var filePath = ""
    /**
     * Start download the apk file.
     * @param url download url.
     */
    fun startDownload(url: String) {
        if (running) return
        filePath = getSavePath() + getFileNameByUrl(url)
        val tempFile = File("$filePath.temp")
        if (tempFile.exists()) {
            if (!tempFile.delete()) return
        }
        val finalFile = File(filePath)
        if (finalFile.exists()) {
            mHandler.sendEmptyMessage(DOWNLOAD_FINISH)
            return
        }
        running = true
        val client = OkHttpClient()
        val request = Request.Builder()
            .url(url)
            .build()
        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                mHandler.sendEmptyMessage(DOWNLOAD_FAILED)
                running = false
            }

            override fun onResponse(call: Call, response: Response) {
                var inputStream: InputStream? = null
                var fos: FileOutputStream? = null
                try {
                    val body = response.body()
                    if (null == body) {
                        mHandler.sendEmptyMessage(DOWNLOAD_FAILED)
                        return
                    }
                    maxLen = body.contentLength()//文件总大小
                    val buf = ByteArray(1024 * 2)
                    var len: Int
                    fos = FileOutputStream(tempFile)
                    inputStream = body.byteStream()
                    while (true) {
                        len = inputStream.read(buf)
                        if (-1 == len) break
                        fos.write(buf, 0, len)
                        currentLen += len
                        mHandler.sendEmptyMessage(DOWNLOAD_UPDATE)//更新下载进度
                    }
                    fos.flush()
                    val renameSuccess = tempFile.renameTo(File(filePath))
                    mHandler.sendEmptyMessage(if (renameSuccess) DOWNLOAD_FINISH else DOWNLOAD_FAILED)
                } catch (e: Exception) {
                    e.printStackTrace()
                    mHandler.sendEmptyMessage(DOWNLOAD_FAILED)//下载失败
                } finally {
                    try {
                        fos?.close()
                        inputStream?.close()
                    } catch (e: Exception) {
                        e.printStackTrace()
                    }
                }
            }
        })
    }

    inner class UpdateBinder : Binder() {
        fun getService(): UpdateAppService {
            return this@UpdateAppService
        }
    }


    class DownloadHandler(service: UpdateAppService) : Handler() {
        private val wr = WeakReference(service)
        override fun handleMessage(msg: Message?) {
            val service = wr.get() ?: return
            when (msg?.what) {
                DOWNLOAD_UPDATE -> service.mDownloadProgressListener?.invoke(service.maxLen.toInt(), service.currentLen)
                DOWNLOAD_FAILED -> {
                    service.running = false
                    service.currentLen = 0
                }
                DOWNLOAD_FINISH -> {
                    service.mDownloadFinishListener?.invoke(service.filePath)
                    service.running = false
                    service.currentLen = 0
                }
                else -> super.handleMessage(msg)
            }
        }
    }

    fun addDownloadProgressListener(listener: ((total: Int, progress: Int) -> Unit)) {
        this.mDownloadProgressListener = listener
    }

    fun addDownloadFinishListener(listener: ((filePath: String) -> Unit)) {
        this.mDownloadFinishListener = listener
    }

    private fun getSavePath(): String {
        return Environment.getExternalStorageDirectory().absolutePath + File.separator
    }

    private fun getFileNameByUrl(url: String): String {
        return url.substring(url.lastIndexOf("/") + 1)
    }


    companion object {
        const val DOWNLOAD_UPDATE = 0
        const val DOWNLOAD_FINISH = 1
        const val DOWNLOAD_FAILED = 2
    }
}
