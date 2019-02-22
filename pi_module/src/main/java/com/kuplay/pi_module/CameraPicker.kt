package com.kuplay.pi_module

import android.Manifest
import android.content.Intent
import android.os.Environment
import android.provider.MediaStore
import android.support.v4.app.ActivityCompat
import android.support.v4.content.FileProvider
import com.github.dfqin.grantor.PermissionListener
import com.github.dfqin.grantor.PermissionsUtil
import com.kuplay.pi_framework.Util.FileUtil
import com.kuplay.pi_framework.base.BaseJSModule
import com.kuplay.pi_framework.webview.YNWebView
import java.io.File
import java.io.IOException

class CameraPicker(ynWebView: YNWebView) : BaseJSModule(ynWebView) {
    private val TAKE_PHOTO = 3

    lateinit var mCurrentPhotoPath : String

    @Throws(IOException::class)
    fun takePhoto(callBack:(callType: Int, prames: Array<Any>)->Unit) {
        this.callBack = callBack

        PermissionsUtil.requestPermission(ctx!!, object : PermissionListener {
            override fun permissionGranted(permission: Array<String>) {
                val takePictureIntent = Intent("android.media.action.IMAGE_CAPTURE")
                if (ctx != null) {
                    val imageFileName = "KupayJPEG"
                    val storageDir = ctx!!.getExternalFilesDir(Environment.DIRECTORY_PICTURES)
                    var photoFile: File? = null
                    try {
                        photoFile = File.createTempFile(imageFileName, ".jpg", storageDir)
                    } catch (e: IOException) {
                        e.printStackTrace()
                    }

                    // Save a file: path for use with ACTION_VIEW intents
                    mCurrentPhotoPath = photoFile!!.absolutePath
                    // Continue only if the File was successfully created
                    if (photoFile != null) {
                        val photoURI = FileProvider.getUriForFile(
                            ctx!!,
                            "com.kuplay.kuplay.fileprovider",
                            photoFile
                        )
                        takePictureIntent.putExtra(MediaStore.EXTRA_OUTPUT, photoURI)

                        if (!ActivityCompat.shouldShowRequestPermissionRationale(
                                ctx!!,
                                Manifest.permission.CAMERA
                            )
                        ) {
                            ActivityCompat.requestPermissions(ctx!!, arrayOf(Manifest.permission.CAMERA), 0)
                        }
                        ctx!!.startActivityForResult(takePictureIntent, TAKE_PHOTO)
                    }
                }
            }

            override fun permissionDenied(permission: Array<String>) {
                callBack( BaseJSModule.FAIL, arrayOf("用户拒绝了权限!"))
            }
        }, arrayOf(Manifest.permission.WRITE_EXTERNAL_STORAGE, Manifest.permission.CAMERA), true, mTipInfo)


    }

    fun getContent(quality:Int,callBack:(callType: Int, prames: Array<Any>)->Unit){
        val bmp = FileUtil.file2Bitmap(mCurrentPhotoPath)
        val base64 = FileUtil.bitmapToBase64(bmp,quality)
        if (base64 != "") {
            callBack(BaseJSModule.SUCCESS, arrayOf(base64))
        }
    }


    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == TAKE_PHOTO) {
            this.callBack(BaseJSModule.SUCCESS, arrayOf(mCurrentPhotoPath))
        }
    }


    protected fun getTipContentWithoutPermission(): String {
        return ctx!!.getResources().getString(R.string.tip_please_allow_app_read_gallery_with_camera)
    }

}