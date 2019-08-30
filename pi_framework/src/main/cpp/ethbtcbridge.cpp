//
// Created by yineng on 2019/8/30.
//

#include "ethbtcbridge.h"
#include "wrapper.h"
#include "util.h"


JNIEXPORT jint JNICALL Java_com_kuplay_pi_1framework_piv8_utils_PiEthBtcWrapper__1eth_from_mnemonic(JNIEnv *env, jobject, jstring mneonic, jstring language, jobjectArray oa){
    const char *mtr = env->GetStringUTFChars(mneonic, 0);
    const char *ltr = env->GetStringUTFChars(language, 0);
    char *add;
    char *p_key;
    char *m_seed;
    int result = eth_from_mnemonic(mtr,ltr, &add, &p_key, &m_seed);
    jstring jadd = util::charTojstring(env, add);
    jstring jp_key = util::charTojstring(env, p_key);
    jstring jm_seed = util::charTojstring(env, m_seed);
    dealloc_rust_cstring(add);
    dealloc_rust_cstring(p_key);
    dealloc_rust_cstring(m_seed);
    env->SetObjectArrayElement(oa,0,jadd);
    env->SetObjectArrayElement(oa,1,jp_key);
    env->SetObjectArrayElement(oa,2,jm_seed);
    env->ReleaseStringUTFChars(mneonic, mtr);
    env->ReleaseStringUTFChars(language, ltr);
    return result;
}

JNIEXPORT jint JNICALL Java_com_kuplay_pi_1framework_piv8_utils_PiEthBtcWrapper__1eth_generate(JNIEnv *env, jobject, jint strength, jstring language, jobjectArray oa){
    const char *ltr = env->GetStringUTFChars(language, 0);
    char *address;
    char *priv_key;
    char *master_seed;
    char *mnemonic;
    int result = eth_generate(strength, ltr, &address, &priv_key, &master_seed, &mnemonic);
    jstring jadd = util::charTojstring(env, address);
    jstring jp_key = util::charTojstring(env, priv_key);
    jstring jm_seed = util::charTojstring(env, master_seed);
    jstring jmn = util::charTojstring(env, mnemonic);
    dealloc_rust_cstring(address);
    dealloc_rust_cstring(priv_key);
    dealloc_rust_cstring(master_seed);
    dealloc_rust_cstring(mnemonic);
    env->SetObjectArrayElement(oa,0,jadd);
    env->SetObjectArrayElement(oa,1,jp_key);
    env->SetObjectArrayElement(oa,2,jm_seed);
    env->SetObjectArrayElement(oa,3,jmn);
    env->ReleaseStringUTFChars(language, ltr);
    return result;
}

JNIEXPORT jint JNICALL Java_com_kuplay_pi_1framework_piv8_utils_PiEthBtcWrapper__1eth_select_wallet(JNIEnv *env, jobject, jstring language, jstring master_seed, jint index, jobjectArray oa) {
    const char *ltr = env->GetStringUTFChars(language, 0);
    const char *m_seed = env->GetStringUTFChars(master_seed, 0);
    char *address;
    char *priv_key;
    int result = eth_select_wallet(ltr, m_seed, index, &address, &priv_key);
    jstring jadd = util::charTojstring(env, address);
    jstring jp_key = util::charTojstring(env, priv_key);
    dealloc_rust_cstring(address);
    dealloc_rust_cstring(priv_key);
    env->SetObjectArrayElement(oa, 0, jadd);
    env->SetObjectArrayElement(oa, 1, jp_key);
    env->ReleaseStringUTFChars(language, ltr);
    env->ReleaseStringUTFChars(master_seed, m_seed);
    return result;
}


JNIEXPORT jint JNICALL Java_com_kuplay_pi_1framework_piv8_utils_PiEthBtcWrapper__1eth_sign_raw_transaction(JNIEnv *env, jobject, jint chain_id, jstring nonce, jstring to, jstring value, jstring gas, jstring gas_price, jstring data, jstring priv_key, jobjectArray oa){
    const char *noncechar = env->GetStringUTFChars(nonce, 0);
    const char *tochar = env->GetStringUTFChars(to, 0);
    const char *valuechar = env->GetStringUTFChars(value, 0);
    const char *gaschar = env->GetStringUTFChars(gas, 0);
    const char *gas_pricechar = env->GetStringUTFChars(gas_price, 0);
    const char *datachar = env->GetStringUTFChars(data, 0);
    const char *priv_keychar = env->GetStringUTFChars(priv_key, 0);
    char *tx_hash;
    char *serialized;
    int result = eth_sign_raw_transaction(chain_id, noncechar, tochar, valuechar, gaschar, gas_pricechar, datachar, priv_keychar, &tx_hash, &serialized);
    jstring jtx = util::charTojstring(env, tx_hash);
    jstring jser = util::charTojstring(env, serialized);
    dealloc_rust_cstring(tx_hash);
    dealloc_rust_cstring(serialized);
    env->SetObjectArrayElement(oa, 0, jtx);
    env->SetObjectArrayElement(oa, 1, jser);
    env->ReleaseStringUTFChars(nonce, noncechar);
    env->ReleaseStringUTFChars(to, tochar);
    env->ReleaseStringUTFChars(value, valuechar);
    env->ReleaseStringUTFChars(gas, gaschar);
    env->ReleaseStringUTFChars(gas_price, gas_pricechar);
    env->ReleaseStringUTFChars(data, datachar);
    env->ReleaseStringUTFChars(priv_key, priv_keychar);
    return result;
}

JNIEXPORT jint JNICALL Java_com_kuplay_pi_1framework_piv8_utils_PiEthBtcWrapper__1get_public_key_by_mnemonic(JNIEnv *env, jobject, jstring mnemonic, jstring language, jobjectArray oa){
    const char *mnemonicstr = env->GetStringUTFChars(mnemonic, 0);
    const char *languagestr = env->GetStringUTFChars(language, 0);
    char *public_key;
    int result = get_public_key_by_mnemonic(mnemonicstr, languagestr, &public_key);
    jstring jp_key = util::charTojstring(env, public_key);
    dealloc_rust_cstring(public_key);
    env->SetObjectArrayElement(oa, 0, jp_key);
    env->ReleaseStringUTFChars(mnemonic, mnemonicstr);
    env->ReleaseStringUTFChars(language, languagestr);
    return result;
}


JNIEXPORT jstring JNICALL Java_com_kuplay_pi_1framework_piv8_utils_PiEthBtcWrapper__1token_balance_call_data(JNIEnv *env, jobject, jstring addr){
    const char *addrstr = env->GetStringUTFChars(addr, 0);
    char *result = token_balance_call_data(addrstr);
    jstring jr = util::charTojstring(env, result);
    dealloc_rust_cstring(result);
    env->ReleaseStringUTFChars(addr, addrstr);
    return jr;
}

JNIEXPORT jstring JNICALL Java_com_kuplay_pi_1framework_piv8_utils_PiEthBtcWrapper__1token_transfer_call_data(JNIEnv *env, jobject, jstring addr_to, jstring value){
    const char *addrstr = env->GetStringUTFChars(addr_to, 0);
    const char *valuestr = env->GetStringUTFChars(value, 0);
    char *result = token_transfer_call_data(addrstr, valuestr);
    jstring jr = util::charTojstring(env, result);
    dealloc_rust_cstring(result);
    env->ReleaseStringUTFChars(addr_to, addrstr);
    env->ReleaseStringUTFChars(value, valuestr);
    return jr;
}

JNIEXPORT jint JNICALL Java_com_kuplay_pi_1framework_piv8_utils_PiEthBtcWrapper__1btc_build_raw_transaction_from_single_address(JNIEnv *env, jobject, jstring address, jstring priv_key, jstring input, jstring output, jobjectArray oa){
    const char *addressstr = env->GetStringUTFChars(address, 0);
    const char *priv_keystr = env->GetStringUTFChars(priv_key, 0);
    const char *inputstr = env->GetStringUTFChars(input, 0);
    const char *outputstr = env->GetStringUTFChars(output, 0);
    char *raw_tx;
    char *tx_hash;
    int result = btc_build_raw_transaction_from_single_address(addressstr, priv_keystr, inputstr, outputstr, &raw_tx, &tx_hash);
    jstring jraw_tx = util::charTojstring(env, raw_tx);
    jstring jtx_hash = util::charTojstring(env, tx_hash);
    dealloc_rust_cstring(raw_tx);
    dealloc_rust_cstring(tx_hash);
    env->SetObjectArrayElement(oa, 0, jraw_tx);
    env->SetObjectArrayElement(oa, 1, jtx_hash);
    env->ReleaseStringUTFChars(address, addressstr);
    env->ReleaseStringUTFChars(priv_key, priv_keystr);
    env->ReleaseStringUTFChars(input, inputstr);
    env->ReleaseStringUTFChars(output, outputstr);
    return result;
}


JNIEXPORT jint JNICALL Java_com_kuplay_pi_1framework_piv8_utils_PiEthBtcWrapper__1btc_from_mnemonic(JNIEnv *env, jobject, jstring mnemonic, jstring network, jstring language, jstring pass_phrase, jobjectArray oa){
    const char *addressstr = env->GetStringUTFChars(mnemonic, 0);
    const char *priv_keystr = env->GetStringUTFChars(network, 0);
    const char *inputstr = env->GetStringUTFChars(language, 0);
    const char *outputstr = env->GetStringUTFChars(pass_phrase, 0);
    char *root_xpriv;
    char *root_seed;
    int result = btc_from_mnemonic(addressstr, priv_keystr, inputstr, outputstr, &root_xpriv, &root_seed);
    jstring jraw_tx = util::charTojstring(env, root_xpriv);
    jstring jtx_hash = util::charTojstring(env, root_seed);
    dealloc_rust_cstring(root_xpriv);
    dealloc_rust_cstring(root_seed);
    env->SetObjectArrayElement(oa, 0, jraw_tx);
    env->SetObjectArrayElement(oa, 1, jtx_hash);
    env->ReleaseStringUTFChars(mnemonic, addressstr);
    env->ReleaseStringUTFChars(network, priv_keystr);
    env->ReleaseStringUTFChars(language, inputstr);
    env->ReleaseStringUTFChars(pass_phrase, outputstr);
    return result;

}

JNIEXPORT jint JNICALL Java_com_kuplay_pi_1framework_piv8_utils_PiEthBtcWrapper__1btc_from_seed(JNIEnv *env, jobject, jstring seed, jstring network, jstring language, jobjectArray oa){

    const char *addressstr = env->GetStringUTFChars(seed, 0);
    const char *priv_keystr = env->GetStringUTFChars(network, 0);
    const char *inputstr = env->GetStringUTFChars(language, 0);
    char *root_xpriv;
    int result = btc_from_seed(addressstr, priv_keystr, inputstr, &root_xpriv);
    jstring jraw_tx = util::charTojstring(env, root_xpriv);
    dealloc_rust_cstring(root_xpriv);
    env->SetObjectArrayElement(oa, 0, jraw_tx);
    env->ReleaseStringUTFChars(seed, addressstr);
    env->ReleaseStringUTFChars(network, priv_keystr);
    env->ReleaseStringUTFChars(language, inputstr);
    return result;

}


JNIEXPORT jint JNICALL Java_com_kuplay_pi_1framework_piv8_utils_PiEthBtcWrapper__1btc_generate(JNIEnv *env, jobject, jint strength, jstring network, jstring language, jstring pass_phrase, jobjectArray oa){
    const char *priv_keystr = env->GetStringUTFChars(network, 0);
    const char *inputstr = env->GetStringUTFChars(language, 0);
    const char *outputstr = env->GetStringUTFChars(pass_phrase, 0);
    char *root_xpriv;
    char *mnemonic;
    int result = btc_generate(strength, priv_keystr, inputstr, outputstr, &root_xpriv, &mnemonic);
    jstring jraw_tx = util::charTojstring(env, root_xpriv);
    jstring jtx_hash = util::charTojstring(env, mnemonic);
    dealloc_rust_cstring(root_xpriv);
    dealloc_rust_cstring(mnemonic);
    env->SetObjectArrayElement(oa, 0, jraw_tx);
    env->SetObjectArrayElement(oa, 1, jtx_hash);
    env->ReleaseStringUTFChars(network, priv_keystr);
    env->ReleaseStringUTFChars(language, inputstr);
    env->ReleaseStringUTFChars(pass_phrase, outputstr);
    return result;

}


JNIEXPORT jint JNICALL Java_com_kuplay_pi_1framework_piv8_utils_PiEthBtcWrapper__1btc_private_key_of(JNIEnv *env, jobject, jint index, jstring root_xpriv, jobjectArray oa){
    const char *priv_keystr = env->GetStringUTFChars(root_xpriv, 0);
    char *priv_key;
    int result = btc_private_key_of(index, priv_keystr, &priv_key);
    jstring jraw_tx = util::charTojstring(env, priv_key);
    dealloc_rust_cstring(priv_key);
    env->SetObjectArrayElement(oa, 0, jraw_tx);
    env->ReleaseStringUTFChars(root_xpriv, priv_keystr);
    return result;
}


JNIEXPORT jint JNICALL Java_com_kuplay_pi_1framework_piv8_utils_PiEthBtcWrapper__1btc_to_address(JNIEnv *env, jobject, jstring network, jstring priv_key, jobjectArray oa){
    const char *networkstr = env->GetStringUTFChars(network, 0);
    const char *priv_keystr = env->GetStringUTFChars(priv_key, 0);
    char *address;
    int result = btc_to_address(networkstr, priv_keystr, &address);
    jstring jraw_tx = util::charTojstring(env, address);
    dealloc_rust_cstring(address);
    env->SetObjectArrayElement(oa, 0, jraw_tx);
    env->ReleaseStringUTFChars(network, networkstr);
    env->ReleaseStringUTFChars(priv_key, priv_keystr);
    return result;

}

JNIEXPORT jint JNICALL Java_com_kuplay_pi_1framework_piv8_utils_PiEthBtcWrapper__1btc_build_pay_to_pub_key_hash(JNIEnv *env, jobject, jstring address, jobjectArray oa){
    const char *networkstr = env->GetStringUTFChars(address, 0);
    char *script_pubkey;
    int result = btc_build_pay_to_pub_key_hash(networkstr, &script_pubkey);
    jstring jraw_tx = util::charTojstring(env, script_pubkey);
    dealloc_rust_cstring(script_pubkey);
    env->SetObjectArrayElement(oa, 0, jraw_tx);
    env->ReleaseStringUTFChars(address, networkstr);
    return result;
}


JNIEXPORT jint JNICALL Java_com_kuplay_pi_1framework_piv8_utils_PiEthBtcWrapper__1rust_decrypt(JNIEnv *env, jobject, jstring key, jstring nonce, jstring aad, jstring cipher_text, jobjectArray oa){
    const char *keystr = env->GetStringUTFChars(key, 0);
    const char *noncestr = env->GetStringUTFChars(nonce, 0);
    const char *cipher_textstr = env->GetStringUTFChars(cipher_text, 0);
    const char *aadstr = env->GetStringUTFChars(aad, 0);
    char *out_plain_text;
    int result = rust_decrypt(keystr, noncestr, aadstr, cipher_textstr, &out_plain_text);
    jstring jraw_tx = util::charTojstring(env, out_plain_text);
    dealloc_rust_cstring(out_plain_text);
    env->SetObjectArrayElement(oa, 0, jraw_tx);
    env->ReleaseStringUTFChars(key, keystr);
    env->ReleaseStringUTFChars(nonce, noncestr);
    env->ReleaseStringUTFChars(cipher_text, cipher_textstr);
    env->ReleaseStringUTFChars(aad, aadstr);
    return result;
}


JNIEXPORT jint JNICALL Java_com_kuplay_pi_1framework_piv8_utils_PiEthBtcWrapper__1rust_encrypt(JNIEnv *env, jobject, jstring key, jstring nonce, jstring aad, jstring plain_text, jobjectArray oa){

    const char *keystr = env->GetStringUTFChars(key, 0);
    const char *noncestr = env->GetStringUTFChars(nonce, 0);
    const char *plain_textstr = env->GetStringUTFChars(plain_text, 0);
    const char *aadstr = env->GetStringUTFChars(aad, 0);
    char *out_cipher_text;
    int result = rust_encrypt(keystr, noncestr, aadstr, plain_textstr, &out_cipher_text);
    jstring jraw_tx = util::charTojstring(env, out_cipher_text);
    dealloc_rust_cstring(out_cipher_text);
    env->SetObjectArrayElement(oa, 0, jraw_tx);
    env->ReleaseStringUTFChars(key, keystr);
    env->ReleaseStringUTFChars(nonce, noncestr);
    env->ReleaseStringUTFChars(plain_text, plain_textstr);
    env->ReleaseStringUTFChars(aad, aadstr);
    return result;
}


JNIEXPORT jint JNICALL Java_com_kuplay_pi_1framework_piv8_utils_PiEthBtcWrapper__1rust_sha256(JNIEnv *env, jobject, jstring data, jobjectArray oa){
    const char *datastr = env->GetStringUTFChars(data, 0);
    char *hash;
    int result = rust_sha256(datastr, &hash);
    jstring jraw_tx = util::charTojstring(env, hash);
    dealloc_rust_cstring(hash);
    env->SetObjectArrayElement(oa, 0, jraw_tx);
    env->ReleaseStringUTFChars(data, datastr);
    return result;
}

JNIEXPORT jint JNICALL Java_com_kuplay_pi_1framework_piv8_utils_PiEthBtcWrapper__1rust_sign(JNIEnv *env, jobject, jstring priv_key, jstring msg, jobjectArray oa){
    const char *datastr = env->GetStringUTFChars(priv_key, 0);
    const char *msgstr = env->GetStringUTFChars(msg, 0);
    char *signature;
    int result = rust_sign(datastr, msgstr, &signature);
    jstring jraw_tx = util::charTojstring(env, signature);
    dealloc_rust_cstring(signature);
    env->SetObjectArrayElement(oa, 0, jraw_tx);
    env->ReleaseStringUTFChars(priv_key, datastr);
    env->ReleaseStringUTFChars(msg, msgstr);
    return result;
}

