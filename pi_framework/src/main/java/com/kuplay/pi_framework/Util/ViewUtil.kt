package com.kuplay.pi_framework.Util

import android.app.Activity
import android.content.Context

object ViewUtil {
    /**
     * 获取设备屏幕的宽度
     *
     * @param ctx 上下文
     * @return 屏幕的宽度
     */
    fun getScreenWidth(ctx: Activity): Float {
        val resources = ctx.resources
        val dm = resources.displayMetrics
        return dm.widthPixels.toFloat()
    }

    /**
     * 获取设备屏幕的高度
     *
     * @param ctx 上下文
     * @return 屏幕的高度
     */
    fun getScreenHeight(ctx: Activity): Float {
        val resources = ctx.resources
        val dm = resources.displayMetrics
        return dm.heightPixels.toFloat()
    }

    /**
     * 获取状态栏的高度
     *
     * @param ctx 上下文
     * @return 状态栏的高度
     */
    fun getStatusBarHeight(ctx: Context): Float {
        var statusBarHeight = -1
        //获取status_bar_height资源的ID
        val resourceId = ctx.resources.getIdentifier("status_bar_height", "dimen", "android")
        if (resourceId > 0) {
            //根据资源ID获取响应的尺寸值
            statusBarHeight = ctx.resources.getDimensionPixelSize(resourceId)
        }
        return statusBarHeight.toFloat()
    }

    /**
     * 根据手机的分辨率从 dp 的单位 转成为 px(像素)
     */
    fun dip2px(context: Context, dpValue: Float): Int {
        val scale = context.resources.displayMetrics.density
        return (dpValue * scale + 0.5f).toInt()
    }

    /**
     * 根据手机的分辨率从 px(像素) 的单位 转成为 dp
     */
    fun px2dip(context: Context, pxValue: Float): Int {
        val scale = context.resources.displayMetrics.density
        return (pxValue / scale + 0.5f).toInt()
    }

    //获取是否存在NavigationBar
    private fun checkDeviceHasNavigationBar(context: Context): Boolean {
        var hasNavigationBar = false
        val rs = context.resources
        val id = rs.getIdentifier("config_showNavigationBar", "bool", "android")
        if (id > 0) {
            hasNavigationBar = rs.getBoolean(id)
        }
        try {
            val systemPropertiesClass = Class.forName("android.os.SystemProperties")
            val m = systemPropertiesClass.getMethod("get", String::class.java)
            val navBarOverride = m.invoke(systemPropertiesClass, "qemu.hw.mainkeys") as String
            if ("1" == navBarOverride) {
                hasNavigationBar = false
            } else if ("0" == navBarOverride) {
                hasNavigationBar = true
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }

        return hasNavigationBar
    }

    /**
     * 获取NavigationBar高度
     *
     * @param context
     * @return
     */
    fun getNavigationBarHeight(context: Context): Int {
        val hasNavigationBar = checkDeviceHasNavigationBar(context)
        if (!hasNavigationBar) return 0
        val resources = context.resources
        val resourceId = resources.getIdentifier("navigation_bar_height", "dimen", "android")
        return resources.getDimensionPixelSize(resourceId)
    }
}