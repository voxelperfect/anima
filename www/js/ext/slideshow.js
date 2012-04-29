anima.ext.SlideShow = Class.extend({

    init:function (config) {

        this._nodes = config.nodes;
        this._animator = this._nodes[0].getAnimator();

        this._changeDelay = config.changeDelay || 3000;
        this._fadeDuration = config.fadeDuration || 2000;
        this._runOnce = config.runOnce || false;

        this._running = false;
        this._fadeInId = null;
    },

    start:function () {

        this._currentNodeIndex = -1;
        this._running = true;

        var me = this;
        this._animator.addTask(function () {
            me._nextNode();
        });
    },

    stop:function () {

        if (!this._running) {
            return;
        }

        this._running = false;
        if (this._fadeInId) {
            this._animator.endAnimation(this._fadeInId);
        }

        var lastNode = this._nodes[this._currentNodeIndex];
        lastNode.fadeOut(this._fadeDuration / 2);
    },

    /* internal methods */

    _nextNode:function () {

        var lastNode = this._currentNodeIndex >= 0 ? this._nodes[this._currentNodeIndex] : null;
        if (!this._running) {
            if (lastNode) {
                lastNode.fadeOut(this._fadeDuration / 2);
            }
            return;
        }

        var totalNodes = this._nodes.length;

        var done = false;
        this._currentNodeIndex++
        if (this._currentNodeIndex >= totalNodes) {
            if (this._runOnce) {
                done = true;
            } else {
                this._currentNodeIndex = 0;
            }
        }
        var newNode = this._nodes[this._currentNodeIndex];

        var me = this;
        if (totalNodes > 1 && !done) {
            if (lastNode) {
                lastNode.fadeOut(this._fadeDuration);
            }

            this._fadeInId = newNode.fadeIn(this._fadeDuration / 2, function () {
                me._fadeInId = null;
                if (me._running) {
                    me._animator.addTask(function () {
                        me._nextNode();
                    }, me._changeDelay);
                }
            });
        } else {
            newNode.fadeIn(1000);
        }
    }
});