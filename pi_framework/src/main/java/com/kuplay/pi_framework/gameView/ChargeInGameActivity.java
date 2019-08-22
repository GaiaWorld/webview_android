package com.kuplay.pi_framework.gameView;

import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.widget.CompoundButton;
import android.widget.ImageView;
import android.widget.RadioButton;
import android.widget.TextView;
import com.kuplay.pi_framework.R;
import com.kuplay.pi_framework.piv8.piv8Service;
import com.kuplay.pi_framework.piv8.serviceRunCode;

import java.text.DecimalFormat;

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

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
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
                Intent intent = new Intent(ChargeInGameActivity.this, piv8Service.class);
                Bundle bundle = new Bundle();
                bundle.putInt(serviceRunCode.key, serviceRunCode.sendMessage);
                bundle.putString(serviceRunCode.messageKey, serviceRunCode.chargeInGameMessage);
                bundle.putInt(serviceRunCode.statusCodeKey, serviceRunCode.statusFail);
                intent.putExtras(bundle);
                startService(intent);
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
    }

    //TODO  去支付

    /**
     * 拉起支付插件
     */
    private void doPay() {
        if (payAmount > 0) {
            // 会实际支付RMB
            // 可能用到参数：orderId,kupayId,payAmount
            if (useWxPay) {
                //使用微信支付
            } else {
                //使用支付宝
            }
        } else {
            //账上余额足够支付，不用拉起支付插件，通知后台扣费
        }
    }


}
