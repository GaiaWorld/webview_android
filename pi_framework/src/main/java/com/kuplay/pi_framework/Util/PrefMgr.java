package com.kuplay.pi_framework.Util;

import android.content.Context;
import android.content.SharedPreferences;

public class PrefMgr {
    private final SharedPreferences sSp;
    private static PrefMgr mPrefMgr;

    private PrefMgr(Context ctx) {
        sSp = ctx.getSharedPreferences("app_config.xml", Context.MODE_PRIVATE);
    }

    public static PrefMgr getInstance(Context ctx) {
        if (null == mPrefMgr) {
            synchronized (PrefMgr.class) {
                if (null == mPrefMgr) {
                    mPrefMgr = new PrefMgr(ctx);
                }
            }
        }
        return mPrefMgr;
    }

    public int getAppLan() {
        return sSp.getInt("app_lan", 1);
    }

    public void saveAppLan(int lan) {
        sSp.edit().putInt("app_lan", lan).apply();
    }
}
