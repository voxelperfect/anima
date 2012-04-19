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
        this._animationChains[animationId] = {
            animation:animation,
            chainTo:null
        };

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
        this._animationChains[animationId] = {
            animation:animation,
            chainTo:null
        };

        return animationId;
    },

    addAnimation:function (animation, chainToId) {

        animation = anima.clone(animation);

        animation.id = this._lastAnimationID++;

        var entry = {
            animation:animation,
            chainTo:null
        };
        this._animationChains[animation.id] = entry;

        if (chainToId) {
            var otherEntry = this._animationChains[chainToId];
            if (otherEntry) {
                otherEntry.chainTo = animation;
            } else {
                chainToId = null;
            }
        }

        if (!chainToId) {
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
                if (!animation.delay) {
                    animation.taskFn(loopTime);
                    endedAnimations.push(animation.id);
                    continue;
                }
            } else if (animation.endId) {
                endedAnimations.push(animation.endId);
                endedAnimations.push(animation.id);
                continue;
            }

            if (!animation.startTime) {
                animation.startTime = loopTime;
                if (animation.delay) {
                    animation.startTime += animation.delay;
                }
                animation.frame = 0;
                animation.totalFrames = Math.round(0.5 + animation.duration * anima.frameRate / 1000.0);
            }

            if (this._adaptive) {
                // TODO needs more work here...
                t = animation.frame * animation.duration / animation.totalFrames;
            } else {
                t = loopTime - animation.startTime;
            }
            if (t < 0.0) {
                continue; // delayed
            }

            end = (t >= animation.duration);
            if (end) {
                t = animation.duration;
            }

            easingFn = anima.isObject(animation.easing) ? animation.easing.fn : animation.easing;
            if (easingFn) {
                t = easingFn(null, t, 0.0, 1.0, animation.duration);
            }
            if (animation.interpolateValuesFn) {
                animation.interpolateValuesFn(this, t, animation.data);
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

        var entry = this._animationChains[id];

        var i, animation;
        var count = animationQueue.length;
        for (i = 0; i < count; i++) {
            animation = animationQueue[i];
            if (animation && animation.id == id) {
                animationQueue.splice(i, 1);

                if (animation.onAnimationEndedFn) {
                    animation.onAnimationEndedFn(animation);
                }
                if (entry.chainTo) {
                    var animation = entry.chainTo;
                    this._animationChains[animation.id] = {
                        animation:animation
                    };
                    this._animationQueue.push(animation);
                }
            }
        }

        delete this._animationChains[id];
    }
});