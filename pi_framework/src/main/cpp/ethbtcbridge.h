//
// Created by yineng on 2019/8/30.
//



#include <jni.h>


extern "C" {
JNIEXPORT jint JNICALL Java_com_kuplay_pi_1framework_piv8_utils_PiEthBtcWrapper__1eth_1from_1mnemonic(JNIEnv *, jobject, jstring, jstring, jobjectArray);
JNIEXPORT jint JNICALL Java_com_kuplay_pi_1framework_piv8_utils_PiEthBtcWrapper__1eth_1generate(JNIEnv *, jobject, jint, jstring, jobjectArray);
JNIEXPORT jint JNICALL Java_com_kuplay_pi_1framework_piv8_utils_PiEthBtcWrapper__1eth_1select_1wallet(JNIEnv *, jobject, jstring, jstring, jint, jobjectArray);
JNIEXPORT jint JNICALL Java_com_kuplay_pi_1framework_piv8_utils_PiEthBtcWrapper__1eth_1sign_1raw_1transaction(JNIEnv *, jobject, jint, jstring, jstring, jstring, jstring, jstring, jstring, jstring, jobjectArray);
JNIEXPORT jint JNICALL Java_com_kuplay_pi_1framework_piv8_utils_PiEthBtcWrapper__1get_1public_1key_1by_1mnemonic(JNIEnv *, jobject, jstring, jstring, jobjectArray);
JNIEXPORT jstring JNICALL Java_com_kuplay_pi_1framework_piv8_utils_PiEthBtcWrapper__1token_1balance_1call_1data(JNIEnv *, jobject, jstring);
JNIEXPORT jstring JNICALL Java_com_kuplay_pi_1framework_piv8_utils_PiEthBtcWrapper__1token_1transfer_1call_1data(JNIEnv *, jobject, jstring, jstring);
JNIEXPORT jint JNICALL Java_com_kuplay_pi_1framework_piv8_utils_PiEthBtcWrapper__1btc_1build_1raw_1transaction_1from_1single_1address(JNIEnv *, jobject, jstring, jstring, jstring, jstring, jobjectArray);
JNIEXPORT jint JNICALL Java_com_kuplay_pi_1framework_piv8_utils_PiEthBtcWrapper__1btc_1from_1mnemonic(JNIEnv *, jobject, jstring, jstring, jstring, jstring, jobjectArray);
JNIEXPORT jint JNICALL Java_com_kuplay_pi_1framework_piv8_utils_PiEthBtcWrapper__1btc_1from_1seed(JNIEnv *, jobject, jstring, jstring, jstring, jobjectArray);
JNIEXPORT jint JNICALL Java_com_kuplay_pi_1framework_piv8_utils_PiEthBtcWrapper__1btc_1generate(JNIEnv *, jobject, jint, jstring, jstring, jstring, jobjectArray);
JNIEXPORT jint JNICALL Java_com_kuplay_pi_1framework_piv8_utils_PiEthBtcWrapper__1btc_1private_1key_1of(JNIEnv *, jobject, jint, jstring, jobjectArray);
JNIEXPORT jint JNICALL Java_com_kuplay_pi_1framework_piv8_utils_PiEthBtcWrapper__1btc_1to_1address(JNIEnv *, jobject, jstring, jstring, jobjectArray);
JNIEXPORT jint JNICALL Java_com_kuplay_pi_1framework_piv8_utils_PiEthBtcWrapper__1btc_1build_1pay_1to_1pub_1key_1hash(JNIEnv *, jobject, jstring, jobjectArray);
JNIEXPORT jint JNICALL Java_com_kuplay_pi_1framework_piv8_utils_PiEthBtcWrapper__1rust_1decrypt(JNIEnv *, jobject, jstring, jstring, jstring, jstring, jobjectArray);
JNIEXPORT jint JNICALL Java_com_kuplay_pi_1framework_piv8_utils_PiEthBtcWrapper__1rust_1encrypt(JNIEnv *, jobject, jstring, jstring, jstring, jstring, jobjectArray);
JNIEXPORT jint JNICALL Java_com_kuplay_pi_1framework_piv8_utils_PiEthBtcWrapper__1rust_1sha256(JNIEnv *, jobject, jstring, jobjectArray);
JNIEXPORT jint JNICALL Java_com_kuplay_pi_1framework_piv8_utils_PiEthBtcWrapper__1rust_1sign(JNIEnv *, jobject, jstring, jstring, jobjectArray);


}