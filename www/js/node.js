anima.Node = new Class({

    _type:null,

    _id:null,
    _layer:null,

    _position:{
        x:0,
        y:0
    },
    _size:{
        width:0,
        height:0
    },
    _scale:{
        x:1.0,
        y:1.0
    },
    _origin:{
        x:0.5,
        y:0.5
    },
    _angle:0,

    _background:{
        color:null,
        imageUrl:null
    },

    _zIndex:0,

    _data:null,

    _canvas:null,
    _animator:null,
    _renderer:null,

    initialize:function (id) {

        this.id = id;

        this._type = 'Node';

        this._position = {
            x:0,
            y:0
        };
        this._size = {
            width:0,
            height:0
        };
        this._scale = {
            x:1.0,
            y:1.0
        };
        this._origin = {
            x:0.5,
            y:0.5
        };
        this._angle = 0;

        this._data = {};

        this._renderer = anima.defaultRenderer;
    },

    getImageUrl:function () {

        return this._background.url;
    },

    getLayer:function () {

        return this._layer;
    },

    getParent:function () {

        return this._layer;
    },

    getElement:function () {

        return this._renderer.getElement(this);
    },

    get:function (propertyName) {

        return this._data[propertyName];
    },

    set:function (propertyName, value) {

        if (value) {
            this._data[propertName] = value;
        } else {
            delete this._data[propertyName];
        }
    },

    setZIndex:function (zIndex) {

        node._zIndex = zIndex;
        this._renderer.setZIndex(this);
    },

    getZIndex:function () {

        return this._zIndex;
    },

    setBackground:function (color, url, width, height, postponeTransform) {

        this._background.color = color;
        this._background.url = url;

        if (this._layer) {
            if (!width) {
                width = this._layer._size.width;
            }
            if (!height) {
                height = this._layer._size.height;
            }
        }
        this._size.width = width;
        this._size.height = height;

        this._renderer.setBackground(this);
        if (!postponeTransform) {
            this._renderer.updateTransform(this);
        }
    },

    setOrigin:function (origin) {

        this._origin = anima.clone(origin);
        this._renderer.updateTransform(this);
    },

    getOrigin:function () {

        return anima.clone(this._origin);
    },

    setPosition:function (position) {

        this._position = anima.clone(position);
        this._renderer.updateTransform(this);
    },

    getPosition:function () {

        return anima.clone(this._position);
    },

    move:function (dx, dy) {

        this._position.x += dx;
        this._position.y += dy;
        this._renderer.updateTransform(this);
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

    setAngle:function (angle) {

        this._angle = angle;
        this._renderer.updateTransform(this);
    },

    getAngle:function () {

        return this._angle;
    },

    rotate:function (da) {

        this._angle += da;
        this._renderer.updateTransform(this);
    },

    on:function (eventType, handler) {

        this._renderer.on(this, eventType, handler);
    },

    off:function (eventType, handler) {

        this._renderer.on(this, eventType, handler);
    },

    getAnimator:function () {

        return this._animator;
    },

    forEachNode:function (root, callbackFn) {

        var type = root._type;
        if (type == 'Node') {
            callbackFn(root);
        } else if (type == 'Layer') {
            callbackFn(root);
            for (var i = 0; i < root._nodes.length; i++) {
                callbackFn(root._nodes[i]);
            }
        } else if (type == 'Scene') {
            callbackFn(root);
            for (var i = 0; i < root._layers.length; i++) {
                this.forEachNode(root._layers[i], callbackFn);
            }
        } else if (type == 'Canvas') {
            callbackFn(root);
            for (var i = 0; i < root._scenes.length; i++) {
                this.forEachNode(root._scenes[i], callbackFn);
            }
        }
    },

    /* internal methods */

    _removeElement:function () {

        this._renderer.removeElement(this);
    }
});