//
// Created by user on 2018/10/11.
//

#include "ahash.h"

#include <math.h>
#include <stdlib.h>
#include <string.h>

/**
 * 彩色图 变 灰度图
 * @param pixels 图片像素，RGB或者RGBA
 * @param w 宽度(int)
 * @param h 高度(int)
 */
static char* gray(int *pixels, int w, int h) {
    int curr = 0;
    char *result = malloc(w * h);
    if (result != NULL) {
        for (int j = 0; j < h; ++j) {
            for (int i = 0; i < w; ++i) {
                int p = pixels[w * j + i];
                char r = (p >> 16) & 0xff;
                char g = (p >> 8) & 0xff;
                char b = p & 0xff;
                result[curr++] = r * 0.299 + g * 0.587 + b * 0.114;
            }
        }
    }
    return result;
}

/**
 * 取块中像素的平均值
 * @param grayPixels 灰度图的像素
 *
 */
static int getBlockMean(char *pixels, int w, int startW, int startH, int endW, int endH) {
    int sum = 0, num = 0;
    for (int j = startH; j < endH; ++j) {
        for (int i = startW; i < endW; ++i) {
            ++num;
            sum += pixels[j * w + i];
        }
    }
    return sum / num;
}

/**
 * 缩放灰度图
 * @param pixels 灰度图的像素
 * @param w 宽度{int}
 * @param h 高度{int}
 * @param wBlock 要缩放的宽度{int}
 * @param hBlock 要缩放的高度{int}
 * @return resize之后的像素数据
 */
static char* resizeGray(char *pixels, int w, int h, int wBlock, int hBlock) {
    int numW = floor(w / wBlock);
    int numH = floor(h / hBlock);
    char *result = malloc(wBlock * hBlock);
    if (result == NULL) {
        return NULL;
    }

    for (int j = 0; j < hBlock; ++j) {
        for (int i = 0; i < wBlock; ++i) {
            result[j * wBlock + i] = getBlockMean(pixels, w, i * numW, j * numH, (i + 1) * numW, (j + 1) * numH);
        }
    }
    return result;
}

/**
 * 求平均数
 * @param data 数据
 * @return 平均数{int}
 */
static int getMean(char *pixels, int size) {
    int sum = 0;
    for (int i = 0; i < size; ++i) {
        sum += pixels[i];
    }
    return round(sum / size);
};

/**
 * 根据mean，比较pixels的每个元素，小于mean为0，大于mean为1
 * @param data 数据
 * @param  mean 标记{int}
 * @return 长度是data.length，表示计算出来的Hash
 */
static char* compareWithMean(char *pixels, int size, int mean) {
    for (int i = 0; i < size; ++i) {
        pixels[i] = pixels[i] < mean ? 0 : 1;
    }
    return pixels;
};

/**
 * 将Uint8Array变16进制字符串
 * @param pixels 数据
 * @param size 肯定为4的倍数
 * @return 16进制字符串
 */
static char* toHexString(char *pixels, int size) {
    int fragment = size / 4;
    char *result = malloc(fragment + 1);
    result[fragment] = '\0';

    if (result == NULL) {
        return NULL;
    }
    int weight[4] = {8, 4, 2, 1};
    for (int i = 0; i < fragment; ++i) {
        int sum = 0;
        for (int j = 0; j < 3; ++j) {
            sum += weight[j] * pixels[4 * i + j];
        }
        char c = '0';
        switch (sum) {
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
            case 8:
            case 9:
                c = '0' + sum;
                break;
            case 10:
                c = 'a';
                break;
            case 11:
                c = 'b';
                break;
            case 12:
                c = 'c';
                break;
            case 13:
                c = 'd';
                break;
            case 14:
                c = 'e';
                break;
            case 15:
                c = 'f';
                break;
            default:
                break;
        }
        result[i] = c;
    }
    return result;
}

/**
 * 注意：外部程序使用完返回值后，记得调用free释放内存
 */
char* ahashImpl(int *pixels, int w, int h, int channels) {

    if (w < 16 || h < 16) {
        return NULL;
    }

    if (channels != 4) {
        return NULL;
    }

    char *g  = gray(pixels, w, h);
    if (g == NULL) {
        return NULL;
    }

    int resizeW = 8, resizeH = 8;
    char *s = resizeGray(g, w, h, resizeW, resizeH);
    free(g);
    if (s == NULL) {
        return NULL;
    }

    int size = resizeW * resizeH;
    int mean = getMean(s, size);

    compareWithMean(s, size, mean);

    char *str = toHexString(s, size);
    free(s);
    return str;
}
