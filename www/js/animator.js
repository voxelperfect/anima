anima.Animator = new Class({

    _adaptive:false,

    _animationQueue:[],
    _lastAnimationID:0,

    _animationLoopTimerID:null,
    _animationTimeStart:0,

    initialize:function (adaptive) {

        this._adaptive = adaptive;
    },

    addTask:function (taskFn) {

        this._animationQueue.push({
            taskFn:taskFn
        });
    },

    addAnimation:function (interpolateValuesFn, startTime, duration, easing, onAnimationEndedFn) {

        this._animationQueue.push({
            id:this._lastAnimationID++,
            interpolateValuesFn:interpolateValuesFn,
            startTime:startTime,
            duration:duration,
            easing:easing,
            onAnimationEndedFn:onAnimationEndedFn
        });
    },

    clearAnimations:function () {

        this._animationQueue = [];
    },

    animate:function () {

        var animationQueue = this._animationQueue;

        if (this._animationTimeStart == 0) {
            this._animationTimeStart = new Date().getTime();
        }
        var currentTime = new Date().getTime();
        var loopTime = currentTime - this._animationTimeStart;

        var count = animationQueue.length;
        if (count == 0) {
            return loopTime;
        }

        var endedAnimations = [];

        var i, animation, t, newValue, easing;
        var p, property, end, css;
        var easingFn;

        for (i = 0; i < count; i++) {
            animation = animationQueue[i];
            if (animation.taskFn) {
                animation.taskFn(loopTime);
                if (this._animationQueue.length == 0) {
                    return;
                }
                endedAnimations.push('@' + i);
                continue;
            }

            if (animation.startTime == 0) {
                animation.startTime = loopTime;
                animation.frame = 0;
                animation.totalFrames = Math.round(0.5 + animation.duration * anima.frameRate / 1000.0);
            }

            if (this._adaptive) {
                // TODO needs more work here...
                t = animation.frame * animation.duration / animation.totalFrames;
            } else {
                t = loopTime - animation.startTime;
            }
            end = (t > animation.duration);
            if (end) {
                t = animation.duration;
            }

            easingFn = anima.isObject(animation.easing) ? animation.easing.fn : animation.easing;
            if (easingFn) {
                t = easingFn(null, t, 0.0, 1.0, animation.duration);
            }
            animation.interpolateValuesFn(this, t);

            if (end) {
                endedAnimations.push(animation.id);
            } else {
                animation.frame++;
            }
        }

        count = endedAnimations.length;
        var id;
        for (i = 0; i < count; i++) {
            id = endedAnimations[i];
            this._endAnimation(id);
        }

        return loopTime;
    },

    interpolate:function (v0, v1, t) {

        if (anima.isNumber(v0)) {
            return (v0 + (v1 - v0) * t);
        } else if (anima.isObject(v0)) {
            return {
                x:(v0.x + (v1.x - v0.x) * t),
                y:(v0.y + (v1.y - v0.y) * t),
                z:v0.z ? (v0.z + (v1.z - v0.z) * t) : 0
            }
        }
    },

    /* internal methods */

    _endAnimation:function (id) {

        var animationQueue = this._animationQueue;

        var i, animation;

        if (anima.isString(id) && id.charAt(0) == '@') {
            i = parseInt(id.substring(1));
            animation = animationQueue[i];
            animationQueue.splice(i, 1);
            if (animation && animation.onAnimationEndedFn) {
                animation.onAnimationEndedFn(animation);
            }
            return;
        }
        var count = animationQueue.length;
        for (i = 0; i < count; i++) {
            animation = animationQueue[i];
            if (animation && animation.id == id) {
                animationQueue.splice(i, 1);
                if (animation.onAnimationEndedFn) {
                    animation.onAnimationEndedFn(animation);
                }
            }
        }
    }
});