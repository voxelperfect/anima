anima.Scene = anima.Node.extend({

    init:function (id) {

        this._super(id);

        this._type = 'Scene';
    },

    load:function () {

        if (this._nodeMap) {
            for (var id in this._nodeMap) {
                this._nodeMap[id].destroy();
            }
        }

        this._origin.x = 0;
        this._origin.y = 0;

        this._layers = [];
        this._layerMap = [];
        this._nodeMap = [];

        this._viewport = null;

        this._accurateNodes = [];
    },

    getCanvas:function () {

        return this._canvas;
    },

    getParent:function () {

        return this._canvas;
    },

    addLayer:function (layer) {

        this._layers.push(layer);
        this._layerMap[layer._id] = layer;

        layer._scene = this;
        layer._animator = this._animator;
        layer._canvas = this._canvas;
    },

    getLayer:function (id) {

        return this._layerMap[id];
    },

    removeLayer:function (id) {

        var layer = this.getLayer();
        if (layer) {
            var count = this._layers.length;
            for (var i = 0; i < count; i++) {
                if (this._layers[i]._id == id) {
                    this._layers.splice(i, 1);
                    delete this._layerMap[id];
                    layer._removeElement();
                    return;
                }
            }
            layer._scene = null;
        }
    },

    getNode:function (id) {

        return this._nodeMap[id];
    },

    setSize:function (postponeTransform) {

        this._super(this._canvas._size.width, this._canvas._size.height, true);

        if (!postponeTransform) {
            this._renderer.updateAll(this);
        }
    },

    setViewport:function (viewport, duration, easing, callbackFn) {

        var reset = false;
        if (!viewport) {
            viewport = {
                x1:0,
                y1:0,
                x2:this._canvas._size.width,
                y2:this._canvas._size.height
            };
            reset = true;
        }

        if (!duration) {
            duration = 0;
        }
        if (!easing) {
            easing = anima.Easing.transition['ease-in-out-sine'];
        }

        viewport = this._adjustViewAspectRatio(viewport);

        var x1 = this._position.x;
        var y1 = this._position.y;
        var x2 = -viewport.x1 * viewport.scale;
        var y2 = -viewport.y1 * viewport.scale;

        var s1 = this._scale.x;
        var s2 = viewport.scale;

        var element$ = this.getElement();

        if (duration == 0) {
            this._scale.x = this._scale.y = s2;
            this._position.x = x2;
            this._position.y = y2;
            this._renderer.updateTransform(this);
        } else {
            var me = this;

            if (anima.cssTransitionEndEvent && anima.isObject(easing)) {
                var css = {};
                css[anima.cssVendorPrefix + 'transition-properties'] = 'transform';
                css[anima.cssVendorPrefix + 'transition-duration'] = duration + 'ms';
                css[anima.cssVendorPrefix + 'transition-timing-function'] = easing.css;
                me.css(css);

                element$.bind(anima.cssTransitionEndEvent, function () {
                    element$.unbind(anima.cssTransitionEndEvent);

                    var css = {};
                    css[anima.cssVendorPrefix + 'transition-property'] = '';
                    css[anima.cssVendorPrefix + 'transition-duration'] = '';
                    css[anima.cssVendorPrefix + 'transition-timing-function'] = '';
                    me.css(css);

                    if (callbackFn) {
                        callbackFn(null, viewport);
                    }
                });

                this._scale.x = this._scale.y = s2;
                this._position.x = x2;
                this._position.y = y2;
                this._renderer.updateTransform(me);
            } else {
                this._canvas._animator.addAnimation({
                    interpolateValuesFn:function (animator, dt) {

                        me._scale.x = me._scale.y = animator.interpolate(s1, s2, dt);
                        me._position.x = animator.interpolate(x1, x2, dt);
                        me._position.y = animator.interpolate(y1, y2, dt);

                        me._renderer.updateTransform(me);
                    },
                    duration:duration,
                    easing:easing,
                    onAnimationEndedFn:function (animator, animation) {
                        if (callbackFn) {
                            callbackFn(animation, viewport);
                        }
                    }});
            }
        }

        this._viewport = reset ? null : viewport;
    },

    getViewport:function () {

        return anima.clone(_view);
    },

    inViewport:function () {

        return (this._viewport != null);
    },

    /* internal methods */

    _getScaledBox:function () {

        if (!this._position) {
            return null;
        }

        var canvas = this._canvas;

        var me = this;
        return {
            x:me._position.x * canvas._scale.x,
            y:me._position.y * canvas._scale.y,
            width:me._size.width * me._scale.x * canvas._scale.x,
            height:me._size.height * me._scale.y * canvas._scale.y
        };
    },

    _adjustViewAspectRatio:function (view) {

        var adjustedBox = anima.clone(view);

        var boxWidth = view.x2 - view.x1;
        var boxHeight = view.y2 - view.y1;

        var sceneRatio = this._size.width / this._size.height;
        if (sceneRatio < 1) {
            var newBoxHeight = boxWidth / sceneRatio;
            var offset = ((newBoxHeight - boxHeight) / 2 + 0.5) << 0;
            adjustedBox.y1 -= offset;
            adjustedBox.y2 += offset;
        } else {
            var newBoxWidth = boxHeight * sceneRatio;
            var offset = ((newBoxWidth - boxWidth) / 2 + 0.5) << 0;
            adjustedBox.x1 -= offset;
            adjustedBox.x2 += offset;
        }

        adjustedBox.scale = this._size.width / (adjustedBox.x2 - adjustedBox.x1);

        return adjustedBox;
    },

    _getImageUrls:function (urls) {

        var url = this._background.url;
        if (url) {
            urls.push(url);
        }

        var count = this._layers.length;
        for (var i = 0; i < count; i++) {
            this._layers[i]._getImageUrls(urls);
        }
    },

    _removeElement:function () {

        var count = this._layers.length;
        for (var i = 0; i < count; i++) {
            this._layers[i].removeElement();
        }
        this._layers = [];
        this._layerMap = [];

        this._super();
    },

    /* unsupported methods */

    setOrigin:function (origin) {

        throw "unsupported operation";
    },

    getOrigin:function () {

        throw "unsupported operation";
    },

    setPosition:function (position) {

        throw "unsupported operation";
    },

    getPosition:function () {

        throw "unsupported operation";
    },

    move:function (dx, dy) {

        throw "unsupported operation";
    },

    setScale:function (scale) {

        throw "unsupported operation";
    },

    getScale:function () {

        throw "unsupported operation";
    },

    scale:function (dsx, dsy) {

        throw "unsupported operation";
    },

    setAngle:function (angle) {

        throw "unsupported operation";
    },

    getAngle:function () {

        throw "unsupported operation";
    },

    rotate:function (da) {

        throw "unsupported operation";
    }
});
