_$define("pi/render3d/babylon/gui_anim_math", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AnimMath {
    /**
     *
     * @param x
     */
    static line(x) {
        return x;
    }
    /**
     * 2 次 函数 0-1， 分三段
    // +----------------------------------+
    // |                                  |
    // |            XXXXX                 |
    // |         XX       XX              |
    // |      XX           XX             |
    // |     XX             XX            |
    // |    XX               XX           |
    // |     +-------+        XX +------+ |
    // |             +-------+ XX         |
    // |                        XX        |
    // |                         XX       |
    // |                          XX      |
    // |                            XX    |
    // |                             XX   |
    // |                                  |
    // +----------------------------------+
     * @param x
    */
    static power2_1_3_down_0(x) {
        return -9 * Math.pow(x, 2) + 6 * x;
    }
    /**
     *
    //                 +-+*
    //               ++  |**
    //             ++    | **
    //           ++      |  *
    //         ++        |  **
    //       ++          |   **
    //     ++            |    *
    //   ++              |    **
    //  +                |     *
    // ++-----------------------+
    //       +-----+     +------+
     * @param x
     */
    static back1(x) {
        return (x < 3 / 4 ? (4 * x / 3) : 4 * (1 - x));
    }
    /**
     *
     * @param x
     */
    static roundTipAnim(x) {
        return (x < 0.3
            ? 10 * x / 3
            : (x < 0.7
                ? 1
                : -10 * (x - 1) / 3));
    }
    /**
     *
     * @param x
     */
    static sin_2PI(x) {
        return Math.sin(2 * Math.PI * x);
    }
    /**
     *
     * @param x
     */
    static sin_PI(x) {
        return Math.sin(Math.PI * x);
    }
}
exports.AnimMath = AnimMath;
});
