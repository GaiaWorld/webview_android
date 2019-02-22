package com.kuplay.pi_framework.Util

import com.kuplay.pi_framework.webview.YNWebView
import dalvik.system.BaseDexClassLoader
import dalvik.system.DexFile
import java.lang.reflect.Array
import java.lang.reflect.Field
import java.util.ArrayList
import android.content.Intent
import android.content.pm.PackageManager
import android.util.Log
import dalvik.system.PathClassLoader
import dalvik.system.DexClassLoader
import java.io.File


object CodeUtil {
    /**
     * Get all classes which implements the interface.
     *
     * @param clazz the interface
     * @return All classes.
     */
    fun getAllClassByInterface(clazz: Class<*>): List<Class<*>> {
        val result = ArrayList<Class<*>>()
        try {
            //获得当前包以及子包下的所有类(android中用)
            val allClass = getClasses(clazz)
            for (cls in allClass) {
                if (clazz.isAssignableFrom(cls)) {
                    //if the class implements clazz,there will add the class into the list,
                    //at last,we can get the list with all sub class which implements clazz.
                    if (clazz != cls) {
                        result.add(cls)
                    }
                }
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }

        return result
    }

    /**
     * Get all classes from the package name's path.
     *
     * @param clazz class.
     * @return All classes that is found in path you assign.
     * @throws ClassNotFoundException An ClassNotFoundException has occurred,
     * such as a file that does not exist
     * or doesn't have permission to access it.
     */
    @Throws(ClassNotFoundException::class)
    private fun getClasses(clazz: Class<*>): List<Class<*>> {
        val classes = ArrayList<Class<*>>()
        val dexFiles = ArrayList<DexFile>()
        try {
            val classLoader = Thread.currentThread().contextClassLoader as BaseDexClassLoader
            val pathListField = classLoader.javaClass.superclass.getDeclaredField("pathList")
            pathListField.isAccessible = true
            val pathList = pathListField.get(classLoader)
            val dexElementsField = pathList.javaClass.getDeclaredField("dexElements")
            dexElementsField.isAccessible = true
            val dexElements = dexElementsField.get(pathList)
            val dexLength = Array.getLength(dexElements)
            var dexFileField: Field? = null
            for (i in 0 until dexLength) {
                val dexElement = Array.get(dexElements, i)
                if (null == dexFileField) {
                    dexFileField = dexElement.javaClass.getDeclaredField("dexFile")
                    dexFileField!!.isAccessible = true
                }
                val dexFile = dexFileField.get(dexElement) as DexFile
                if (null != dexFile) {
                    dexFiles.add(dexFile)
                }
            }

            val appName = YNWebView.sAppCtx.getPackageName()
            val pf = "com.kuplay.pi_framework"
            val pm = "com.kuplay.pi_module"
            for (file in dexFiles) {
                val entries = file.entries()
                while (entries.hasMoreElements()) {
                    val s1 = entries.nextElement()
                    if (s1.contains(appName) || s1.contains(pf) || s1.contains(pm)) {
                        if (clazz.isAssignableFrom(Class.forName(s1))) {
                            classes.add(Class.forName(s1))
                        }
                    }
                }
            }



        } catch (e: NoSuchFieldException) {
            e.printStackTrace()
        } catch (e: IllegalAccessException) {
            e.printStackTrace()
        }

        return classes
    }


}