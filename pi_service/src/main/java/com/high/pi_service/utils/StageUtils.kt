package com.high.pi_service.utils

 object StageUtils{

     private val vmMap = mutableListOf<String>()
     private val defaultMap = mutableListOf<String>()

     @Synchronized fun makeStages(stageMessage: String, mod: String):Boolean{
        if (mod.equals("JSVM")){
            if (defaultMap.contains(stageMessage)){
                defaultMap.remove(stageMessage)
                return true
            }else{
                vmMap.add(stageMessage)
                return false
            }
        }else if (mod.equals("default")){
            if (vmMap.contains(stageMessage)){
                vmMap.remove(stageMessage)
                return true
            }else{
                defaultMap.add(stageMessage)
                return false
            }
        }
         return true
     }

 }