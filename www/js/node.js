anima.Node = new Class({

    _id:null,
    _layer:null,
    _element$:null,

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

    _zIndex:0,

    _data:{},

    _transformer:anima.defaultTransformer,

    initialize:function (id) {

        this.id = id;
    },

    getImageUrl:function () {

        var background = this._element$.css('background');
        if (background) {
            var pos1 = background.indexOf('url');
            var pos2 = background.indexOf(')');
            return background.substr(pos1 + 4, pos2 - pos1 - 4);
        } else {
            return null;
        }
    },

    getLayer:function () {

        return this._layer;
    },

    getElement:function () {

        return this._element$;
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

        this._zIndex = zIndex;
        this._element$.css('z-index', zIndex);
    },

    getZIndex:function () {

        return this._zIndex;
    },

    getAnimator:function () {

        return this._layer._scene._canvas._animator;
    },

    setBackground:function (color, url, width, height) {

        var css = {};

        var background = '';
        if (color) {
            background += color;
        }
        if (url) {
            background += ' url(' + url + ')';
        }
        if (background.length > 0) {
            css['background'] = background;
        }
        css['background-repeat'] = 'no-repeat';
        css['background-position'] = 'left top';

        if (!width) {
            width = this.layer.element$.width();
        }
        css.width = width;
        if (!height) {
            height = this.layer.element$.height();
        }
        css.height = height;

        this._element$.css(css);

        this._size.width = width;
        this._size.height = height;
    },

    setOrigin:function (origin) {

        this._origin = anima.clone(origin);
        this._updateTransform();
    },

    getOrigin:function () {

        return anima.clone(this._origin);
    },

    setPosition:function (position) {

        this._position = anima.clone(position);
        this._updateTransform();
    },

    getPosition:function () {

        return anima.clone(this._position);
    },

    move:function (dx, dy) {

        this._position.x += dx;
        this._position.y += dy;
        this._updateTransform();
    },

    setScale:function (scale) {

        this._scale = anima.clone(scale);
        this._updateTransform();
    },

    getScale:function () {

        return anima.clone(this._scale);
    },

    scale:function (dsx, dsy) {

        this._scale.x *= dsx;
        this._scale.y *= dsy;
        this._updateTransform();
    },

    setAngle:function (angle) {

        this._angle = angle;
        this._updateTransform();
    },

    getAngle:function () {

        return this._angle;
    },

    rotate:function (da) {

        this._angle += da;
        this._updateTransform();
    },

    on:function (eventType, handler) {

        this._element$.bind(eventType, this, handler);
    },

    off:function (eventType, handler) {

        this._element$.unbind(eventType, handler);
    },

    /* internal methods */

    _removeElement:function () {

        this._element$.remove();
    },

    _updateTransform:function () {

        this._transformer.setTransform(this);
    }
});