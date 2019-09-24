package com.high.pi_service;

@SuppressWarnings("serial")
public class V8ResultUndefined extends V8RuntimeException {

    V8ResultUndefined(final String message) {
        super(message);
    }

    V8ResultUndefined() {
        super();
    }
}