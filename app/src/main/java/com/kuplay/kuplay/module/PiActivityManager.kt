package com.kuplay.kuplay.module

import android.content.Context
import android.content.Intent
import com.kuplay.kuplay.gameView.ChargeActivity
import com.kuplay.pi_framework.base.JSExecutable

class piActivityManager : JSExecutable{

    fun openChargeActivity(ctx: Context, balance: String){
        val intent = Intent(ctx, ChargeActivity::class.java)
        intent.putExtra("balance",balance)
        ctx.startActivity(intent)
    }

    fun openChargeInGameActivity(){

    }

    fun openShareActivity(){

    }

}