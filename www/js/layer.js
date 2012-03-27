anima.Layer = new Class({
    Extends:anima.Node,

    _scene:null,

    _nodes:[],
    _nodeMap:[],

    initialize:function (id) {

        this.parent(id);

        this._type = 'Layer';

        this._origin.x = 0;
        this._origin.y = 0;
    },

    getScene:function () {

        return this._scene;
    },

    getParent:function () {

        return this._scene;
    },

    addNode:function (node) {

        this._renderer.createElement(this, node);

        this._nodes.push(node);
        this._nodeMap[node.id] = node;

        node._layer = this;
        node._animator = this._animator;
        node._canvas = this._canvas;
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

    setBackground:function (color, url, width, height, postponeTransform) {

        if ((!width || !height) && this._scene) {
            if (!width) {
                width = this._scene._size.width;
            }
            if (!height) {
                height = this._scene._size.height;
            }
        }
        this.parent(color, url, width, height, true);

        if (!postponeTransform) {
            this._renderer.updateTransform(this);
        }
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

        this.parent();
    },

    /* unsupported methods */

    setOrigin:function (origin) {

        throw "unsupported operation";
    },

    getOrigin:function () {

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
