package com.high.pi_service;

import java.io.Closeable;

public interface Releasable extends Closeable {

    void close();

}
