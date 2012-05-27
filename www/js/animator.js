anima.Animator = Class.extend({

    init:function (adaptive) {

        this._adaptive = adaptive;

        this._animationQueue = [];
        this._animationChains = [];
        this._lastAnimationID = 0;

        this._animationLoopTimerID = null;
        this._animationTimeStart = 0;
    },

    addTask:function (taskFn, delay, data) {

        var animationId = this._lastAnimationID++;

        var animation = {
            id:animationId,
            delay:delay,
            duration:0,
            data:data
        };
        if (!delay) {
            animation.taskFn = taskFn;
        } else {
            animation.onAnimationEndedFn = taskFn;
        }

        this._animationQueue.push(animation);

        return animationId;
    },

    endAnimation:function (id) {

        if (!id) {
            return;
        }

        var animationId = this._lastAnimationID++;
        var animation = {
            id:animationId,
            endId:id
        };
        this._animationQueue.push(animation);

        return animationId;
    },

    addAnimation:function (animation, chainId, data) {

        animation = anima.clone(animation);
        animation.data = data;
        animation.id = this._lastAnimationID++;

        if (chainId) {
            var chain = this._animationChains[chainId];
            if (!chain) {
                chain = [];
                this._animationChains[chainId] = chain;
            }
            chain.push(animation);
        } else {
            this._animationQueue.push(animation);
        }

        return animation.id;
    },

    clearAnimations:function () {

        this._animationQueue = [];
        this._animationChains = [];
    },

    animate:function () {

        var animationQueue = this._animationQueue;
        var animationChains = this._animationChains;

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
        var i;

        for (i = 0; i < count; i++) {
            this._animate(loopTime, animationQueue[i], endedAnimations);
        }

        var chain, active;
        for (var chainId in animationChains) {
            chain = animationChains[chainId];
            if (chain.length > 0) {
                active = this._animate(loopTime, chain[0], endedAnimations);
                if (!active) {
                    chain.shift();
                }
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

    _animate:function (loopTime, animation, endedAnimations) {

        if (animation.taskFn) {
            if (!animation.delay) {
                try {
                    animation.taskFn(loopTime);
                } catch (e) {
                    anima.logException(e);
                }
                endedAnimations.push(animation.id);
                return false;
            }
        } else if (animation.endId) {
            endedAnimations.push(animation.endId);
            endedAnimations.push(animation.id);
            return false;
        }

        if (!animation.startTime) {
            animation.startTime = loopTime;
            if (animation.delay) {
                animation.startTime += animation.delay;
            }
            animation.frame = 0;
            animation.totalFrames = Math.round(0.5 + animation.duration * anima.frameRate / 1000.0);
        }

        var t;
        if (this._adaptive) {
            // TODO needs more work here...
            t = animation.frame * animation.duration / animation.totalFrames;
        } else {
            t = loopTime - animation.startTime;
        }
        if (t < 0.0) {
            return true; // delayed
        }

        var end = (t >= animation.duration);
        if (end) {
            t = animation.duration;
        }

        var easingFn = anima.isObject(animation.easing) ? animation.easing.fn : animation.easing;
        if (easingFn) {
            t = easingFn(null, t, 0.0, 1.0, animation.duration);
        }
        if (animation.interpolateValuesFn) {
            try {
                animation.interpolateValuesFn(this, t, animation);
            } catch (e) {
                anima.logException(e);
            }
        }

        if (end) {
            if (animation.loop) {
                animation.delay = null;
                animation.startTime = null;
            } else {
                endedAnimations.push(animation.id);
            }
        } else {
            animation.frame++;
        }

        return !end;
    },

    _endAnimation:function (id) {

        var animationQueue = this._animationQueue;

        var i, animation;

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