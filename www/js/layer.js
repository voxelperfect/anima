anima.Layer = new Class({
    Extends:anima.Node,

    _scene:null,

    _nodes:[],
    _nodeMap:[],

    initialize:function (id) {

        this.parent(id);
    },

    getScene:function () {

        return this._scene;
    },

    addNode:function (node) {

        this._element$.append('<div id="' + node.id + '"></div>');
        node._element$ = $('#' + node.id);
        node._element$.css({
            'position':'absolute'
        });

        this._nodes.push(node);
        this._nodeMap[node.id] = node;

        node._layer = this;
    },

    getNode:function (id) {

        return this._nodeMap[id];
    },

    removeNode:function (id) {

        var node = this.getNode();
        if (node) {
            var count = this._nodes.length;
            for (var i = 0; i < count; i++) {
                if (this._nodes[i].id = id) {
                    this._nodes.splice(i, 1);
                    delete this._nodeMap[id];
                    node._removeElement();
                    return;
                }
            }
            node._layer = null;
        }
    },

    setBackground:function (color, url, width, height) {

        if (!width) {
            width = this._scene._element$.width();
        }
        if (!height) {
            height = this._scene._element$.height();
        }
        this.parent(color, url, width, height);
    },

    getAnimator:function () {

        return this._scene._canvas._animator;
    },

    /* internal methods */

    _getImageUrls:function (urls) {

        var url;
        var count = this._nodes.length;
        for (var i = 0; i < count; i++) {
            url = this._nodes[i].getImageUrl();
            if (url) {
                urls.push(url);
            }
        }
    },

    _removeElement:function () {

        var count = this._nodes.length;
        for (var i = 0; i < count; i++) {
            this._nodes[i].removeElement();
        }
        this._nodes = [];
        this._nodeMap = [];

        this._element$.remove();
    }
});
