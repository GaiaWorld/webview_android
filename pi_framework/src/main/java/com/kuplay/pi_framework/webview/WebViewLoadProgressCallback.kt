package com.kuplay.pi_framework.webview

public interface WebViewLoadProgressCallback {
    /**
     * The webView load content success.
     */
    abstract fun onLoadFinished()

    /**
     * Connect time out.
     */
    abstract fun onLoadTimeOut()
}