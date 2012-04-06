anima.Layer = new Class({

    _type:null,

    _id:null,
    _scene:null,

    _scale:null,

    _data:null,

    _canvas:null,
    _animator:null,
    _renderer:null,

    _nodes:[],
    _nodeMap:[],

    initialize:function (id) {

        this._id = id;

        this._type = 'Layer';

        this._scale = {
            x:1.0,
            y:1.0
        };

        this._data = {};

        this._renderer = anima.defaultRenderer;
    },

    getId:function () {

        return this._id;
    },

    getScene:function () {

        return this._scene;
    },

    getParent:function () {

        return this._scene;
    },

    getElement:function () {

        return this._renderer.getElement(this);
    },

    get:function (propertyName) {

        return this._data[propertyName];
    },

    set:function (propertyName, value) {

        if (value) {
            this._data[propertyName] = value;
        } else {
            delete this._data[propertyName];
        }
    },

    addNode:function (node) {

        this._renderer.createElement(this, node);

        this._nodes.push(node);
        this._nodeMap[node._id] = node;

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
                if (this._nodes[i]._id = id) {
                    this._nodes.splice(i, 1);
                    delete this._nodeMap[id];
                    node._removeElement();
                    return;
                }
            }
            node._layer = null;
        }
    },

    setScale:function (scale) {

        this._scale = anima.clone(scale);
        this._renderer.updateTransform(this);
    },

    getScale:function () {

        return anima.clone(this._scale);
    },

    scale:function (dsx, dsy) {

        this._scale.x *= dsx;
        this._scale.y *= dsy;
        this._renderer.updateTransform(this);
    },

    getAnimator:function () {

        return this._animator;
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
    }
});
