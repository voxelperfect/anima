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

    getLayer: function() {

        return this._layer;
    },

    getElement:function () {

        return this._element$;
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

        this._origin = origin;
        this._updateTransform();
    },

    getOrigin:function () {

        return anima.clone(this._origin);
    },

    setPosition:function (position) {

        this._position = position;
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

        this._scale = scale;
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

    on:function (eventType, eventData, handler) {

        if (arguments.length == 3) {
            this._element$.bind(eventType, eventData, handler);
        } else if (arguments.length == 2) {
            this._element$.bind(eventType, eventData);
        }
    },

    off:function (eventType, handler) {

        if (arguments.length == 2) {
            this._element$.unbind(eventType, handler);
        } else if (arguments.length == 1) {
            this._element$.unbind(eventType);
        }
    },

    /* internal methods */

    _removeElement:function () {

        this._element$.remove();
    },

    _updateTransform:function () {

        var translation = 'translate(' + this._position.x + 'px, ' + this._position.y + 'px)';
        var scale = ' scale(' + this._scale.x + ', ' + this._scale.y + ')';
        var acceleration = ' translateZ(0px)';

        var transformation = translation + scale + acceleration;

        var origin = (this._origin.x * 100) + '% ' + (this._origin.y * 100) + '%';

        this._element$.css({
            'transform':transformation,
            '-ms-transform':transformation,
            '-moz-transform':transformation,
            '-webkit-transform':transformation,
            '-o-transform':transformation,

            'transform-origin':origin,
            '-ms-transform-origin':origin,
            '-moz-transform-origin':origin,
            '-webkit-transform-origin':origin,
            '-o-transform-origin':origin
        });
    }
});