package com.kuplay.pi_framework.Util

import android.util.Log

object Logger {
    private val DEBUG = true

    /**
     * Print the logcat
     *
     * @param tag TAG
     * @param msg the message what would you like logged.
     */
    fun verbose(tag: String, msg: String) {
        if (!DEBUG) return
        Log.v(tag, msg)
    }

    /**
     * Print the logcat
     *
     * @param tag TAG
     * @param msg the message what would you like logged.
     */
    fun debug(tag: String, msg: String) {
        if (!DEBUG) return
        Log.d(tag, msg)
    }

    /**
     * Print the logcat
     *
     * @param tag TAG
     * @param msg the message what would you like logged.
     */
    fun info(tag: String, msg: String) {
        if (!DEBUG) return
        Log.i(tag, msg)
    }

    /**
     * Print the logcat
     *
     * @param tag TAG
     * @param msg the message what would you like logged.
     */
    fun warn(tag: String, msg: String) {
        if (!DEBUG) return
        Log.w(tag, msg)
    }

    /**
     * Print the logcat
     *
     * @param tag TAG
     * @param msg the message what would you like logged.
     */
    fun error(tag: String, msg: String) {
        if (!DEBUG) return
        Log.e(tag, msg)
    }

    /**
     * Print the logcat
     *
     * @param tag TAG
     * @param msg the message what would you like logged.
     */
    fun wtf(tag: String, msg: String) {
        if (!DEBUG) return
        Log.wtf(tag, msg)
    }

}