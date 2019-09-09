package com.kuplay.kuplay.module

import android.content.Context
import android.content.Intent
import android.os.Handler
import android.os.Looper
import com.kuplay.kuplay.gameView.ChargeActivity
import com.kuplay.pi_framework.base.JSExecutable

class piActivityManager(private val ctx: Context) : JSExecutable{

    fun goChareActivity(balance: Int){
        val intent = Intent(ctx, ChargeActivity::class.java)
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        intent.putExtra("balance",balance)
        ctx.startActivity(intent)
    }

    fun openChargeInGameActivity(){

    }

    fun openShareActivity(){

    }

}