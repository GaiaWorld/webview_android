//
// Created by yineng on 2019/8/30.
//



#include <jni.h>


extern "C" {

JNIEXPORT jint JNICALL Java_com_kuplay_pi_1framework_piv8_utils_PiEthBtcWrapper__1eth_from_mnemonic(JNIEnv *, jobject, jstring, jstring, jobjectArray);
JNIEXPORT jint JNICALL Java_com_kuplay_pi_1framework_piv8_utils_PiEthBtcWrapper__1eth_generate(JNIEnv *, jobject, jint, jstring, jobjectArray);
JNIEXPORT jint JNICALL Java_com_kuplay_pi_1framework_piv8_utils_PiEthBtcWrapper__1eth_select_wallet(JNIEnv *, jobject, jstring, jstring, jint, jobjectArray);
JNIEXPORT jint JNICALL Java_com_kuplay_pi_1framework_piv8_utils_PiEthBtcWrapper__1eth_sign_raw_transaction(JNIEnv *, jobject, jint, jstring, jstring, jstring, jstring, jstring, jstring, jstring, jobjectArray);
JNIEXPORT jint JNICALL Java_com_kuplay_pi_1framework_piv8_utils_PiEthBtcWrapper__1get_public_key_by_mnemonic(JNIEnv *, jobject, jstring, jstring, jobjectArray);
JNIEXPORT jstring JNICALL Java_com_kuplay_pi_1framework_piv8_utils_PiEthBtcWrapper__1token_balance_call_data(JNIEnv *, jobject, jstring);
JNIEXPORT jstring JNICALL Java_com_kuplay_pi_1framework_piv8_utils_PiEthBtcWrapper__1token_transfer_call_data(JNIEnv *, jobject, jstring, jstring);
JNIEXPORT jint JNICALL Java_com_kuplay_pi_1framework_piv8_utils_PiEthBtcWrapper__1btc_build_raw_transaction_from_single_address(JNIEnv *, jobject, jstring, jstring, jstring, jstring, jobjectArray);
JNIEXPORT jint JNICALL Java_com_kuplay_pi_1framework_piv8_utils_PiEthBtcWrapper__1btc_from_mnemonic(JNIEnv *, jobject, jstring, jstring, jstring, jstring, jobjectArray);
JNIEXPORT jint JNICALL Java_com_kuplay_pi_1framework_piv8_utils_PiEthBtcWrapper__1btc_from_seed(JNIEnv *, jobject, jstring, jstring, jstring, jobjectArray);
JNIEXPORT jint JNICALL Java_com_kuplay_pi_1framework_piv8_utils_PiEthBtcWrapper__1btc_generate(JNIEnv *, jobject, jint, jstring, jstring, jstring, jobjectArray);
JNIEXPORT jint JNICALL Java_com_kuplay_pi_1framework_piv8_utils_PiEthBtcWrapper__1btc_private_key_of(JNIEnv *, jobject, jint, jstring, jobjectArray);
JNIEXPORT jint JNICALL Java_com_kuplay_pi_1framework_piv8_utils_PiEthBtcWrapper__1btc_to_address(JNIEnv *, jobject, jstring, jstring, jobjectArray);
JNIEXPORT jint JNICALL Java_com_kuplay_pi_1framework_piv8_utils_PiEthBtcWrapper__1btc_build_pay_to_pub_key_hash(JNIEnv *, jobject, jstring, jobjectArray);
JNIEXPORT jint JNICALL Java_com_kuplay_pi_1framework_piv8_utils_PiEthBtcWrapper__1rust_decrypt(JNIEnv *, jobject, jstring, jstring, jstring, jstring, jobjectArray);
JNIEXPORT jint JNICALL Java_com_kuplay_pi_1framework_piv8_utils_PiEthBtcWrapper__1rust_encrypt(JNIEnv *, jobject, jstring, jstring, jstring, jstring, jobjectArray);
JNIEXPORT jint JNICALL Java_com_kuplay_pi_1framework_piv8_utils_PiEthBtcWrapper__1rust_sha256(JNIEnv *, jobject, jstring, jobjectArray);
JNIEXPORT jint JNICALL Java_com_kuplay_pi_1framework_piv8_utils_PiEthBtcWrapper__1rust_sign(JNIEnv *, jobject, jstring, jstring, jobjectArray);


}