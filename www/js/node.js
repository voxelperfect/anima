anima.Node = new Class({

    _type:null,

    _id:null,
    _layer:null,

    _position:null,
    _size:null,
    _scale:null,
    _origin:null,
    _angle:0,

    _font:null,

    _background:null,
    _spriteGrid:null,

    _data:null,

    _canvas:null,
    _animator:null,
    _renderer:null,

    _dragging:false,
    _draggingHandler:null,

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
            x:0.0,
            y:0.0
        };
        this._angle = 0;

        this._font = {
            size:'12px',
            family:'Arial, sans-serif',
            weight:'normal'
        };

        this._background = {
            color:null,
            url:null
        };

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

    getCanvas:function () {

        return this._canvas;
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

    setBackground:function (color, url, width, height, postponeTransform) {

        this._background.color = color;
        this._background.url = url;

        if (this._layer) {
            if (!width) {
                width = this._layer._scene._size.width;
            }
            if (!height) {
                height = this._layer._scene._size.height;
            }
        }
        this._size.width = width;
        this._size.height = height;

        this._renderer.setBackground(this);
        if (!postponeTransform) {
            this._renderer.updateAll(this);
        }
    },

    setSpriteGrid:function (spriteGrid) {

        this._spriteGrid = anima.clone(spriteGrid);
    },

    getSpriteGrid:function () {

        return anima.clone(this._spriteGrid);
    },

    setCurrentSprite:function (index) {

        this._renderer.setCurrentSprite(this, index);
    },

    setOrigin:function (origin) {

        this._origin = anima.clone(origin);
        this._renderer.updateOrigin(this);
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

    setFont:function (font) {

        this._font = $.extend(this._font, font);
        this._renderer.setFont(this);
    },

    getFont:function () {

        return anima.clone(this._font);
    },

    on:function (eventType, handler) {

        if (eventType == 'vdrag') {
            this._draggingHandler = handler;
            this._renderer.on(this, 'vmousedown', anima._dragHandler);
            this._renderer.on(this, 'vmousemove', anima._dragHandler);
            this._renderer.on(this, 'vmouseup', anima._dragHandler);
        } else {
            this._renderer.on(this, eventType, handler);
        }
    },

    off:function (eventType, handler) {

        if (eventType == 'vdrag') {
            this._draggingHandler = null;
            this._renderer.off(this, 'vmousedown', anima._dragHandler);
            this._renderer.off(this, 'vmousemove', anima._dragHandler);
            this._renderer.off(this, 'vmouseup', anima._dragHandler);
        } else {
            this._renderer.off(this, eventType, handler);
        }
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

anima._dragHandler = function (event) {

    event.stopPropagation();
    anima.preventDefault(event);

    var node = event.data;

    var type = event.type;
    switch (type) {
        case 'vmousedown':
            node._dragging = true;
            if (node._draggingHandler) {
                node._draggingHandler(event, 'dragstart');
            }
            break;
        case 'vmousemove':
            if (node._dragging && node._draggingHandler) {
                node._draggingHandler(event, 'dragmove');
            }
            break;
        case 'vmouseup':
            node._dragging = false;
            if (node._draggingHandler) {
                node._draggingHandler(event, 'dragend');
            }
            break;
    }
}
