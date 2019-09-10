package com.kuplay.kuplay.wxapi;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import com.kuplay.pi_module.Util.WXLoinContants;
import com.tencent.mm.opensdk.constants.ConstantsAPI;
import com.tencent.mm.opensdk.modelbase.BaseReq;
import com.tencent.mm.opensdk.modelbase.BaseResp;
import com.tencent.mm.opensdk.modelmsg.SendAuth;
import com.tencent.mm.opensdk.openapi.IWXAPI;
import com.tencent.mm.opensdk.openapi.IWXAPIEventHandler;
import com.tencent.mm.opensdk.openapi.WXAPIFactory;

public class WXEntryActivity extends Activity implements IWXAPIEventHandler {

    private static String TAG = "WXEntryActivity";
    private IWXAPI api;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        api = WXAPIFactory.createWXAPI(this, WXLoinContants.INSTANCE.getApp_id(), false);
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
        if (baseResp.getType() == ConstantsAPI.COMMAND_SENDAUTH) {
            SendAuth.Resp authResp = (SendAuth.Resp)baseResp;
            final String code = authResp.code;
            final String state = authResp.state;
            Intent intent = new Intent("wx_code_get");
            intent.putExtra("ruselt",baseResp.errCode);
            intent.putExtra("code",code);
            intent.putExtra("state",state);
            sendBroadcast(intent);
        }

        finish();
    }
}