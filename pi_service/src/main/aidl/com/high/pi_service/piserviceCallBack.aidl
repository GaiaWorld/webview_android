// piserviceCallBack.aidl
package com.high.pi_service;

// Declare any non-default types here with import statements

interface piserviceCallBack {
    void sendMessage(int statuCode, String message);
}
