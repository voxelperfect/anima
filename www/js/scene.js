anima.Scene = new Class({
    Extends:anima.Layer,

    _canvas:null,

    _layers:[],
    _layerMap:[],

    initialize:function (id) {

        this.parent(id);
    },

    getCanvas: function() {

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

    zoomInTo:function (box) {

        var targetBox = anima.clone(box);
        this._mapBoxToScene(targetBox);


    },

    zoomOut:function () {

    },

    /* internal methods */

    _mapBoxToScene:function (box) {

        var boxWidth = box.x2 - box.x1;
        var boxHeight = box.y2 - box.y1;
        var boxRatio = boxWidth / boxHeight;

        var windowRatio = this._size.width / this._size.height;
        var newBoxWidth, newBoxHeight, offset;
        if (windowRatio < 1) {
            newBoxWidth = boxWidth;
            newBoxHeight = boxWidth / windowRatio;
            offset = (newBoxHeight - boxHeight) / 2;
            box.y1 -= offset;
            box.y2 += offset;
        } else {
            newBoxWidth = boxHeight * windowRatio;
            newBoxHeight = boxHeight;
            offset = (newBoxWidth - boxWidth) / 2;
            box.x1 -= offset;
            box.x2 += offset;
        }

        box.scale = this._size.width / (box.x2 - box.x1);
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
