anima.Node = new Class({

    id:null,
    layer:null,
    element$:null,

    position:{
        x:0,
        y:0
    },
    size:{
        width:0,
        height:0
    },
    scale:{
        x:1.0,
        y:1.0
    },
    origin:{
        x:0.5,
        y:0.5
    },

    initialize:function (id) {

        this.id = id;
    },

    getImageUrl:function () {

        var background = this.element$.css('background');
        if (background) {
            var pos1 = background.indexOf('url');
            var pos2 = background.indexOf(')');
            return background.substr(pos1 + 4, pos2 - pos1 - 4);
        } else {
            return null;
        }
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

        this.element$.css(css);

        this.size.width = width;
        this.size.height = height;
    },

    setOrigin:function (origin) {

        this.origin = origin;
        this._updateTransform();
    },

    getOrigin:function () {

        return anima.clone(this.origin);
    },

    setPosition:function (position) {

        this.position = position;
        this._updateTransform();
    },

    getPosition:function () {

        return anima.clone(this.position);
    },

    move:function (dx, dy) {

        this.position.x += dx;
        this.position.y += dy;
        this._updateTransform();
    },

    setScale:function (scale) {

        this.scale = scale;
        this._updateTransform();
    },

    getScale:function () {

        return anima.clone(this.scale);
    },

    removeElement:function () {

        this.element$.remove();
    },

    _updateTransform:function (posChanged, scaleChanged, originChanged) {

        var translation = 'translate(' + this.position.x + 'px, ' + this.position.y + 'px)';
        var scale = ' scale(' + this.scale.x + ', ' + this.scale.y + ')';
        var acceleration = ' translateZ(0px)';

        var transformation = translation + scale + acceleration;

        var origin = (this.origin.x * 100) + '% ' + (this.origin.y * 100) + '%';

        this.element$.css({
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