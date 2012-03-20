anima.Scene = new Class({
    Extends:anima.Layer,

    canvas:null,

    layers:[],
    layerMap:[],

    initialize:function (id) {

        this.parent(id);
    },

    addLayer:function (layer) {

        this.element$.append('<div id="' + layer.id + '"></div>');
        layer.element$ = $('#' + layer.id);

        this.layers.push(layer);
        this.layerMap[layer.id] = layer;

        layer.scene = this;
    },

    getLayer:function (id) {

        return this.layerMap[id];
    },

    removeLayer:function (id) {

        var layer = this.getLayer();
        if (layer) {
            var count = this.layers.length;
            for (var i = 0; i < count; i++) {
                if (this.layers[i].id = id) {
                    this.layers.splice(i, 1);
                    delete this.layerMap[id];
                    layer.removeElement();
                    return;
                }
            }
            layer.scene = null;
        }
    },

    getImageUrls:function (urls) {

        var count = this.layers.count;
        for (var i = 0; i < count; i++) {
            this.layers[i].getImageUrls(urls);
        }
    },

    setBackground:function (color, url, width, height) {

        if (!width) {
            width = this.canvas.element$.width();
        }
        if (!height) {
            height = this.canvas.element$.height();
        }
        this.parent(color, url, width, height);
    },

    removeElement:function () {

        var count = this.layers.length();
        for (var i = 0; i < count; i++) {
            this.layers[i].removeElement();
        }
        this.layers = [];
        this.layerMap = [];

        this.element$.remove();
    }
});
