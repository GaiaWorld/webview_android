package com.kuplay.pi_framework.module

import android.Manifest
import android.app.Activity
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.content.ServiceConnection
import android.net.Uri
import android.os.Build
import android.os.IBinder
import android.provider.Settings
import android.support.v4.content.FileProvider
import android.support.v7.app.AlertDialog
import android.util.Log
import com.github.dfqin.grantor.PermissionListener
import com.github.dfqin.grantor.PermissionsUtil
import com.kuplay.pi_framework.R
import com.kuplay.pi_framework.base.BaseJSModule
import com.kuplay.pi_framework.framework.CallJSRunnable
import com.kuplay.pi_framework.module.service.UpdateAppService
import com.kuplay.pi_framework.webview.YNWebView
import java.io.File

class AppUpdater(ynWebView: YNWebView,var listenerID: Int, var cbID: Int) : BaseJSModule(ynWebView) {
    private var mUpdateService: UpdateAppService? = null
    private var downloadUrl = ""
    private var apkURL = ""
    private val conn = object : ServiceConnection {
        override fun onServiceDisconnected(name: ComponentName?) {
        }

        override fun onServiceConnected(name: ComponentName?, service: IBinder?) {
            mUpdateService = (service as UpdateAppService.UpdateBinder).getService()
            mUpdateService?.startDownload(downloadUrl)
            mUpdateService?.addDownloadProgressListener { total, progress -> updateDownloadProgress(total, progress) }
            mUpdateService?.addDownloadFinishListener { filePath -> prepareInstall(filePath) }
        }
    }

    fun updateApp(url: String) {
        PermissionsUtil.requestPermission(ctx, object : PermissionListener {
            override fun permissionDenied(permission: Array<out String>) {}
            override fun permissionGranted(permission: Array<out String>) {
                this@AppUpdater.downloadUrl = url
                val updateIntent = Intent(ctx, UpdateAppService::class.java)
                ctx!!.bindService(updateIntent, conn, Context.BIND_AUTO_CREATE)
            }
        }, Manifest.permission.WRITE_EXTERNAL_STORAGE, Manifest.permission.READ_EXTERNAL_STORAGE)
    }

    private fun updateDownloadProgress(total: Int, progress: Int) {
        val func = String.format("window.handle_jsintercept_update(%d, %d, %d)", cbID, total, progress)
        ctx!!.runOnUiThread(CallJSRunnable(func, yn))
        Log.d("TAG", "总进度$total 当前下载进度$progress")
    }

    /**
     * 下载成功之后准备安装
     * 7.0需要 FileProvider
     * 8.0需要 授予“安装未知来源”
     */
    private fun prepareInstall(filePath: String) {
        val func = String.format("window.handle_jsintercept_callback(%d, true)", listenerID)
        ctx!!.runOnUiThread(CallJSRunnable(func, yn))
        apkURL = filePath
        Log.d("TAG", "下载成功\t文件路径为：$filePath")
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            if (ctx!!.packageManager.canRequestPackageInstalls()) {
                this.installApk(filePath)
            } else {
                val packageURI = Uri.parse("package:" + ctx!!.packageName)
                val intent = Intent(Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES, packageURI)
                ctx!!.startActivityForResult(intent, 10088)
            }
        } else {
            this.installApk(filePath)
        }
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        if (requestCode == 10088) {
            if (resultCode == Activity.RESULT_OK) {
                // 再次执行安装流程，包含权限判等
                this.prepareInstall(apkURL)
            } else {
                // 弹框，退出
                AlertDialog.Builder(ctx!!)
                    .setTitle(R.string.dialog_title_prompt)
                    .setMessage(R.string.tip_please_allow_app_install_unknown_res_apk)
                    .setPositiveButton(R.string.dialog_title_ok) { _, _ -> 0 }
                    .setCancelable(false)
                    .create()
                    .show();

                android.os.Process.killProcess(android.os.Process.myPid());
            }
        }
    }


    /**
     * 安装Apk
     */
    private fun installApk(filePath: String) {
        val install = Intent(Intent.ACTION_VIEW)
        install.flags = Intent.FLAG_ACTIVITY_NEW_TASK
        val apkFile = File(filePath)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            install.flags = Intent.FLAG_GRANT_READ_URI_PERMISSION
            val contentUri = FileProvider.getUriForFile(ctx!!, ctx!!.packageName + ".fileprovider", apkFile)
            install.setDataAndType(contentUri, "application/vnd.android.package-archive")
        } else {
            install.setDataAndType(Uri.fromFile(apkFile), "application/vnd.android.package-archive")
        }
        ctx!!.startActivity(install)
    }


}