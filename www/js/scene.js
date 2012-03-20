anima.Scene = new Class({
    Extends:anima.Layer,

    canvas: null,

    layers:[],
    layerMap:[],

    initialize:function (id) {

        this.parent(id);
    },

    addLayer:function (layer) {

        this.layer$.append('<div id="' + layer.id + '"></div>');
        layer.layer$ = $('#' + layer.id);

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
            for (var i in this.layers) {
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

    removeElement:function () {

        for (var i in this.nodes) {
            this.layers[i].removeElement();
        }
        this.layers = [];
        this.layerMap = [];

        this.element$.remove();
    }
});
