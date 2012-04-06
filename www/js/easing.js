/*!
 * Bez @VERSION
 * http://github.com/rdallasgray/bez
 *
 * A plugin to convert CSS3 cubic-bezier co-ordinates to jQuery-compatible easing functions
 *
 * With thanks to Nikolay Nemshilov for clarification on the cubic-bezier maths
 * See http://st-on-it.blogspot.com/2011/05/calculating-cubic-bezier-function.html
 *
 * Copyright @YEAR Robert Dallas Gray. All rights reserved.
 * Provided under the FreeBSD license: https://github.com/rdallasgray/bez/blob/master/LICENSE.txt
 */
jQuery.extend({ bez:function (coOrdArray) {
    var encodedFuncName = "bez_" + $.makeArray(arguments).join("_").replace(".", "p");
    if (typeof jQuery.easing[encodedFuncName] !== "function") {
        var polyBez = function (p1, p2) {
            var A = [null, null], B = [null, null], C = [null, null],
                bezCoOrd = function (t, ax) {
                    C[ax] = 3 * p1[ax], B[ax] = 3 * (p2[ax] - p1[ax]) - C[ax], A[ax] = 1 - C[ax] - B[ax];
                    return t * (C[ax] + t * (B[ax] + t * A[ax]));
                },
                xDeriv = function (t) {
                    return C[0] + t * (2 * B[0] + 3 * A[0] * t);
                },
                xForT = function (t) {
                    var x = t, i = 0, z;
                    while (++i < 14) {
                        z = bezCoOrd(x, 0) - t;
                        if (Math.abs(z) < 1e-3) break;
                        x -= z / xDeriv(x);
                    }
                    return x;
                };
            return function (t) {
                return bezCoOrd(xForT(t), 1);
            }
        };
        jQuery.easing[encodedFuncName] = function (x, t, b, c, d) {
            return c * polyBez([coOrdArray[0], coOrdArray[1]], [coOrdArray[2], coOrdArray[3]])(t / d) + b;
        }
    }
    return jQuery.easing[encodedFuncName];
}});

anima.Easing = {

    // jQuery Easing Function Parameters
    // x: current time normalized [0..1]
    // t: current time in ms since animation start
    // b: start value, usually = 0
    // c: change from the start value to the end value, usually = 1
    // d: animation duration

    easeInQuad:function (x, t, b, c, d) {
        return c * (t /= d) * t + b;
    },

    easeOutQuad:function (x, t, b, c, d) {
        return -c * (t /= d) * (t - 2) + b;
    },

    easeInOutQuad:function (x, t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t + b;
        return -c / 2 * ((--t) * (t - 2) - 1) + b;
    },

    easeInCubic:function (x, t, b, c, d) {
        return c * (t /= d) * t * t + b;
    },

    easeOutCubic:function (x, t, b, c, d) {
        return c * ((t = t / d - 1) * t * t + 1) + b;
    },

    easeInOutCubic:function (x, t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
        return c / 2 * ((t -= 2) * t * t + 2) + b;
    },

    easeInQuart:function (x, t, b, c, d) {
        return c * (t /= d) * t * t * t + b;
    },
    easeOutQuart:function (x, t, b, c, d) {
        return -c * ((t = t / d - 1) * t * t * t - 1) + b;
    },
    easeInOutQuart:function (x, t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
        return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
    },

    easeInQuint:function (x, t, b, c, d) {
        return c * (t /= d) * t * t * t * t + b;
    },

    easeOutQuint:function (x, t, b, c, d) {
        return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
    },

    easeInOutQuint:function (x, t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
        return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
    },

    easeInSine:function (x, t, b, c, d) {
        return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
    },

    easeOutSine:function (x, t, b, c, d) {
        return c * Math.sin(t / d * (Math.PI / 2)) + b;
    },

    easeInOutSine:function (x, t, b, c, d) {
        return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
    },

    easeInExpo:function (x, t, b, c, d) {
        return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
    },

    easeOutExpo:function (x, t, b, c, d) {
        return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
    },

    easeInOutExpo:function (x, t, b, c, d) {
        if (t == 0) return b;
        if (t == d) return b + c;
        if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
        return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
    },

    easeInCirc:function (x, t, b, c, d) {
        return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
    },

    easeOutCirc:function (x, t, b, c, d) {
        return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
    },

    easeInOutCirc:function (x, t, b, c, d) {
        if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
        return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
    },

    easeInElastic:function (x, t, b, c, d) {
        var s = 1.70158;
        var p = 0;
        var a = c;
        if (t == 0) return b;
        if ((t /= d) == 1) return b + c;
        if (!p) p = d * .3;
        if (a < Math.abs(c)) {
            a = c;
            var s = p / 4;
        }
        else var s = p / (2 * Math.PI) * Math.asin(c / a);
        return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
    },

    easeOutElastic:function (x, t, b, c, d) {
        var s = 1.70158;
        var p = 0;
        var a = c;
        if (t == 0) return b;
        if ((t /= d) == 1) return b + c;
        if (!p) p = d * .3;
        if (a < Math.abs(c)) {
            a = c;
            var s = p / 4;
        }
        else var s = p / (2 * Math.PI) * Math.asin(c / a);
        return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
    },

    easeInOutElastic:function (x, t, b, c, d) {
        var s = 1.70158;
        var p = 0;
        var a = c;
        if (t == 0) return b;
        if ((t /= d / 2) == 2) return b + c;
        if (!p) p = d * (.3 * 1.5);
        if (a < Math.abs(c)) {
            a = c;
            var s = p / 4;
        }
        else var s = p / (2 * Math.PI) * Math.asin(c / a);
        if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
    },

    easeInBack:function (x, t, b, c, d, s) {
        if (s == undefined) s = 1.70158;
        return c * (t /= d) * t * ((s + 1) * t - s) + b;
    },

    easeOutBack:function (x, t, b, c, d, s) {
        if (s == undefined) s = 1.70158;
        return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
    },

    easeInOutBack:function (x, t, b, c, d, s) {
        if (s == undefined) s = 1.70158;
        if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
        return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
    },

    easeInBounce:function (x, t, b, c, d) {
        return c - anima.Easing.easeOutBounce(x, d - t, 0, c, d) + b;
    },

    easeOutBounce:function (x, t, b, c, d) {
        if ((t /= d) < (1 / 2.75)) {
            return c * (7.5625 * t * t) + b;
        } else if (t < (2 / 2.75)) {
            return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
        } else if (t < (2.5 / 2.75)) {
            return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
        } else {
            return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
        }
    },

    easeInOutBounce:function (x, t, b, c, d) {
        if (t < d / 2) return anima.Easing.easeInBounce(x, t * 2, 0, c, d) * .5 + b;
        return anima.Easing.easeOutBounce(x, t * 2 - d, 0, c, d) * .5 + c * .5 + b;
    },

    transition:{
        'in':{css:'ease-in', fn:this.easeInQuad},
        'out':{css:'ease-out', fn:this.easeOutQuad},
        'in-out':{css:'ease-in-out', fn:this.easeInOutQuad},
        'snap':{css:'cubic-bezier(0,1,.5,1)', fn:$.bez([0, 1, .5, 1])},
        'linear':{css:'cubic-bezier(0.250, 0.250, 0.750, 0.750)', fn:$.bez([0.250, 0.250, 0.750, 0.750])},
        'ease-in-quad':{css:'cubic-bezier(0.550, 0.085, 0.680, 0.530)', fn:$.bez([0.550, 0.085, 0.680, 0.530])},
        'ease-in-cubic':{css:'cubic-bezier(0.550, 0.055, 0.675, 0.190)', fn:$.bez([0.550, 0.055, 0.675, 0.190])},
        'ease-in-quart':{css:'cubic-bezier(0.895, 0.030, 0.685, 0.220)', fn:$.bez([0.895, 0.030, 0.685, 0.220])},
        'ease-in-quint':{css:'cubic-bezier(0.755, 0.050, 0.855, 0.060)', fn:$.bez([0.755, 0.050, 0.855, 0.060])},
        'ease-in-sine':{css:'cubic-bezier(0.470, 0.000, 0.745, 0.715)', fn:$.bez([0.470, 0.000, 0.745, 0.715])},
        'ease-in-expo':{css:'cubic-bezier(0.950, 0.050, 0.795, 0.035)', fn:$.bez([0.950, 0.050, 0.795, 0.035])},
        'ease-in-circ':{css:'cubic-bezier(0.600, 0.040, 0.980, 0.335)', fn:$.bez([0.600, 0.040, 0.980, 0.335])},
        'ease-in-back':{css:'cubic-bezier(0.600, -0.280, 0.735, 0.045)', fn:$.bez([0.600, -0.280, 0.735, 0.045])},
        'ease-out-quad':{css:'cubic-bezier(0.250, 0.460, 0.450, 0.940)', fn:$.bez([0.250, 0.460, 0.450, 0.940])},
        'ease-out-cubic':{css:'cubic-bezier(0.215, 0.610, 0.355, 1.000)', fn:$.bez([0.215, 0.610, 0.355, 1.000])},
        'ease-out-quart':{css:'cubic-bezier(0.165, 0.840, 0.440, 1.000)', fn:$.bez([0.165, 0.840, 0.440, 1.000])},
        'ease-out-quint':{css:'cubic-bezier(0.230, 1.000, 0.320, 1.000)', fn:$.bez([0.230, 1.000, 0.320, 1.000])},
        'ease-out-sine':{css:'cubic-bezier(0.390, 0.575, 0.565, 1.000)', fn:$.bez([0.390, 0.575, 0.565, 1.000])},
        'ease-out-expo':{css:'cubic-bezier(0.190, 1.000, 0.220, 1.000)', fn:$.bez([0.190, 1.000, 0.220, 1.000])},
        'ease-out-circ':{css:'cubic-bezier(0.075, 0.820, 0.165, 1.000)', fn:$.bez([0.075, 0.820, 0.165, 1.000])},
        'ease-out-back':{css:'cubic-bezier(0.175, 0.885, 0.320, 1.275)', fn:$.bez([0.175, 0.885, 0.320, 1.275])},
        'ease-out-quad':{css:'cubic-bezier(0.455, 0.030, 0.515, 0.955)', fn:$.bez([0.455, 0.030, 0.515, 0.955])},
        'ease-out-cubic':{css:'cubic-bezier(0.645, 0.045, 0.355, 1.000)', fn:$.bez([0.645, 0.045, 0.355, 1.000])},
        'ease-in-out-quart':{css:'cubic-bezier(0.770, 0.000, 0.175, 1.000)', fn:$.bez([0.770, 0.000, 0.175, 1.000])},
        'ease-in-out-quint':{css:'cubic-bezier(0.860, 0.000, 0.070, 1.000)', fn:$.bez([0.860, 0.000, 0.070, 1.000])},
        'ease-in-out-sine':{css:'cubic-bezier(0.445, 0.050, 0.550, 0.950)', fn:$.bez([0.445, 0.050, 0.550, 0.950])},
        'ease-in-out-expo':{css:'cubic-bezier(1.000, 0.000, 0.000, 1.000)', fn:$.bez([1.000, 0.000, 0.000, 1.000])},
        'ease-in-out-circ':{css:'cubic-bezier(0.785, 0.135, 0.150, 0.860)', fn:$.bez([0.785, 0.135, 0.150, 0.860])},
        'ease-in-out-back':{css:'cubic-bezier(0.680, -0.550, 0.265, 1.550)', fn:$.bez([0.680, -0.550, 0.265, 1.550])}
    }
};