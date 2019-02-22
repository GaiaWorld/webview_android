package com.kuplay.kuplay.module

import android.Manifest
import android.content.ComponentName
import android.content.Intent
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.os.Environment
import android.util.Log
import cn.sharesdk.framework.Platform
import cn.sharesdk.framework.PlatformActionListener
import cn.sharesdk.line.Line
import cn.sharesdk.onekeyshare.OnekeyShare
import cn.sharesdk.tencent.qq.QQ
import cn.sharesdk.tencent.qzone.QZone
import cn.sharesdk.wechat.friends.Wechat
import cn.sharesdk.wechat.moments.WechatMoments
import com.github.dfqin.grantor.PermissionListener
import com.github.dfqin.grantor.PermissionsUtil
import com.iqos.qrscanner.utils.QRCodeUtils
import com.kuplay.kuplay.R
import com.kuplay.pi_framework.Util.FileUtil
import com.kuplay.pi_framework.base.BaseJSModule
import com.kuplay.pi_framework.webview.YNWebView
import java.io.File
import java.util.HashMap

class ShareToPlatforms(ynWebView: YNWebView) : BaseJSModule(ynWebView) {
    private var platform: Int = 0

    /**
     * 本地的二维码图片(要分享的图片必须在SDCard目录下！)
     *
     * @return 本地图片的路径
     */
    private val fileDirPath: String
        get() = Environment.getExternalStorageDirectory().toString() + File.separator + "share_img.png"

    /**
     * 把App的图片存到本地的路径
     *
     * @return 本地的路径
     */
    private val appIconFile: String
        get() = Environment.getExternalStorageDirectory().toString() + File.separator + "ic_launcher.png"

    /**
     * ShareQRCode
     *
     * @param callbackId js callback's id.
     * @param content    The qrCode's content,create a qrCode by the content.
     * @param type       the startShareText type,it could be "image","text","url"...and so on.
     * @param platform   which platform would you like to startShareText.
     */
    fun shareContent( content: String, type: Int, platform: Int, callBack:(callType: Int, prames: Array<Any>)->Unit) {
        this.callBack = callBack
        this.platform = platform
        when (type) {
            //分享类型：图片
            TYPE_IMAGE -> this.shareQRCodeContent(content)
            //分享类型：文本
            TYPE_TEXT -> this.shareTextContent(content)
            //分享类型：截图
            TYPE_SCREEN -> this.shareImageContent(getPlatformName(platform))
        }

    }

    /**
     * 分享链接
     *
     * @param callbackId JS回调标识
     * @param webName    网站名称
     * @param url        链接URL
     * @param title      分享出去的内容所显示的标题
     * @param content    分享出去的内容所显示的内容
     * @param comment    分享出去的内容所显示的评论(只有QQ空间需要这个)
     * @param platform   要分享到的平台
     */
    fun shareLink( webName: String, url: String, title: String, content: String, comment: String, platform: Int, callBack:(callType: Int, prames: Array<Any>)->Unit) {
        PermissionsUtil.requestPermission(ctx, object : PermissionListener {
            override fun permissionGranted(permission: Array<String>) {
                val bitmap = BitmapFactory.decodeResource(ctx!!.resources, R.mipmap.ic_launcher, BitmapFactory.Options())
                val bmp = FileUtil.changeColor(bitmap)
                FileUtil.saveBitmapFile(bmp, appIconFile) {
                    val oks = OnekeyShare()
                    //关闭sso授权
                    oks.disableSSOWhenAuthorize()
                    // 分享时Notification的图标和文字  2.5.9以后的版本不调用此方法
                    //oks.setNotification(R.drawable.ic_launcher, getString(R.string.app_name));
                    oks.setTitle(title)// title标题，印象笔记、邮箱、信息、微信、人人网和QQ空间使用
                    oks.setTitleUrl(url)// titleUrl是标题的网络链接，仅在人人网和QQ空间使用
                    oks.setImagePath(appIconFile)//确保SDcard下面存在此张图片
                    oks.text = content // text是分享文本，所有平台都需要这个字段
                    oks.setUrl(url)// url仅在微信（包括好友和朋友圈）中使用
                    oks.setComment(comment)// comment是我对这条分享的评论，仅在人人网和QQ空间使用
                    oks.setSite(webName)// site是分享此内容的网站名称，仅在QQ空间使用
                    oks.setSiteUrl(url)// siteUrl是分享此内容的网站地址，仅在QQ空间使用
                    if (null != getPlatformName(platform))
                        oks.setPlatform(getPlatformName(platform))
                    oks.callback = object : PlatformActionListener {
                        override fun onComplete(platform: Platform, i: Int, hashMap: HashMap<String, Any>) {
                            Log.d(TAG, "分享完成")
                            FileUtil.removeFile(appIconFile)
                            callBack(BaseJSModule.SUCCESS, arrayOf(""))
                        }

                        override fun onError(platform: Platform, i: Int, throwable: Throwable) {
                            Log.d(TAG, "分享出错")
                            FileUtil.removeFile(appIconFile)
                            callBack(BaseJSModule.FAIL, arrayOf(""))
                        }

                        override fun onCancel(platform: Platform, i: Int) {
                            Log.d(TAG, "分享取消")
                            callBack(BaseJSModule.FAIL, arrayOf(""))
                            FileUtil.removeFile(appIconFile)
                        }
                    }
                    oks.show(ctx!!)// 启动分享GUI
                }
            }

            override fun permissionDenied(permission: Array<String>) {}
        }, Manifest.permission.WRITE_EXTERNAL_STORAGE)
    }


    /**
     * 分享二维码
     *
     * @param content 二维码的内容
     */
    private fun shareQRCodeContent(content: String) {
        when (platform) {
            //分享到平台->微信
            PLATFORM_WE_CHAT -> this.startShareQRCode(content, Wechat.NAME)
            //分享到平台->朋友圈
            PLATFORM_MOMENTS -> this.startShareQRCode(content, WechatMoments.NAME)
            //分享到平台->QQ空间
            PLATFORM_Q_ZONE -> this.startShareQRCode(content, QZone.NAME)
            //分享到平台->QQ
            PLATFORM_QQ -> this.startShareQRCode(content, QQ.NAME)
            //分享到平台->LINE
            PLATFORM_LINE -> this.startShareQRCode(content, Line.NAME)
            //分享到平台->所有平台
            PLATFORM_ALL -> this.startShareQRCode(content, null)
        }
    }

    /**
     * 分享文本内容
     *
     * @param content 文本的内容
     */
    private fun shareTextContent(content: String) {
        when (platform) {
            //分享到平台->微信
            PLATFORM_WE_CHAT -> this.startShareText(content, Wechat.NAME)
            //分享到平台->朋友圈
            PLATFORM_MOMENTS -> this.startShareText(content, WechatMoments.NAME)
            //分享到平台->QQ空间
            PLATFORM_Q_ZONE -> this.startShareText(content, QZone.NAME)
            //分享到平台->QQ
            PLATFORM_QQ -> this.shareToQQ(content)
            //分享到平台->LINE
            PLATFORM_LINE -> this.startShareText(content, Line.NAME)
            PLATFORM_ALL -> this.startShareText(content, null)
        }
    }

    /**
     * 由于QQ是不支持分享纯文本的
     * 此处只能通过发送文本的形式来实现、貌似这里是拿不到回调的
     *
     * @param content 要发送的内容
     */
    private fun shareToQQ(content: String) {
        try {
            val intent = Intent("android.intent.action.SEND")
            intent.type = "text/plain"
            intent.putExtra(Intent.EXTRA_SUBJECT, "分享")
            intent.putExtra(Intent.EXTRA_TEXT, content)
            intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
            intent.component = ComponentName("com.tencent.mobileqq", "com.tencent.mobileqq.activity.JumpActivity")
            ctx!!.startActivity(intent)
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    /**
     * 开始执行分享操作
     *
     * @param content  要分享的文本内容
     * @param platform 要分享到的平台
     */
    private fun startShareText(content: String, platform: String?) {
        val oks = OnekeyShare()
        oks.disableSSOWhenAuthorize()
        oks.text = content
        if (null != platform)
            oks.setPlatform(platform)
        oks.callback = object : PlatformActionListener {
            override fun onComplete(platform: Platform, i: Int, hashMap: HashMap<String, Any>) {
                Log.d(TAG, "分享完成")
                callBack(BaseJSModule.SUCCESS, arrayOf(""))
                //JSCallback.callJS(null, null, getCallbackId(), JSCallback.getSUCCESS(), "")
            }

            override fun onError(platform: Platform, i: Int, throwable: Throwable) {
                Log.d(TAG, "分享出错")
                callBack(BaseJSModule.FAIL, arrayOf(""))
                //JSCallback.callJS(null, null, getCallbackId(), JSCallback.getFAIL(), "")
            }

            override fun onCancel(platform: Platform, i: Int) {
                Log.d(TAG, "分享取消")
                callBack(BaseJSModule.FAIL, arrayOf(""))
                //JSCallback.callJS(null, null, getCallbackId(), JSCallback.getFAIL(), "")
            }
        }
        oks.show(ctx!!)
    }

    fun getScreenShot(callBack:(callType: Int, prames: Array<Any>)->Unit) {
        PermissionsUtil.requestPermission(ctx, object : PermissionListener {
            override fun permissionGranted(permission: Array<String>) {
                try {
                    yn.snapShotInWebView {
                        FileUtil.saveBitmapFile(it, fileDirPath) { callBack(BaseJSModule.SUCCESS, arrayOf("")) }
                    }
                } catch (e: Exception) {
                    Log.d("创建文件失败", e.message)
                    callBack(BaseJSModule.FAIL, arrayOf(""))
                }

            }
            override fun permissionDenied(permission: Array<String>) {

            }
        }, Manifest.permission.WRITE_EXTERNAL_STORAGE)
    }

    fun shareScreen(platform: Int, callBack:(callType: Int, prames: Array<Any>)->Unit) {
        this.callBack = callBack
        this.shareImageContent(getPlatformName(platform))
    }

    /**
     * 开始执行分享操作
     *
     * @param content  要分享的二维码内容
     * @param platform 要分享到的平台
     */
    private fun startShareQRCode(content: String, platform: String?) {
        PermissionsUtil.requestPermission(ctx, object : PermissionListener {
            override fun permissionGranted(permission: Array<String>) {
                val bitmap = QRCodeUtils.createCode(ctx, content) ?: return
                FileUtil.saveBitmapFile(bitmap, fileDirPath) { shareImageContent(platform) }
            }

            override fun permissionDenied(permission: Array<String>) {

            }
        }, Manifest.permission.WRITE_EXTERNAL_STORAGE, Manifest.permission.READ_EXTERNAL_STORAGE)

    }

    private fun shareImageContent(platform: String?) {
        val oks = OnekeyShare()
        oks.disableSSOWhenAuthorize()
        oks.setImagePath(fileDirPath)
        if (null != platform)
            oks.setPlatform(platform)
        oks.callback = object : PlatformActionListener {
            override fun onComplete(platform: Platform, i: Int, hashMap: HashMap<String, Any>) {
                Log.d(TAG, "分享完成")
                FileUtil.removeFile(fileDirPath)
                callBack(BaseJSModule.SUCCESS, arrayOf(""))
                //JSCallback.callJS(null, null, getCallbackId(), JSCallback.getSUCCESS(), "")
            }

            override fun onError(platform: Platform, i: Int, throwable: Throwable) {
                Log.d(TAG, "分享出错")
                FileUtil.removeFile(fileDirPath)
                callBack(BaseJSModule.FAIL, arrayOf(""))
                //JSCallback.callJS(null, null, getCallbackId(), JSCallback.getFAIL(), "")
            }

            override fun onCancel(platform: Platform, i: Int) {
                Log.d(TAG, "分享取消")
                FileUtil.removeFile(fileDirPath)
                callBack(BaseJSModule.FAIL, arrayOf(""))
                //JSCallback.callJS(null, null, getCallbackId(), JSCallback.getFAIL(), "")
            }
        }
        oks.show(ctx!!)
    }

    private fun getPlatformName(platform: Int): String? {
        when (platform) {
            //分享的平台->微信
            PLATFORM_WE_CHAT -> return Wechat.NAME
            //分享的平台->朋友圈
            PLATFORM_MOMENTS -> return WechatMoments.NAME
            //分享的平台->QQ空间
            PLATFORM_Q_ZONE -> return QZone.NAME
            //分享的平台->QQ
            PLATFORM_QQ -> return QQ.NAME
            else -> return null
        }
    }

    companion object {
        private val TAG = "ShareToPlatforms"
        private val TYPE_IMAGE = 1//分享的种类->图片
        private val TYPE_TEXT = 2//分享的种类->文本
        private val TYPE_SCREEN = 4//分享的种类->截图
        private val PLATFORM_ALL = -1//分享到的平台->所有平台(此时可以直接调用本地的分享UI)
        private val PLATFORM_WE_CHAT = 1//分享到的平台->微信
        private val PLATFORM_MOMENTS = 2//分享到的平台->朋友圈
        private val PLATFORM_Q_ZONE = 3//分享到的平台->QQ空间
        private val PLATFORM_QQ = 4//分享到的平台->QQ
        private val PLATFORM_LINE = 5//分享到的平台->LINE
    }
}
