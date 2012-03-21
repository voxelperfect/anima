anima.Scene = new Class({
    Extends:anima.Layer,

    _canvas:null,

    _layers:[],
    _layerMap:[],

    initialize:function (id) {

        this.parent(id);
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

    setBackground:function (color, url, width, height) {

        if (!width) {
            width = this._canvas._element$.width();
        }
        if (!height) {
            height = this._canvas._element$.height();
        }
        this.parent(color, url, width, height);
    },

    /* internal methods */

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
