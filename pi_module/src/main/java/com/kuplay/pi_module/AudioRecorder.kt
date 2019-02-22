package com.kuplay.pi_module

import android.Manifest
import android.media.AudioFormat
import android.media.AudioRecord
import android.media.MediaRecorder
import android.util.Base64
import android.util.Log

import com.github.dfqin.grantor.PermissionListener
import com.github.dfqin.grantor.PermissionsUtil
import com.kuplay.pi_framework.base.BaseJSModule
import com.kuplay.pi_framework.webview.YNWebView

import java.io.ByteArrayOutputStream
import java.nio.ByteBuffer
import java.nio.ByteOrder
import java.util.Timer
import java.util.TimerTask

class AudioRecorder(ynWebView: YNWebView) : BaseJSModule(ynWebView) {

    private var bufferSizeInBytes = 0

    // 录音对象
    private var isRecording = false
    private var audioRecord: AudioRecord? = null
    private var stream: ByteArrayOutputStream? = null
    private var isPromission = false
    // 定时器
    internal var timer: Timer? = null

    /**
     * 注意：录音不能太久，因为录音数据没有写文件
     */


    fun getPromission(callBack:(callType: Int, prames: Array<Any>)->Unit){
        if (isPromission){
            callBack(BaseJSModule.SUCCESS, arrayOf("ok"))
        }else{
            callBack(BaseJSModule.FAIL, arrayOf("not open"))
        }
        PermissionsUtil.requestPermission(ctx!!, object : PermissionListener {
            override fun permissionGranted(permission: Array<String>) {
                isPromission = true
                //callBack(BaseJSModule.SUCCESS, arrayOf("ok"))
            }
            override fun permissionDenied(permission: Array<String>) {
                isPromission = false
                //callBack(BaseJSModule.FAIL, arrayOf("user denied permission"))
            }
        }, arrayOf(Manifest.permission.RECORD_AUDIO), true, mTipInfo)
    }


    fun start(callBack:(callType: Int, prames: Array<Any>)->Unit) {
        this.callBack = callBack
        if (stream != null) {
            callBack(BaseJSModule.FAIL, arrayOf("AudioRecord isnt stop!"))
            return
        }
        PermissionsUtil.requestPermission(ctx!!, object : PermissionListener {
            override fun permissionGranted(permission: Array<String>) {
                startImpl()
            }

            override fun permissionDenied(permission: Array<String>) {
                callBack(BaseJSModule.FAIL, arrayOf("user denied permission"))
                //JSCallback.callJS(null, null, callbackId, JSCallback.FAIL, "user denied permission")
            }
        }, arrayOf(Manifest.permission.RECORD_AUDIO), true, mTipInfo)
    }

    private fun startImpl() {
        try {
            bufferSizeInBytes = AudioRecord.getMinBufferSize(AUDIO_SAMPLE_RATE, AUDIO_CHANNEL, AUDIO_ENCODING)
            audioRecord = AudioRecord(AUDIO_INPUT, AUDIO_SAMPLE_RATE, AUDIO_CHANNEL, AUDIO_ENCODING, bufferSizeInBytes)

            stream = ByteArrayOutputStream()
            var CB = this.callBack
            // 以防万一，设置3分钟的定时器，定时器到了如果高层还没有调用stop或drop，主动关闭录音器
            timer = Timer()
            timer!!.schedule(object : TimerTask() {
                override fun run() {
                    drop(CB)
                }
            }, (3 * 60 * 1000).toLong())

            audioRecord!!.startRecording()
            isRecording = true

            // 开线程写数据
            Thread(Runnable { handleRecordData() }).start()
            this.callBack(BaseJSModule.SUCCESS, arrayOf(""))
            //JSCallback.callJS(activity, webView, callbackId, JSCallback.SUCCESS)
        } catch (e: Exception) {

            e.printStackTrace()

            if (stream != null) {
                stream = null
            }

            if (timer != null) {
                timer!!.cancel()
                timer = null
            }
            if (audioRecord != null) audioRecord = null
            callBack(BaseJSModule.FAIL, arrayOf("start Audio Record failed"))
            //JSCallback.callJS(activity, webView, callbackId, JSCallback.FAIL, "start Audio Record failed")
        }

    }

    fun stop(callBack:(callType: Int, prames: Array<Any>)->Unit) {
        this.callBack = callBack
        if (stream == null) {
            callBack(BaseJSModule.FAIL, arrayOf("AudioRecord isnt start!"))
            //JSCallback.callJS(activity, webView, callbackId, JSCallback.FAIL, "AudioRecord isnt start!")
            return
        }
        isRecording = false

        timer!!.cancel()
        timer = null

        audioRecord!!.stop()
        audioRecord!!.release()
        audioRecord = null


        var data: ByteArray
        data = stream!!.toByteArray()
        stream = null


        // NOTE: 这里有个隐含的假设，录音的read读的short用的是小端。
        val pcm = ShortArray(data.size / 2)
        ByteBuffer.wrap(data).order(ByteOrder.LITTLE_ENDIAN).asShortBuffer().get(pcm)
        pcmToMp3(pcm)
    }

    fun drop(callBack:(callType: Int, prames: Array<Any>)->Unit) {
        if (stream == null) {
            callBack(BaseJSModule.FAIL, arrayOf("AudioRecord isnt start!"))
            //JSCallback.callJS(activity, webView, callbackId, JSCallback.FAIL, "AudioRecord isnt start!")
            return
        }

        isRecording = false

        timer!!.cancel()
        timer = null

        audioRecord!!.stop()
        audioRecord!!.release()
        audioRecord = null
        stream = null

        callBack(BaseJSModule.SUCCESS, arrayOf(""))
        //JSCallback.callJS(activity, webView, callbackId, JSCallback.SUCCESS)
    }

    private fun pcmToMp3(pcm: ShortArray) {
        var result = ByteArray(7200 + (2.0 * pcm.size.toDouble() * 1.25).toInt())

        initMp3()
        var size = lameMp3Encode(pcm, null, pcm.size, result)
        if (size <= 0) {
            this.callBack(BaseJSModule.FAIL, arrayOf("Mp3 encode failed"))
            //JSCallback.callJS(activity, webView, callbackId, JSCallback.FAIL, "Mp3 encode failed")
            lameMp3Close()
            return
        }

        val stream = ByteArrayOutputStream()
        stream.write(result, 0, size)

        size = lameMp3Flush(result)
        if (size > 0) {
            stream.write(result, 0, size)
        }
        lameMp3Close()

        result = stream.toByteArray()
        val base64 = Base64.encodeToString(result, 0, result.size, Base64.NO_WRAP)
        this.callBack(BaseJSModule.SUCCESS, arrayOf(base64))
        //JSCallback.callJS(activity, webView, callbackId, JSCallback.SUCCESS, base64)
    }

    private fun handleRecordData() {
        val data = ByteArray(bufferSizeInBytes)
        try {
            while (isRecording) {
                var read = 0
                if (audioRecord != null) {
                    read = audioRecord!!.read(data, 0, data.size)
                }


                if (read > 0) {
                    if (stream != null) {
                        stream!!.write(data, 0, read)
                    }
                }
            }
        } catch (e: Exception) {
            Log.d("AudioRecorder", "handleRecordData failed")
            e.printStackTrace()
        }

    }

    private fun initMp3() {
        var bitRate = 16
        val channel = if (AUDIO_CHANNEL == AudioFormat.CHANNEL_IN_MONO) 1 else 2
        when (AUDIO_ENCODING) {
            AudioFormat.ENCODING_PCM_8BIT -> bitRate = 8
            AudioFormat.ENCODING_PCM_16BIT -> bitRate = 16
            AudioFormat.ENCODING_PCM_FLOAT -> bitRate = 32
        }

        // quality: 2高，5中，7低
        lameMp3Init(AUDIO_SAMPLE_RATE, channel, 0, bitRate, 7)
    }




    companion object {

        init {
            System.loadLibrary("pi-module-native-lib")
        }

        // 音频源：音频输入-麦克风
        private val AUDIO_INPUT = MediaRecorder.AudioSource.MIC
        // 采样频率: 8000, 22.05KHz、44.1KHz、48KHz
        private val AUDIO_SAMPLE_RATE = 8000
        // 音频通道 单声道
        private val AUDIO_CHANNEL = AudioFormat.CHANNEL_IN_MONO
        // 音频格式：PCM编码
        private val AUDIO_ENCODING = AudioFormat.ENCODING_PCM_16BIT

        @JvmStatic private external fun lameMp3Init(inSampleRate: Int, outChannel: Int, outSampleRate: Int, outBitrate: Int, quality: Int)

        @JvmStatic private external fun lameMp3Close()

        @JvmStatic private external fun lameMp3Encode(buffer_l: ShortArray, buffer_r: ShortArray?, samples: Int, mp3buf: ByteArray): Int

        @JvmStatic private external fun lameMp3Flush(mp3buf: ByteArray): Int
    }


}
