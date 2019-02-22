#include <jni.h>
#include <string>

#include "ahash.h"
#include "lamemp3/lame.h"


extern "C" {

static lame_global_flags *glf = NULL;


JNIEXPORT void JNICALL Java_com_kuplay_pi_1module_AudioRecorder_lameMp3Init(JNIEnv *, jclass, jint inSampleRate, jint outChannel, jint outSampleRate, jint outBitrate, jint quality) {

    if (glf != NULL) {
        lame_close(glf);
        glf = NULL;
    }

    glf = lame_init();

    if (inSampleRate > 0) {
        lame_set_in_samplerate(glf, inSampleRate);
    }
    if (outChannel > 0) {
        lame_set_num_channels(glf, outChannel);
    }
    if (outSampleRate > 0) {
        lame_set_out_samplerate(glf, outSampleRate);
    }
    if (outBitrate > 0) {
        lame_set_brate(glf, outBitrate);
    }
    if (quality > 0) {
        lame_set_quality(glf, quality);
    }

    lame_init_params(glf);
}

JNIEXPORT void JNICALL Java_com_kuplay_pi_1module_AudioRecorder_lameMp3Close(JNIEnv *, jclass) {
    lame_close(glf);
    glf = NULL;
}

JNIEXPORT jint JNICALL Java_com_kuplay_pi_1module_AudioRecorder_lameMp3Encode(JNIEnv *env, jclass, jshortArray buffer_l_, jshortArray buffer_r_, jint samples, jbyteArray mp3buf_) {

    jshort *buffer_l = env->GetShortArrayElements(buffer_l_, NULL);

    jshort *buffer_r = NULL;
    if (buffer_r_ != NULL) {
        buffer_r = env->GetShortArrayElements(buffer_r_, NULL);
    }

    jbyte *mp3buf = env->GetByteArrayElements(mp3buf_, NULL);

    const jsize mp3buf_size = env->GetArrayLength(mp3buf_);

    int result = lame_encode_buffer(glf, buffer_l, buffer_r, samples, (u_char *) mp3buf, mp3buf_size);

    env->ReleaseShortArrayElements(buffer_l_, buffer_l, 0);
    if (buffer_r != NULL) {
        env->ReleaseShortArrayElements(buffer_r_, buffer_r, 0);
    }
    env->ReleaseByteArrayElements(mp3buf_, mp3buf, 0);

    return result;
}

JNIEXPORT jint JNICALL Java_com_kuplay_pi_1module_AudioRecorder_lameMp3Flush(JNIEnv *env, jclass, jbyteArray mp3buf_) {
    jbyte *mp3buf = env->GetByteArrayElements(mp3buf_, NULL);

    const jsize mp3buf_size = env->GetArrayLength(mp3buf_);

    int result = lame_encode_flush(glf, (u_char *) mp3buf, mp3buf_size);

    env->ReleaseByteArrayElements(mp3buf_, mp3buf, 0);

    return result;
}

JNIEXPORT jstring JNICALL Java_com_kuplay_pi_1module_AHash_ahash(JNIEnv *env, jclass, jintArray jpixels, jint width, jint height, jint channels) {

    if (jpixels == NULL)
        return env->NewStringUTF("");

    jsize len = env->GetArrayLength(jpixels);
    jint *pixels = (jint *) malloc(len * sizeof(jint));
    env->GetIntArrayRegion(jpixels, 0, len, pixels);

    char *result = ahashImpl((int *) pixels, width, height, channels);

    jstring s;
    if (result != NULL)
        s = env->NewStringUTF(result);
    else
        s = env->NewStringUTF("");

    free(pixels);
    if (result != NULL) {
        free(result);
    }

    return s;
}

}