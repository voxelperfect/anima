anima.Node = new Class({

    id:null,
    layer: null,
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

    setBackground:function (color, url, width, height) {

        var background = '';
        if (color) {
            background += color;
        }
        if (url) {
            background += ' url(' + url + ')';
        }

        this.element$.css({
            'background':background,
            'background-repeat':'no-repeat',
            'width':width,
            'height':height
        });

        this.size.width = width;
        this.size.height = height;
    },

    setOrigin:function (origin) {

        this.origin = origin;
        this._updateTransform(false, false, true);
    },

    getOrigin:function () {

        return anima.clone(this.origin);
    },

    setPosition:function (position) {

        this.position = position;
        this._updateTransform(true, false, false);
    },

    getPosition:function () {

        return anima.clone(this.position);
    },

    move:function (dx, dy) {

        this.position.x += dx;
        this.position.y += dy;
        this._updateTransform(true, false, false);
    },

    setScale:function (scale) {

        this.scale = scale;
        this._updateTransform(false, true, false);
    },

    getScale:function () {

        return anima.clone(this.scale);
    },

    scale:function (dsx, dsy) {

        this.scale.x *= dsx;
        this.scale.y *= dsy;
        this._updateTransform(false, true, false);
    },

    removeElement: function() {

        this.element$.remove();
    },

    _updateTransform:function (pos, scale, origin) {

        var translation = 'translate(' + this.position.x + 'px, ' + this.position.y + 'px)';
        var scale = ' scale(' + this.scale.x + ', ' + this.scale.y + ')';
        var acceleration = ' translateZ(0px)';

        var transformation = translation + scale + acceleration;

        var origin = (this.origin.x * 100) + '% ' + (this.origin.y * 100) + '%';

        var css;
        if ((pos || scale) && origin) {
            css = {
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
            };
        } else if (pos || scale) {
            css = {
                'transform':transformation,
                '-ms-transform':transformation,
                '-moz-transform':transformation,
                '-webkit-transform':transformation,
                '-o-transform':transformation
            };
        } else if (origin) {
            css = {
                'transform-origin':origin,
                '-ms-transform-origin':origin,
                '-moz-transform-origin':origin,
                '-webkit-transform-origin':origin,
                '-o-transform-origin':origin
            };
        }

        this.element$.css(css);
    }
});