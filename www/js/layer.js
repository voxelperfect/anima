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

    setBackground:function () {

        var width = this._scene._size.width;
        var height = this._scene._size.height;

        this.parent(null, null, width, height, true);
    },

    /* internal methods */

    _getImageUrls:function (urls) {

        var url;

        url = this._background.url;
        if (url) {
            urls.push(url);
        }

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
