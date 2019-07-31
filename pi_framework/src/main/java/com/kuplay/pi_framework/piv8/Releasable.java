package com.kuplay.pi_framework.piv8;

import java.io.Closeable;

public interface Releasable extends Closeable {

    void close();

}
