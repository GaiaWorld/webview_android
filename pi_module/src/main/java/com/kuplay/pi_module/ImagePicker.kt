package com.kuplay.pi_module

import android.Manifest
import android.annotation.SuppressLint
import android.content.Intent
import android.os.AsyncTask
import android.text.TextUtils
import android.util.Log
import com.github.dfqin.grantor.PermissionListener
import com.github.dfqin.grantor.PermissionsUtil
import com.iqos.imageselector.utils.ImageSelector
import com.iqos.imageselector.utils.ImageSelectorUtils
import com.kuplay.pi_framework.Util.FileUtil
import com.kuplay.pi_framework.base.BaseJSModule
import com.kuplay.pi_framework.framework.WebViewActivity
import com.kuplay.pi_framework.webview.YNWebView
import java.io.File

class ImagePicker(ynWebView: YNWebView) : BaseJSModule(ynWebView) {
    /**
     * Whether use the camera?
     *
     * @return 1、true the camera will be used. 2、false the camera won't be used.
     */
    /**
     * Whether use the camera?
     *
     * @param useCamera 1、true the camera  will be used. 2、false the camera won't be used.
     */
    private var isUseCamera: Boolean = false
    private var path = ""   // 最近选择的图片路径

    /**
     * What would you like to prompt user "You Missed Permission".
     *
     * @return the message content you want to prompt user.
     */
    protected val tipContentWithoutPermission: String
        get() = if (isUseCamera) ctx!!.resources.getString(R.string.tip_please_allow_app_read_gallery_with_camera) else ctx!!.resources.getString(R.string.tip_please_allow_app_read_gallery_without_camera)

    /**
     * .
     * * Select photo from local gallery.
     *
     * @param callbackId transmission from js,
     * that will be use when [JSCallback] callback js.
     * @param useCamera  whether use phone's camera:the value "1" means true,else means false.
     * @param single     just select one photo:the value "1" means true,else means false.
     * @param max        the max photos that you could select.
     */
    fun chooseImage(useCamera: Int, single: Int, max: Int, callBack:(callType: Int, prames: Array<Any>)->Unit) {
        isUseCamera = 1 == useCamera
        this.callBack = callBack
        //this.setCallbackId(callbackId)
        PermissionsUtil.requestPermission(ctx!!, object : PermissionListener {
            override fun permissionGranted(permission: Array<String>) {
                openGallery(1 == useCamera, 1 == single, max)
            }

            override fun permissionDenied(permission: Array<String>) {
                callBack(BaseJSModule.SUCCESS, arrayOf("用户拒绝了权限!"))
                //JSCallback.callJS(null, null, callbackId, JSCallback.getFAIL(), "用户拒绝了权限!")
            }
        }, arrayOf(Manifest.permission.WRITE_EXTERNAL_STORAGE, Manifest.permission.CAMERA), true, mTipInfo)
    }

    /**
     * Open the gallery to choose a piece of photo.
     */
    private fun openGallery(useCamera: Boolean, single: Boolean, max: Int) {
        //限数量的多选(比如最多9张)
        ImageSelector.builder()
            .useCamera(useCamera)//设置是否使用拍照
            .setSingle(single)//设置是否单选
            // .setCrop(true)    // 裁剪功能
            .showGif(false)//是否要显示GIF图片(默认是要显示的)
            .setMaxSelectCount(max)//图片的最大选择数量，小于等于0时，不限数量。
            .start(ctx!!, WebViewActivity.APP_RESULT_CODE)//打开相册
    }

    /**
     * Change the image to te byte arrays might take much time,
     * in order not to cause ANR, use thread asynchronous.
     */
    private class GetImageContenTask (private val quality:Int,private  val callBack:(callType: Int, prames: Array<Any>)->Unit) : AsyncTask<String, Void, String>() {

        override fun doInBackground(vararg strings: String): String? {

            val path = strings[0]
            if (TextUtils.isEmpty(path)) {
                return null
            }

            try {
                val bmp = FileUtil.file2Bitmap(path)
                return FileUtil.bitmapToBase64(bmp,quality)
            } catch (e: Exception) {
                e.printStackTrace()
                return null
            }

        }

        override fun onPostExecute(base64: String) {
            if (TextUtils.isEmpty(base64)) {
                callBack(BaseJSModule.FAIL, arrayOf("GetImageContenTask Failed"))
            } else {
                callBack(BaseJSModule.SUCCESS, arrayOf(base64))
            }
        }
    }

    private class GetAHashTask (private val callBack:(callType: Int, prames: Array<Any>)->Unit) : AsyncTask<String, Void, String>() {

        override fun doInBackground(vararg strings: String): String? {
            val path = strings[0]
            if (TextUtils.isEmpty(path)) {
                return null
            }

            try {
                val bitmapARGB = FileUtil.getBitmapPixelColors(path)
                val imageWidth = FileUtil.getImageWidth(path)
                val imageHeight = FileUtil.getImageHeight(path)
                val rest =  AHash.ahash(bitmapARGB, imageWidth, imageHeight, 4)
                return rest
            } catch (e: Exception) {
                e.printStackTrace()
                return null
            }

        }

        override fun onPostExecute(hash: String) {
            if (TextUtils.isEmpty(hash)) {
                callBack(BaseJSModule.FAIL, arrayOf("GetAHashTask Failed"))
                //JSCallback.callJS(null, null, this.callbackID, JSCallback.getFAIL(), "GetAHashTask Failed")
            } else {
                callBack(BaseJSModule.SUCCESS, arrayOf(hash))
                //JSCallback.callJS(null, null, this.callbackID, JSCallback.getSUCCESS(), hash)
            }
        }
    }

    /**
     * 计算AHash
     * This method will be called by js.
     *
     */
    fun getAHash(callBack:(callType: Int, prames: Array<Any>)->Unit) {
        if (!this.path.startsWith("file://")) {
            callBack(BaseJSModule.FAIL, arrayOf("path is invalid"))
            //JSCallback.callJS(null, null, callbackId, JSCallback.getFAIL(), "path is invalid")
            return
        }

        val path = this.path.substring("file://".length)

        try {
            GetAHashTask(callBack).execute(path)
        } catch (e: Exception) {
            e.printStackTrace()
            callBack(BaseJSModule.FAIL, arrayOf("getAHash Failed!"))
            //JSCallback.callJS(null, null, callbackId, JSCallback.getFAIL(), "getAHash Failed!")
        }

    }

    /**
     * 得到图片内容
     * This method will be called by js.
     *
     */
    fun getContent(quality:Int,callBack:(callType: Int, prames: Array<Any>)->Unit) {
        if (!this.path.startsWith("file://")) {
            callBack(BaseJSModule.FAIL, arrayOf("取不到图片内容 1"))
            return
        }

        val path = this.path.substring("file://".length)

        try {
            GetImageContenTask(quality,callBack).execute(path)
        } catch (e: Exception) {
            e.printStackTrace()
            callBack(BaseJSModule.FAIL, arrayOf("ImagePicker getContent Failed!"))
            //JSCallback.callJS(null, null, callbackId, JSCallback.getFAIL(), "ImagePicker getContent Failed!")
        }

    }

    /**
     * Dispatch incoming result to the correct fragment.
     *
     * @param requestCode request code
     * @param resultCode  the code of result,this mark is set by user,this will be used as mark.
     * @param data        Callback data from last Activity.
     */
    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        when (requestCode) {
            WebViewActivity.APP_RESULT_CODE -> {
                if (null != data) {
                    //获取选择器返回的数据
                    val images = data.getStringArrayListExtra(ImageSelectorUtils.SELECT_RESULT)
                    if (null != images && 0 != images.size) {
                        val path = images[0]
                        if (1 == images.size && path != null) {
                            this.path = "file://$path"
                            val width = FileUtil.getImageWidth(path)
                            val height = FileUtil.getImageHeight(path)
                            this.callBack(BaseJSModule.SUCCESS, arrayOf(width,height,path))
                        } else {
                            this.callBack(BaseJSModule.FAIL, arrayOf("The path is null."))
                        }
                    } else {
                        this.callBack(BaseJSModule.FAIL, arrayOf("The path is null."))
                    }
                }else{
                    this.callBack(BaseJSModule.FAIL, arrayOf("未选择图片"))
                }


            }
        }
    }

    /**
     * 把文件复制到Data目录下
     *
     * @param path 源文件的路径
     */
    @SuppressLint("SdCardPath")
    private fun copyFileToDataDir(path: String) {
        val copy = "/data/data/" + ctx!!.packageName + FileUtil.getFileNameByPath(path)
        ctx!!.runOnUiThread {
            val success = FileUtil.copyFile(path, copy)
            if (success) {
                Log.d("拷贝过后的新文件路径：", copy)
                callBack(BaseJSModule.SUCCESS, arrayOf(copy))
            } else {
                callBack(BaseJSModule.FAIL, arrayOf("Copy file failed."))
            }
        }
    }

    companion object {
        private val TAG = "ImagePicker"
    }

}