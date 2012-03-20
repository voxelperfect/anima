anima.Animator = new Class({

    interpolators:{

        linear:function (t) {
            return t;
        },

        exponentialIn:function (t, exp) {
            return Math.pow(t, exp);
        },

        exponentialOut:function (t, exp) {
            return 1 - Math.pow(1 - t, exp);
        },

        exponentialInOut:function (t, exp) {
            if (t * 2 < 1) {
                return Math.pow(t * 2, exp) / 2.0;
            } else {
                return 1 - Math.abs(Math.pow(t * 2 - 2, exp)) / 2.0;
            }
        }
    },

    animationQueue:[],
    lastAnimationID:0,
    animationLoopTimerID:null,
    animationTimeStart:0,

    initialize:function () {

    },

    addTask:function (taskFn) {

        this.animationQueue.push({
            taskFn:taskFn
        });
    },

    addAnimation:function (interpolateValuesFn, startTime, duration, interpolator, onAnimationEndedFn) {

        this.animationQueue.push({
            id:this.lastAnimationID++,
            interpolateValuesFn:interpolateValuesFn,
            startTime:startTime,
            duration:duration,
            interpolator:interpolator,
            onAnimationEndedFn:onAnimationEndedFn
        });
    },

    clearAnimations:function () {

        this.animationQueue = [];
    },

    endAnimation:function (id) {

        var animationQueue = this.animationQueue;

        var i;

        if (isString(id) && id.charAt(0) == '@') {
            i = parseInt(id.substring(1));
            animationQueue.splice(i, 1);
            return;
        }
        var count = animationQueue.length;
        var animation;
        for (i = 0; i < count; i++) {
            animation = animationQueue[i];
            if (animation && animation.id == id) {
                animationQueue.splice(i, 1);
                animation.onAnimationEndedFn(animation);
            }
        }
    },

    interpolate:function (v0, v1, t) {

        if (isNumber(v0)) {
            return (v0 + (v1 - v0) * t);
        } else if (isObject(v0)) {
            return {
                x:(v0.x + (v1.x - v0.x) * t),
                y:(v0.y + (v1.y - v0.y) * t),
                z:v0.z ? (v0.z + (v1.z - v0.z) * t) : 0
            }
        }
    },

    animate:function () {

        var animationQueue = this.animationQueue;

        var currentTime = new Date().getTime();
        var loopTime = currentTime - this.animationTimeStart;

        var count = animationQueue.length;
        if (count == 0) {
            return loopTime;
        }

        var endedAnimations = [];

        var i, animation, dt, newValue, interpolator;
        var p, property, end, css;

        for (i = 0; i < count; i++) {
            animation = animationQueue[i];
            if (animation.taskFn) {
                animation.taskFn(loopTime);
                if (this.animationQueue.length == 0) {
                    return;
                }
                endedAnimations.push('@' + i);
                continue;
            }

            if (animation.startTime == 0) {
                animation.startTime = loopTime;
            }

            dt = (loopTime - animation.startTime) / animation.duration;
            end = (dt > 1.0);
            if (end) {
                dt = 1.0;
            }

            interpolator = animation.interpolator;
            if (interpolator.pingPong) {
                if (dt < 0.5) {
                    dt *= 2;
                } else {
                    dt = 1 - (dt - 0.5) * 2;
                }
            }

            dt = interpolator.interpolate(dt, interpolator.exponent);
            animation.interpolateValuesFn(this, dt);

            if (end) {
                endedAnimations.push(animation.id);
            }
        }

        count = endedAnimations.length;
        var id;
        for (i = 0; i < count; i++) {
            id = endedAnimations[i];
            this.endAnimation(id);
        }

        return loopTime;
    }
});