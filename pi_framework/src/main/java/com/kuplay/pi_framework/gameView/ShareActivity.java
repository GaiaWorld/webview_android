package com.kuplay.pi_framework.gameView;

import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.os.Build;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.view.WindowManager;
import android.widget.ImageView;
import android.widget.TextView;
import com.kuplay.pi_framework.R;


public class ShareActivity extends AppCompatActivity {

    //返回
    ImageView backBtn;
    //昵称
    TextView nameView;
    //邀请码
    TextView codeView;
    //邀请码复制
    TextView copyBtn;
    //二维码
    ImageView urlView;
    //微信好友分享
    ImageView shareBtnWeixin;
    //朋友圈分享
    ImageView shareBtnWeixinCircle;
    //QQ分享
    ImageView shareBtnWeixinQQ;
    //QQ空间分享
    ImageView shareBtnWeixinQZone;
    //邀请码
    String code;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        initBars();
        setContentView(R.layout.activity_share);
        initViews();

        //赋值
        Bundle bundle = getIntent().getExtras();
        nameView.setText("“" + bundle.getString("nickname") + "”专属邀请码");
        code = bundle.getString("code");
        codeView.setText(code);
        String codeURL = bundle.getString("codeURL");
        //TODO 根据url生成二维码图片

        //onclick
        copyBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                //复制邀请码
                ClipboardManager cm = (ClipboardManager) getApplicationContext().getSystemService(Context.CLIPBOARD_SERVICE);
                cm.setPrimaryClip(ClipData.newPlainText("text", code));
            }
        });
        backBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });
        shareBtnWeixin.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                shareTo(1);
            }
        });
        shareBtnWeixinCircle.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                shareTo(2);
            }
        });
        shareBtnWeixinQQ.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                shareTo(3);
            }
        });
        shareBtnWeixinQZone.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                shareTo(4);
            }
        });
    }


    private void initBars() {
        //隐藏statusbar和navigationbar
        if (Build.VERSION.SDK_INT < 16) {
            //api 4.1
            this.getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,
                    WindowManager.LayoutParams.FLAG_FULLSCREEN);
        } else {
            if (Build.VERSION.SDK_INT < 19) {
                //api 4.4
                int uiFlags = View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                        | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                        | View.SYSTEM_UI_FLAG_FULLSCREEN //hide statusBar
                        | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION; //hide navigationBar
                getWindow().getDecorView().setSystemUiVisibility(uiFlags);
            } else {
                int uiFlags = View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                        | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                        | View.SYSTEM_UI_FLAG_FULLSCREEN // hide status bar
                        | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION // hide navigationBar
                        | View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                        | View.SYSTEM_UI_FLAG_IMMERSIVE;
                getWindow().getDecorView().setSystemUiVisibility(uiFlags);
            }
        }
        //隐藏actionbar
        getSupportActionBar().hide();
    }


    private void initViews() {
        backBtn = findViewById(R.id.share_back_btn);
        nameView = findViewById(R.id.share_nickname);
        codeView = findViewById(R.id.share_code);
        copyBtn = findViewById(R.id.share_code_copy);
        urlView = findViewById(R.id.share_code_pic);
        shareBtnWeixin = findViewById(R.id.share_btn1);
        shareBtnWeixinCircle = findViewById(R.id.share_btn2);
        shareBtnWeixinQQ = findViewById(R.id.share_btn3);
        shareBtnWeixinQZone = findViewById(R.id.share_btn4);
    }


    //TODO click

    /**
     * 分享到外部app
     *
     * @param shareType 1=微信，2=朋友圈，3=QQ，4=QQ空间
     */
    private void shareTo(int shareType) {

    }


}
