package com.high.ydzm.gameView;

import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.os.Build;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.view.WindowManager;
import android.widget.ImageView;
import android.widget.TextView;
import cn.sharesdk.framework.Platform;
import cn.sharesdk.framework.PlatformActionListener;
import cn.sharesdk.onekeyshare.OnekeyShare;
import cn.sharesdk.tencent.qq.QQ;
import cn.sharesdk.tencent.qzone.QZone;
import cn.sharesdk.wechat.friends.Wechat;
import cn.sharesdk.wechat.moments.WechatMoments;
import com.iqos.qrscanner.utils.QRCodeUtils;
import com.high.ydzm.R;

import java.util.HashMap;


public class ShareActivity extends AppCompatActivity {

    //背景图
    ImageView backImg;
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

    private static final int PLATFORM_WE_CHAT = 1;//分享到的平台->微信
    private static final int PLATFORM_MOMENTS = 2;//分享到的平台->朋友圈
    private static final int PLATFORM_QQ = 3;//分享到的平台->QQ空间
    private static final int PLATFORM_Q_ZONE = 4;//分享到的平台->QQ


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
        Bitmap bitmap = QRCodeUtils.createCode(this, codeURL);
        urlView.setImageBitmap(bitmap);
        String imageName = bundle.getString("imageName");
        int id = getResources().getIdentifier(imageName, "mipmap", getPackageName());
        Bitmap backMp = BitmapFactory.decodeResource(getResources(), id);
        backImg.setImageBitmap(backMp);


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
        backImg = findViewById(R.id.backImage);
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



    //
    private Bitmap getScreenShot(){
        View view = getWindow().getDecorView();
        Bitmap screenshot = Bitmap.createBitmap(view.getWidth(), view.getHeight(), Bitmap.Config.RGB_565);
        Canvas canvas = new Canvas(screenshot);
        canvas.translate(-view.getScaleX(), -view.getScaleY());
        view.draw(canvas);
        return screenshot;
    }

    //TODO click

    /**
     * 分享到外部app
     *
     * @param shareType 1=微信，2=朋友圈，3=QQ，4=QQ空间
     */
    private void shareTo(int shareType) {
        //截图
        Bitmap screenshot = getScreenShot();
        //分享图片
        OnekeyShare oks = new OnekeyShare();
        oks.disableSSOWhenAuthorize();
        oks.setImageData(screenshot);
        String platform = getPlatformName(shareType);
        if (!"".equals(platform))
            oks.setPlatform(platform);
        oks.setCallback(new PlatformActionListener() {
            @Override
            public void onComplete(Platform platform, int i, HashMap<String, Object> hashMap) {
                //分享完成
                Intent intent = new Intent("share_action");
                intent.putExtra("ruselt",0);
                sendBroadcast(intent);
            }

            @Override
            public void onError(Platform platform, int i, Throwable throwable) {
                //分享出错
                Intent intent = new Intent("share_action");
                intent.putExtra("ruselt",-1);
                sendBroadcast(intent);
            }

            @Override
            public void onCancel(Platform platform, int i) {
                //分享取消
                Intent intent = new Intent("share_action");
                intent.putExtra("ruselt",-2);
                sendBroadcast(intent);
            }
        });
        oks.show(this);
    }


    private String getPlatformName(int shareType){
        String plateformName = "";
        switch (shareType){
            case PLATFORM_WE_CHAT:
                plateformName = Wechat.NAME;
                break;
            case PLATFORM_MOMENTS:
                plateformName = WechatMoments.NAME;
                break;
            case PLATFORM_QQ:
                plateformName = QQ.NAME;
                break;
            case PLATFORM_Q_ZONE:
                plateformName = QZone.NAME;
                break;
        }
        return plateformName;
    }




}