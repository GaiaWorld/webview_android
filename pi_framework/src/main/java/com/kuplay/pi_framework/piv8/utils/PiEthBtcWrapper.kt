package com.kuplay.pi_framework.piv8.utils

import com.kuplay.pi_framework.piv8.V8
import com.kuplay.pi_framework.piv8.V8Array

public class PiEthBtcWrapper(v8: V8){

    private val runtiem: V8 = v8
    /**
     * eth
     */
    fun eth_from_mnemonic(mneonic: String, language: String):V8Array{
        var rarray = arrayOf<String>("","","")
        val rusult = _eth_from_mnemonic(mneonic, language, rarray)
        var array = V8Array(runtiem)
        array.push(rusult)
        for ( str in rarray){
            array.push(str)
        }
        return array
    }

    fun eth_generate(generate: Int, language: String):V8Array{
        var rarray = arrayOf<String>("","","","")
        val rusult = _eth_generate(generate, language, rarray)
        var array = V8Array(runtiem)
        array.push(rusult)
        for ( str in rarray){
            array.push(str)
        }
        return array
    }

    fun eth_select_wallet(wallet: String, master_seed: String, index: Int):V8Array{
        var rarray = arrayOf<String>("","")
        val rusult = _eth_select_wallet(wallet, master_seed, index, rarray)
        var array = V8Array(runtiem)
        array.push(rusult)
        for ( str in rarray){
            array.push(str)
        }
        return array
    }

    fun eth_sign_raw_transaction(transaction: Int, nonce: String, to: String, value: String, gas: String, gas_price: String, data: String, priv_key: String):V8Array{
        var rarray = arrayOf<String>("","")
        val rusult = _eth_sign_raw_transaction(transaction, nonce, to, value, gas, gas_price, data, priv_key, rarray)
        var array = V8Array(runtiem)
        array.push(rusult)
        for ( str in rarray){
            array.push(str)
        }
        return array
    }

    fun get_public_key_by_mnemonic(mneonic: String, language: String):V8Array{
        var rarray = arrayOf<String>("")
        val rusult = _get_public_key_by_mnemonic(mneonic, language, rarray)
        var array = V8Array(runtiem)
        array.push(rusult)
        for ( str in rarray){
            array.push(str)
        }
        return array
    }

    fun token_balance_call_data(data: String):V8Array{
        val rusult = _token_balance_call_data(data)
        var array = V8Array(runtiem)
        array.push(rusult)
        return array
    }

    fun token_transfer_call_data(data: String, value: String):V8Array{
        val rusult = _token_transfer_call_data(data, value)
        var array = V8Array(runtiem)
        return array
    }

    /**
     * btc
     */
    fun btc_build_raw_transaction_from_single_address(address: String, priv_key: String, input: String, output: String):V8Array{
        var rarray = arrayOf<String>("","")
        val rusult = _btc_build_raw_transaction_from_single_address(address, priv_key, input, output, rarray)
        var array = V8Array(runtiem)
        array.push(rusult)
        for ( str in rarray){
            array.push(str)
        }
        return array
    }

    fun btc_from_mnemonic(mnemonic: String, network: String, language: String, pass_phrase: String):V8Array{
        var rarray = arrayOf<String>("","")
        val rusult = _btc_from_mnemonic(mnemonic, network, language, pass_phrase, rarray)
        var array = V8Array(runtiem)
        array.push(rusult)
        for ( str in rarray){
            array.push(str)
        }
        return array
    }

    fun btc_from_seed(seed: String, network: String, language: String):V8Array{
        var rarray = arrayOf<String>("")
        val rusult = _btc_from_seed(seed, network, language, rarray)
        var array = V8Array(runtiem)
        array.push(rusult)
        for ( str in rarray){
            array.push(str)
        }
        return array
    }

    fun btc_generate(generate: Int, network: String, language: String, pass_phrase: String):V8Array{
        var rarray = arrayOf<String>("","")
        val rusult = _btc_generate(generate, network, language, pass_phrase, rarray)
        var array = V8Array(runtiem)
        array.push(rusult)
        for ( str in rarray){
            array.push(str)
        }
        return array
    }

    fun btc_private_key_of(mkey: Int, root_xpriv: String):V8Array{
        var rarray = arrayOf<String>("")
        val rusult = _btc_private_key_of(mkey, root_xpriv, rarray)
        var array = V8Array(runtiem)
        array.push(rusult)
        for ( str in rarray){
            array.push(str)
        }
        return array
    }

    fun btc_to_address(address: String, priv_key: String):V8Array{
        var rarray = arrayOf<String>("")
        val rusult = _btc_to_address(address, priv_key, rarray)
        var array = V8Array(runtiem)
        array.push(rusult)
        for ( str in rarray){
            array.push(str)
        }
        return array
    }

    fun btc_build_pay_to_pub_key_hash(address: String):V8Array{
        var rarray = arrayOf<String>("")
        val rusult = _btc_build_pay_to_pub_key_hash(address, rarray)
        var array = V8Array(runtiem)
        array.push(rusult)
        for ( str in rarray){
            array.push(str)
        }
        return array
    }

    /**
     * cipher
     */
    fun rust_decrypt(key: String, nonce: String, aad: String, cipher_text: String):V8Array{
        var rarray = arrayOf<String>("")
        val rusult = _rust_decrypt(key, nonce, aad, cipher_text, rarray)
        var array = V8Array(runtiem)
        array.push(rusult)
        for ( str in rarray){
            array.push(str)
        }
        return array
    }

    fun rust_encrypt(key: String, nonce: String, aad: String, plain_text: String):V8Array{
        var rarray = arrayOf<String>("")
        val rusult = _rust_encrypt(key, nonce, aad, plain_text, rarray)
        var array = V8Array(runtiem)
        array.push(rusult)
        for ( str in rarray){
            array.push(str)
        }
        return array
    }

    fun rust_sha256(data: String):V8Array{
        var rarray = arrayOf<String>("")
        val rusult = _rust_sha256(data, rarray)
        var array = V8Array(runtiem)
        array.push(rusult)
        for ( str in rarray){
            array.push(str)
        }
        return array
    }

    fun rust_sign(priv_key: String, msg: String):V8Array{
        var rarray = arrayOf<String>("")
        val rusult = _rust_sign(priv_key, msg, rarray)
        var array = V8Array(runtiem)
        array.push(rusult)
        for ( str in rarray){
            array.push(str)
        }
        return array
    }


    external fun _eth_from_mnemonic(mneonic: String, language: String, oa: Array<String>):Int
    external fun _eth_generate(generate: Int, language: String, oa: Array<String>):Int
    external fun _eth_select_wallet(wallet: String, master_seed: String, index: Int, oa: Array<String>):Int
    external fun _eth_sign_raw_transaction(transaction: Int, nonce: String, to: String, value: String, gas: String, gas_price: String, data: String, priv_key: String, oa: Array<String>):Int
    external fun _get_public_key_by_mnemonic(mneonic: String, language: String, oa: Array<String>):Int
    external fun _token_balance_call_data(data: String):String
    external fun _token_transfer_call_data(data: String, value: String):String
    external fun _btc_build_raw_transaction_from_single_address(address: String, priv_key: String, input: String, output: String, oa: Array<String>):Int
    external fun _btc_from_mnemonic(mnemonic: String, network: String, language: String, pass_phrase: String, oa: Array<String>):Int
    external fun _btc_from_seed(seed: String, network: String, language: String, oa: Array<String>):Int
    external fun _btc_generate(generate: Int, network: String, language: String, pass_phrase: String, oa: Array<String>):Int
    external fun _btc_private_key_of(index: Int, root_xpriv: String, oa: Array<String>):Int
    external fun _btc_to_address(network: String, priv_key: String, oa: Array<String>):Int
    external fun _btc_build_pay_to_pub_key_hash(address: String, oa: Array<String>):Int
    external fun _rust_decrypt(key: String, nonce: String, aad: String, cipher_text: String, oa: Array<String>):Int
    external fun _rust_encrypt(key: String, nonce: String, aad: String, plain_text: String, oa: Array<String>):Int
    external fun _rust_sha256(data: String, oa: Array<String>):Int
    external fun _rust_sign(priv_key: String, msg: String, oa: Array<String>):Int

    companion object {

        // Used to load the 'native-lib' library on application startup.
        init {
            System.loadLibrary("native-lib")
        }
    }

}