package com.high.ydzm.gameView;

import android.annotation.SuppressLint;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.support.v7.app.AppCompatActivity;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.view.animation.LinearInterpolator;
import android.widget.*;
import com.alipay.sdk.app.PayTask;
import com.high.pi_framework.Util.ToastManager;
import com.high.ydzm.R;
import com.high.ydzm.utils.PayResult;
//import com.high.pi_framework.piv8.piv8Service;
//import com.high.pi_framework.piv8.serviceRunCode;

import java.text.DecimalFormat;
import java.util.Map;

public class ChargeInGameActivity extends AppCompatActivity {

    //返回
    ImageView backBtn;
    //订单号
    TextView orderView;
    //好嗨id
    TextView kupayView;
    //余额
    TextView balanceView;
    //收款方
    TextView sellerView;
    //价格
    TextView priceView;
    //支付
    TextView payView;
    //支付方式微信
    TextView weixinPayText;
    RadioButton weixinPayBtn;
    //支付方式支付宝
    TextView aliPayText;
    RadioButton aliPayBtn;
    //支付按钮
    TextView payBtn;
    //是否使用微信支付
    boolean useWxPay = true;
    //订单号
    String orderId;
    //好嗨id
    String kupayId;
    //支付金额，单位RMB分
    int payAmount = 0;

    //网络请求等待动画
    RelativeLayout loadingLayout;
    ImageView circleView;
    TextView loadingTextView;
    Animation circleAnimation;

    private static final int SDK_PAY_FLAG = 1;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        registerBc();
        initBars();
        setContentView(R.layout.activity_charge_in_game);
        initViews();

        //赋值
        Bundle bundle = getIntent().getExtras();
        orderId = bundle.getString("orderId");
        orderView.setText(orderId);
        kupayId = bundle.getString("kupayId");
        kupayView.setText(kupayId);
        balanceView.setText(bundle.getString("balance"));
        sellerView.setText(bundle.getString("seller"));
        priceView.setText(bundle.getString("price"));
        payAmount = bundle.getInt("pay");
        DecimalFormat df = new DecimalFormat("#.00");
        payView.setText(df.format(payAmount * 1.0 / 100) + "元");

        //onclick
        backBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent("inpay_action");
                intent.putExtra("code",-1);
                intent.putExtra("orderId",orderId);
                intent.putExtra("pay_way","");
                finish();
            }
        });
        weixinPayBtn.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                if (isChecked) {
                    useWxPay = true;
                }
            }
        });
        aliPayBtn.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                if (isChecked) {
                    useWxPay = false;
                }
            }
        });
        weixinPayText.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (aliPayBtn.isChecked()) {
                    weixinPayBtn.setChecked(true);
                    aliPayBtn.setChecked(false);
                    useWxPay = true;
                }
            }
        });
        aliPayText.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (weixinPayBtn.isChecked()) {
                    aliPayBtn.setChecked(true);
                    weixinPayBtn.setChecked(false);
                    useWxPay = false;
                }
            }
        });
        payBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                //拉起支付插件
                doPay();
            }
        });
    }


    private void initBars() {
        //隐藏actionbar
        getSupportActionBar().hide();
    }

    private void initViews() {
        backBtn = findViewById(R.id.charge_back_btn);
        orderView = findViewById(R.id.charge_order_id);
        kupayView = findViewById(R.id.charge_kupay_id);
        balanceView = findViewById(R.id.charge_balance);
        sellerView = findViewById(R.id.charge_seller);
        priceView = findViewById(R.id.charge_price);
        payView = findViewById(R.id.charge_pay);
        weixinPayBtn = findViewById(R.id.charge_wxpay_checked);
        aliPayBtn = findViewById(R.id.charge_alipay_checked);
        payBtn = findViewById(R.id.charge_pay_btn);
        weixinPayText = findViewById(R.id.charge_wxpay_text);
        aliPayText = findViewById(R.id.charge_alipay_text);
        loadingLayout = findViewById(R.id.charge_loading_layout);
        loadingTextView = findViewById(R.id.charge_loading_text);
        circleView = findViewById(R.id.charge_loading_image);
        circleAnimation = AnimationUtils.loadAnimation(this, R.anim.anim_circle_loading);
        LinearInterpolator interpolator = new LinearInterpolator();
        circleAnimation.setInterpolator(interpolator);
    }


    @Override
    protected void onDestroy() {
        unregisterReceiver(mReceiver);
        super.onDestroy();
    }

    private void registerBc() {
        IntentFilter intentFilter = new IntentFilter();
        intentFilter.addAction("wx_pay_action");
        intentFilter.addAction("start_ali_pay_action");
        registerReceiver(mReceiver, intentFilter);
    }

    //广播
    private BroadcastReceiver mReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            String action = intent.getAction();
            if (action != null && action.equals("wx_pay_action")){
                int ruselt = intent.getIntExtra("ruselt",0);
                circleView.clearAnimation();
                loadingLayout.setVisibility(View.GONE);
                if (ruselt == 0){
                    ToastManager.Companion.toast(ChargeInGameActivity.this, "充值成功！");
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            finish();
                        }
                    });
                }else{
                    ToastManager.Companion.toast(ChargeInGameActivity.this, "充值失败！");
                }
            }else if(action != null && action.equals("start_ali_pay_action")){
                final String payInfo = intent.getStringExtra("payInfo");
                final Runnable payRunnable = new Runnable() {

                    @Override
                    public void run() {
                        PayTask alipay = new PayTask(ChargeInGameActivity.this);
                        Map<String, String> result = alipay.payV2(payInfo, true);
                        Log.i("msp", result.toString());
                        Message msg = new Message();
                        msg.what = SDK_PAY_FLAG;
                        msg.obj = result;
                        mHandler.sendMessage(msg);
                    }
                };

                // 必须异步调用
                Thread payThread = new Thread(payRunnable);
                payThread.start();

            }
        }
    };


    @SuppressLint("HandlerLeak")
    private Handler mHandler = new Handler() {
        @SuppressWarnings("unused")
        public void handleMessage(Message msg) {
            switch (msg.what) {
                case SDK_PAY_FLAG: {
                    @SuppressWarnings("unchecked")
                    PayResult payResult = new PayResult((Map<String, String>) msg.obj);
                    /**
                     * 对于支付结果，请商户依赖服务端的异步通知结果。同步通知结果，仅作为支付结束的通知。
                     */
                    String resultInfo = payResult.getResult();// 同步返回需要验证的信息
                    String resultStatus = payResult.getResultStatus();
                    // 判断resultStatus 为9000则代表支付成功
                    circleView.clearAnimation();
                    loadingLayout.setVisibility(View.GONE);
                    if (TextUtils.equals(resultStatus, "9000")) {
                        // 该笔订单是否真实支付成功，需要依赖服务端的异步通知。
                        Intent intent = new Intent("ali_pay_action");
                        intent.putExtra("code",0);
                        sendBroadcast(intent);
                        runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                finish();
                            }
                        });
                    } else {
                        // 该笔订单真实的支付结果，需要依赖服务端的异步通知。
                        Intent intent = new Intent("ali_pay_action");
                        intent.putExtra("code",-1);
                        sendBroadcast(intent);
                    }
                    break;
                }
                default:
                    break;
            }
        };
    };


    /**
     * 拉起支付插件
     */
    private void doPay() {
        //开始转菊花
        circleView.startAnimation(circleAnimation);
        loadingLayout.setVisibility(View.VISIBLE);
        Intent intent = new Intent("inpay_action");
        intent.putExtra("code",0);
        String pay_way = "alipay";
        if (useWxPay){
            pay_way = "wxpay";
        }
        intent.putExtra("pay_way",pay_way);
        intent.putExtra("orderId",orderId);
        sendBroadcast(intent);
    }


}
