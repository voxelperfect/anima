anima.Scene = new Class({
    Extends:anima.Layer,

    _canvas:null,

    _layers:[],
    _layerMap:[],

    _view:null,

    initialize:function (id) {

        this.parent(id);
    },

    getCanvas:function () {

        return this._canvas;
    },

    addLayer:function (layer) {

        this._element$.append('<div id="' + layer.id + '"></div>');
        layer._element$ = $('#' + layer.id);
        layer._element$.css({
            'position':'absolute'
        });

        this._layers.push(layer);
        this._layerMap[layer.id] = layer;

        layer._scene = this;
    },

    getLayer:function (id) {

        return this._layerMap[id];
    },

    removeLayer:function (id) {

        var layer = this.getLayer();
        if (layer) {
            var count = this._layers.length;
            for (var i = 0; i < count; i++) {
                if (this._layers[i].id = id) {
                    this._layers.splice(i, 1);
                    delete this._layerMap[id];
                    layer._removeElement();
                    return;
                }
            }
            layer._scene = null;
        }
    },

    setBackground:function (color, url) {

        var width = this._canvas._element$.width();
        var height = this._canvas._element$.height();
        this.parent(color, url, width, height);
    },

    setView:function (view, duration, interpolator, callbackFn) {

        var reset = false;
        if (!view) {
            view = {
                x1:0,
                y1:0,
                x2:this._canvas._size.width,
                y2:this._canvas._size.height
            };
            reset = true;
        }

        var me = this;

        view = this._adjustViewAspectRatio(view);

        var x1 = this._position.x;
        var y1 = this._position.y;
        var x2 = -view.x1 * view.scale;
        var y2 = -view.y1 * view.scale;

        var s1 = this._scale.x;
        var s2 = view.scale;

        this._canvas._animator.addAnimation(
            function (animator, dt) {

                me._scale.x = me._scale.y = animator.interpolate(s1, s2, dt);
                me._position.x = animator.interpolate(x1, x2, dt);
                me._position.y = animator.interpolate(y1, y2, dt);

                me._updateTransform();
            },
            0, duration,
            interpolator,
            callbackFn);

        this._view = reset ? null : view;
    },

    getView:function () {

        return anima.clone(_view);
    },

    inView: function() {

        return (this._view != null);
    },

    getAnimator:function () {

        return this._canvas._animator;
    },

    /* internal methods */

    _adjustViewAspectRatio:function (view) {

        var adjustedBox = anima.clone(view);

        var boxWidth = view.x2 - view.x1;
        var boxHeight = view.y2 - view.y1;

        var sceneRatio = this._size.width / this._size.height;
        if (sceneRatio < 1) {
            var newBoxHeight = boxWidth / sceneRatio;
            var offset = (newBoxHeight - boxHeight) / 2;
            adjustedBox.y1 -= offset;
            adjustedBox.y2 += offset;
        } else {
            var newBoxWidth = boxHeight * sceneRatio;
            var offset = (newBoxWidth - boxWidth) / 2;
            adjustedBox.x1 -= offset;
            adjustedBox.x2 += offset;
        }

        adjustedBox.scale = this._size.width / (adjustedBox.x2 - adjustedBox.x1);

        return adjustedBox;
    },

    _getImageUrls:function (urls) {

        var count = this._layers.count;
        for (var i = 0; i < count; i++) {
            this._layers[i]._getImageUrls(urls);
        }
    },

    _removeElement:function () {

        var count = this._layers.length();
        for (var i = 0; i < count; i++) {
            this._layers[i].removeElement();
        }
        this._layers = [];
        this._layerMap = [];

        this._element$.remove();
    }
});
