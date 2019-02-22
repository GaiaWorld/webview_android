//
// Created by user on 2018/10/11.
//

#ifndef WEBVIEW_ANDROID_AHASH_H
#define WEBVIEW_ANDROID_AHASH_H

#ifdef __cplusplus
extern "C" {
#endif

/**
 * 注意：外部程序使用完返回值后，记得调用free释放内存
 */
char *ahashImpl(int *data, int w, int h, int channels);

#ifdef __cplusplus
}
#endif

#endif //WEBVIEW_ANDROID_AHASH_H
