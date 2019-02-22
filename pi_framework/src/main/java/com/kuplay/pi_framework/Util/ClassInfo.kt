package com.kuplay.pi_framework.Util

import java.lang.reflect.Method
import java.util.HashMap

class ClassInfo(val clazz: Class<*>) {
    var methods: HashMap<String, Method>? = null
        private set // 方法信息，键是方法名

    init {
        if (null == methods) {
            methods = HashMap()
        }
    }
}