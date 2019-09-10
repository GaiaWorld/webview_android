package com.kuplay.kuplay.module

import android.content.Context
import android.content.Intent
import com.kuplay.kuplay.gameView.ChargeActivity
import com.kuplay.kuplay.gameView.ChargeInGameActivity
import com.kuplay.kuplay.gameView.ShareActivity
import com.kuplay.pi_framework.base.JSExecutable

class piActivityManager(private val ctx: Context) : JSExecutable{

    fun goChareActivity(balance: Int){
        val intent = Intent(ctx, ChargeActivity::class.java)
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        intent.putExtra("balance",balance)
        ctx.startActivity(intent)
    }

    fun goChareInGameActivity(orderId: String, kupayId: String, balance: Int, seller: String, price: String, pay: Int){
        val intent = Intent(ctx, ChargeInGameActivity::class.java)
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        intent.putExtra("orderId",orderId)
        intent.putExtra("kupayId",kupayId)
        intent.putExtra("balance",balance)
        intent.putExtra("seller",seller)
        intent.putExtra("price",price)
        intent.putExtra("pay",pay)
        ctx.startActivity(intent)
    }

    fun goShare(imageName: String, userName: String, shareCode: String, shareUrl: String){
        val intent = Intent(ctx, ShareActivity::class.java)
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        intent.putExtra("nickname",userName)
        intent.putExtra("codeURL",shareUrl)
        intent.putExtra("code",shareCode)
        intent.putExtra("imageName",imageName)
        ctx.startActivity(intent)
    }

    fun goWXPay(app_id: String, partnerid: String, prepayid: String, packages: String, noncestr: String, timestamp: String, sign: String){
        //
    }

    fun goAliPay(payInfo: String){

    }

}