package com.high.high.wxapi;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import com.high.high.utils.WXContants;
import com.tencent.mm.opensdk.constants.ConstantsAPI;
import com.tencent.mm.opensdk.modelbase.BaseReq;
import com.tencent.mm.opensdk.modelbase.BaseResp;
import com.tencent.mm.opensdk.openapi.IWXAPI;
import com.tencent.mm.opensdk.openapi.IWXAPIEventHandler;
import com.tencent.mm.opensdk.openapi.WXAPIFactory;

public class WXPayEntryActivity extends Activity implements IWXAPIEventHandler {

    private static String TAG = "WXPayEntryActivity";
    private IWXAPI api;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        api = WXAPIFactory.createWXAPI(this, WXContants.APP_ID, false);
        try {
            Intent intent = getIntent();
            api.handleIntent(intent, this);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);

        setIntent(intent);
        api.handleIntent(intent, this);
    }

    //微信发送的消息回调
    @Override
    public void onReq(BaseReq baseReq) {
        finish();
    }

    //微信响应的消息回调
    @Override
    public void onResp(BaseResp baseResp) {
        if(baseResp.getType() == ConstantsAPI.COMMAND_PAY_BY_WX){
            Intent intent = new Intent("wx_pay_action");
            intent.putExtra("ruselt",baseResp.errCode);
            sendBroadcast(intent);
        }
        finish();
    }


}
