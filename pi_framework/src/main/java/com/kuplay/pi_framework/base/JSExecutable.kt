package com.kuplay.pi_framework.base

/**
 * JSExecutable is a interface without any property or method,it is just used as a mark.
 * The class which implements {@link JSExecutable} will be auto add into the JSBridge,
 * it is unnecessary for us to add these class which implements {@link JSExecutable} in the java code one by one.
 * No ever where these class's location are,
 * as long as this interface is implemented,it can be recognized.
 */

interface JSExecutable {
}