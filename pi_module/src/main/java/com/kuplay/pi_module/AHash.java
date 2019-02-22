package com.kuplay.pi_module;

public class AHash {
    static {
        System.loadLibrary("pi-module-native-lib");
    }

    //private external fun lameMp3Init(inSampleRate: Int, outChannel: Int, outSampleRate: Int, outBitrate: Int, quality: Int)

    //public  static native  void lameMp3Init(int inSampleRate,int outChannel,int outSampleRate,int outBitrate,int quality);

    public static native String ahash(int[] pixels, int width, int height, int chanels);
}
