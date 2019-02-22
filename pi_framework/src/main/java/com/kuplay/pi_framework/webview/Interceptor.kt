package com.kuplay.pi_framework.webview

import android.util.Log
import java.io.ByteArrayInputStream
import java.nio.charset.StandardCharsets
import okhttp3.OkHttpClient
import okhttp3.Request

class Interceptor {
    companion object {
        fun injectHtml(webView: Any, url: String, inject: String): Any? {
            try {
                Log.d("Intercept", "injectHtml Begin")

                val client = OkHttpClient()
                val request = Request.Builder().url(url).build()
                val call = client.newCall(request)

                var context = call.execute().body()!!.string()
                context = "<script>$inject</script>$context"
                val stream = ByteArrayInputStream(context.toByteArray(StandardCharsets.UTF_8))

                val mimeType = "text/html"
                var response: Any? = null
                if (webView is android.webkit.WebView) {
                    response = android.webkit.WebResourceResponse(mimeType, "UTF-8", stream)
                } else if (webView is com.tencent.smtt.sdk.WebView) {
                    response = com.tencent.smtt.export.external.interfaces.WebResourceResponse(mimeType, "UTF-8", stream)
                }
                return response
            } catch (e: Exception) {
                Log.d("Interceptor", "injectHtml crash")
                e.printStackTrace()
            }

            return null
        }
    }
}