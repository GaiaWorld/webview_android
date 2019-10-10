package com.high.ydzm.gameView;

import android.annotation.SuppressLint;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Bundle;
import android.os.Handler;
import android.os.IBinder;
import android.os.Message;
import android.support.v7.app.AppCompatActivity;
import android.text.Editable;
import android.text.TextUtils;
import android.text.TextWatcher;
import android.util.Log;
import android.view.MotionEvent;
import android.view.View;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.view.animation.LinearInterpolator;
import android.view.inputmethod.InputMethodManager;
import android.widget.*;
import com.alipay.sdk.app.PayTask;
import com.high.ydzm.R;
import com.high.pi_framework.Util.ToastManager;
import com.high.ydzm.utils.PayResult;
//import com.high.pi_framework.piv8.piv8Service;
//import com.high.pi_framework.piv8.serviceRunCode;

import java.text.DecimalFormat;
import java.util.Map;

public class ChargeActivity extends AppCompatActivity {

    //返回
    ImageView backBtn;
    //余额
    TextView balanceView;
    //充值金额
    EditText customizeView;
    //充值结果
    TextView customizeResultView;
    //提示文字
    TextView tipsView;
    //支付方式微信
    TextView weixinPayText;
    RadioButton weixinPayBtn;
    //支付方式支付宝
    TextView aliPayText;
    RadioButton aliPayBtn;
    //支付按钮
    TextView payBtn;
    //网络请求等待动画
    RelativeLayout loadingLayout;
    ImageView circleView;
    TextView loadingTextView;

    //用于充值档次选中变色的数组
    LinearLayout[] gradeLayoutArray = new LinearLayout[6];
    TextView[] gradeTextTopArray = new TextView[6];
    TextView[] gradeTextBottomArray = new TextView[6];

    LinearLayout gradeLayout1, gradeLayout2, gradeLayout3, gradeLayout4, gradeLayout5, gradeLayout6;
    TextView grageTextTop1, grageTextTop2, grageTextTop3, grageTextTop4, grageTextTop5, grageTextTop6;
    TextView grageTextBottom1, grageTextBottom2, grageTextBottom3, grageTextBottom4, grageTextBottom5, grageTextBottom6;


    //是否使用微信支付
    boolean useWxPay = true;
    //支付金额，单位RMB分
    int payAmount = 0;
    Animation circleAnimation;

    private static final int SDK_PAY_FLAG = 1;



    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        initBars();
        setContentView(R.layout.activity_charge);
        initViews();
        registerBc();
        //赋值
        Bundle bundle = getIntent().getExtras();
        int balance = bundle.getInt("balance",0);
        float fb = (float) (balance/100.00);
        String balanceString = "0";
        if(fb > 0){
            DecimalFormat decimalFormat = new DecimalFormat("###,###.00");
            balanceString = decimalFormat.format(fb).toString();
        }
        balanceView.setText(balanceString);

        //onclick
        backBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent("outpay_action");
                intent.putExtra("code",-1);
                intent.putExtra("pay_way","");
                intent.putExtra("payAmount",0);
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
                //拉起支付
                prePay();
            }
        });

        //充值档次点击
        for (int i = 0; i < gradeLayoutArray.length; i++) {
            final int grade = i + 1;
            gradeLayoutArray[i].setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    chargeGradeClick(grade);
                }
            });
        }

        customizeView.setOnFocusChangeListener(new View.OnFocusChangeListener() {
            @Override
            public void onFocusChange(View v, boolean hasFocus) {
                if (hasFocus) {
                    //选中时清空数字
                    customizeView.setText("");
                    customizeResultView.setText("0.00银两");
                    tipsView.setText("充银两，送10倍嗨豆");
                    emptyGrade();
                } else {
                    //离开时，如果没有输入金额，改变相应文字
                    String s = customizeView.getText().toString();
                    if (s.equals("")) {
                        customizeView.setText("自定义充值金额");
                        customizeView.setTextColor(getResources().getColor(R.color.chargeTextLight));
                    }
                }
            }
        });
        customizeView.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {

            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {

            }

            @Override
            public void afterTextChanged(Editable s) {
                //输入价格变化时修改对应文字
                int num = 0;
                try {
                    num = Integer.parseInt(s.toString());
                } catch (NumberFormatException e) {
                }
                if (num > 0) {
                    if (num > 99999) {
                        //单词最大允许充值99999
                        num = 99999;
                        customizeView.setText(num + "");
                        customizeView.setSelection(5);
                    }
                    customizeView.setTextColor(getResources().getColor(R.color.chargeText));
                    customizeResultView.setText(num + "银两");
                    tipsView.setText("送" + num + "0嗨豆");
                }
            }
        });
    }


    private void initBars() {
        //隐藏actionbar
        getSupportActionBar().hide();
    }

    private void initViews() {
        backBtn = findViewById(R.id.charge_back_btn);
        balanceView = findViewById(R.id.charge_balance);
        customizeView = findViewById(R.id.charge_customize);
        customizeResultView = findViewById(R.id.charge_customize_result);
        tipsView = findViewById(R.id.charge_tips);
        weixinPayBtn = findViewById(R.id.charge_wxpay_checked);
        aliPayBtn = findViewById(R.id.charge_alipay_checked);
        payBtn = findViewById(R.id.charge_pay_btn);
        gradeLayout1 = findViewById(R.id.charge_grade1_layout);
        gradeLayout2 = findViewById(R.id.charge_grade2_layout);
        gradeLayout3 = findViewById(R.id.charge_grade3_layout);
        gradeLayout4 = findViewById(R.id.charge_grade4_layout);
        gradeLayout5 = findViewById(R.id.charge_grade5_layout);
        gradeLayout6 = findViewById(R.id.charge_grade6_layout);
        grageTextTop1 = findViewById(R.id.charge_grade1_text1);
        grageTextTop2 = findViewById(R.id.charge_grade2_text1);
        grageTextTop3 = findViewById(R.id.charge_grade3_text1);
        grageTextTop4 = findViewById(R.id.charge_grade4_text1);
        grageTextTop5 = findViewById(R.id.charge_grade5_text1);
        grageTextTop6 = findViewById(R.id.charge_grade6_text1);
        grageTextBottom1 = findViewById(R.id.charge_grade1_text2);
        grageTextBottom2 = findViewById(R.id.charge_grade2_text2);
        grageTextBottom3 = findViewById(R.id.charge_grade3_text2);
        grageTextBottom4 = findViewById(R.id.charge_grade4_text2);
        grageTextBottom5 = findViewById(R.id.charge_grade5_text2);
        grageTextBottom6 = findViewById(R.id.charge_grade6_text2);
        weixinPayText = findViewById(R.id.charge_wxpay_text);
        aliPayText = findViewById(R.id.charge_alipay_text);
        loadingLayout = findViewById(R.id.charge_loading_layout);
        loadingTextView = findViewById(R.id.charge_loading_text);
        circleView = findViewById(R.id.charge_loading_image);
        circleAnimation = AnimationUtils.loadAnimation(this, R.anim.anim_circle_loading);
        LinearInterpolator interpolator = new LinearInterpolator();
        circleAnimation.setInterpolator(interpolator);

        gradeLayoutArray[0] = gradeLayout1;
        gradeLayoutArray[1] = gradeLayout2;
        gradeLayoutArray[2] = gradeLayout3;
        gradeLayoutArray[3] = gradeLayout4;
        gradeLayoutArray[4] = gradeLayout5;
        gradeLayoutArray[5] = gradeLayout6;
        gradeTextTopArray[0] = grageTextTop1;
        gradeTextTopArray[1] = grageTextTop2;
        gradeTextTopArray[2] = grageTextTop3;
        gradeTextTopArray[3] = grageTextTop4;
        gradeTextTopArray[4] = grageTextTop5;
        gradeTextTopArray[5] = grageTextTop6;
        gradeTextBottomArray[0] = grageTextBottom1;
        gradeTextBottomArray[1] = grageTextBottom2;
        gradeTextBottomArray[2] = grageTextBottom3;
        gradeTextBottomArray[3] = grageTextBottom4;
        gradeTextBottomArray[4] = grageTextBottom5;
        gradeTextBottomArray[5] = grageTextBottom6;
        customizeView.clearFocus();

        //默认20元档次
        chargeGradeClick(1);
        customizeView.setTextColor(getResources().getColor(R.color.chargeText));
        customizeResultView.setText(20 + "银两");
        tipsView.setText("送" + 20 + "0嗨豆");
    }


    @Override
    protected void onDestroy() {
        unregisterReceiver(mReceiver);
        super.onDestroy();
    }

    /**
     * 点击充值档位
     *
     * @param grade
     */
    private void chargeGradeClick(int grade) {
        customizeView.clearFocus();
        int index = grade - 1;
        //修改字体颜色
        for (int i = 0; i < 6; i++) {
            if (i == index) {
                gradeLayoutArray[i].setBackground(getResources().getDrawable(R.drawable.shape_corner_charge_blue));
                gradeTextTopArray[i].setTextColor(getResources().getColor(R.color.chargeTextChecked));
                gradeTextBottomArray[i].setTextColor(getResources().getColor(R.color.chargeTextChecked));
            } else {
                gradeLayoutArray[i].setBackground(getResources().getDrawable(R.drawable.shape_corner_charge_gray));
                gradeTextTopArray[i].setTextColor(getResources().getColor(R.color.chargeTextLight2));
                gradeTextBottomArray[i].setTextColor(getResources().getColor(R.color.chargeTextLight2));
            }
        }
        //修改下方金额和提示文字
        int num = 0;
        switch (index) {
            case 0:
                num = 20;
                break;
            case 1:
                num = 50;
                break;
            case 2:
                num = 100;
                break;
            case 3:
                num = 200;
                break;
            case 4:
                num = 500;
                break;
            case 5:
                num = 1000;
                break;
            default:
                //num为0时不允许拉起支付
                num = 0;
                break;
        }
        if (num > 0) {
            //这里只修改内容，其他联动的修改交给afterTextChanged去做
            customizeView.setText(num + "");
        }

    }

    /**
     * 清空充值档位
     */
    private void emptyGrade() {
        //修改字体颜色
        for (int i = 0; i < 6; i++) {
            gradeLayoutArray[i].setBackground(getResources().getDrawable(R.drawable.shape_corner_charge_gray));
            gradeTextTopArray[i].setTextColor(getResources().getColor(R.color.chargeTextLight2));
            gradeTextBottomArray[i].setTextColor(getResources().getColor(R.color.chargeTextLight2));
        }
    }

    /**
     * 处理点击事件，用于隐藏软键盘
     *
     * @param ev
     * @return
     */
    @Override
    public boolean dispatchTouchEvent(MotionEvent ev) {
        if (ev.getAction() == MotionEvent.ACTION_DOWN) {
            View v = getCurrentFocus();
            if (isShouldHideKeyboard(v, ev)) {
                hideKeyboard(v.getWindowToken());
            }
        }
        return super.dispatchTouchEvent(ev);
    }


    /**
     * 根据EditText所在坐标和用户点击的坐标相对比，来判断是否隐藏键盘
     *
     * @param v
     * @param event
     * @return
     */
    private boolean isShouldHideKeyboard(View v, MotionEvent event) {
        if (v != null && (v instanceof EditText)) {
            int[] l = {0, 0};
            v.getLocationInWindow(l);
            int left = l[0],
                    top = l[1],
                    bottom = top + v.getHeight(),
                    right = left + v.getWidth();
            if (event.getX() > left && event.getX() < right
                    && event.getY() > top && event.getY() < bottom) {
                // 点击EditText的事件，忽略它。
                return false;
            } else {
                return true;
            }
        }
        return false;
    }


    /**
     * 获取InputMethodManager，隐藏软键盘
     *
     * @param token
     */
    private void hideKeyboard(IBinder token) {
        if (token != null) {
            InputMethodManager im = (InputMethodManager) getSystemService(Context.INPUT_METHOD_SERVICE);
            im.hideSoftInputFromWindow(token, InputMethodManager.HIDE_NOT_ALWAYS);
            customizeView.clearFocus();
        }
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
                    ToastManager.Companion.toast(ChargeActivity.this, "充值成功！");
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            finish();
                        }
                    });
                }else{
                    ToastManager.Companion.toast(ChargeActivity.this, "充值失败！");
                }
            }else if(action != null && action.equals("start_ali_pay_action")){

                final String payInfo = intent.getStringExtra("payInfo");
                final Runnable payRunnable = new Runnable() {

                    @Override
                    public void run() {
                        PayTask alipay = new PayTask(ChargeActivity.this);
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
                    circleView.clearAnimation();
                    loadingLayout.setVisibility(View.GONE);
                    // 判断resultStatus 为9000则代表支付成功
                    if (TextUtils.equals(resultStatus, "9000")) {
                        ToastManager.Companion.toast(ChargeActivity.this, "充值成功！");
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
                        ToastManager.Companion.toast(ChargeActivity.this, "充值失败！");
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
     * 预支付
     */
    private void prePay() {
        try {
            //结算之前判断一下输入金额有效性
            payAmount = Integer.parseInt(customizeView.getText().toString());
        } catch (NumberFormatException e) {
            payAmount = 0;
        }
        if (payAmount <= 0) {
            ToastManager.Companion.toast(this, "请输入充值金额");
        } else {
            //开始转菊花
            circleView.startAnimation(circleAnimation);
            loadingLayout.setVisibility(View.VISIBLE);
            //创建订单
            doPay();
        }
    }

    /**
     * 实际支付，拉起插件
     */
    private void doPay() {
        Intent intent = new Intent("outpay_action");
        intent.putExtra("code",0);
        String pay_way = "alipay";
        if (useWxPay){
            pay_way = "wxpay";
        }
        intent.putExtra("pay_way",pay_way);
        intent.putExtra("payAmount",payAmount);
        sendBroadcast(intent);
    }


}
