package com.kuplay.pi_framework.base

import com.kuplay.pi_framework.Util.ToastManager

interface BaseView {
    /**
     * Show the toast tip.
     *
     * @param resId the message's id of what would you like to tip.
     */
    fun onToast(resId: Int)

    /**
     * Show the toast tip
     *
     * @param msg the message of what would you like to tip.
     */
    fun onToast(msg: String)

    /**
     * Show the toast tip
     *
     * @param msg      the message's id of what would you like to tip.
     * @param duration the message last time.
     */
    fun onToast(msg: Int, @ToastManager.Duration duration: Int)

    /**
     * Show the toast tip
     *
     * @param msg      the message of what would you like to tip
     * @param duration the message last time.
     */
    fun onToast(msg: String, @ToastManager.Duration duration: Int)

    /**
     * Hide the content being prompted.
     */
    fun onHideToast()
}