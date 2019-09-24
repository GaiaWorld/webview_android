package com.high.pi_service.utils;

public interface TypeAdapter {

    public static final Object DEFAULT = new Object();

    public Object adapt(int type, Object value);

}