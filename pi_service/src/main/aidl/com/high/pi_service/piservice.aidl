// piservice.aidl
package com.high.pi_service;

import com.high.pi_service.piserviceCallBack;
// Declare any non-default types here with import statements

interface piservice {
    void sendMessage(String webViewName, String message);
    void onMessage(String webViewName, piserviceCallBack callBack);
    void unbindWebView(String webViewName);
}
