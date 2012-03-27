anima.RendererCSS3 = new Class({

    initialize:function () {
    },

    createCanvas:function (canvas) {

        var parent$ = $('#pageContent');
        parent$.append('<div id="' + canvas.id + '"></div>');
        canvas._element$ = $('#' + canvas.id);

        canvas._element$.css({
            'padding':'0px',
            'margin':'0px',
            'width':'100%',
            'height':'100%',
            'overflow':'hidden',
            'position':'absolute'
        });
    },

    createElement:function (parent, node) {

        parent._element$.append('<div id="' + node.id + '"></div>');
        node._element$ = $('#' + node.id);
        node._element$.css({
            'position':'absolute'
        });
    },

    getParentElementSize:function (node) {

        var parent$ = node._element$.parent();
        return {
            width:parent$.width(),
            height:parent$.height()
        }
    },

    hide:function (node) {

        node._element$.hide();
    },

    show:function (node) {

        node._element$.show();
    },

    fadeIn:function (node, duration, callbackFn) {

        node._element$.fadeIn(duration, callbackFn);
    },

    fadeOut:function (node, duration, callbackFn) {

        node._element$.fadeOut(duration, callbackFn);
    },

    setZIndex:function (node) {

        node._element$.css('z-index', node._zIndex);
    },

    setBackground:function (node) {

        var css = {};

        var background = '';
        if (node._background.color) {
            background += node._background.color;
        }
        if (node._background.url) {
            background += ' url(' + node._background.url + ')';
        }
        if (background.length > 0) {
            css['background'] = background;
        }
        css['background-repeat'] = 'no-repeat';
        css['background-position'] = 'left top';

        node._element$.css(css);
    },

    getElement:function (node) {

        return node._element$;
    },

    updateTransform:function (node) {

        var transformation = this._getTransform(node);

        var origin = (node._origin.x * 100) + '% ' + (node._origin.y * 100) + '%';

        node._element$.css({
            'transform':transformation,
            '-ms-transform':transformation,
            '-moz-transform':transformation,
            '-webkit-transform':transformation,
            '-o-transform':transformation,

            'transform-origin':origin,
            '-ms-transform-origin':origin,
            '-moz-transform-origin':origin,
            '-webkit-transform-origin':origin,
            '-o-transform-origin':origin,
        });

        node._element$.css({
            'width':node._size.width,
            'height':node._size.height
        });
    },

    on:function (node, eventType, handler) {

        node._element$.bind(eventType, node, handler);
    },

    off:function (node, eventType, handler) {

        node._element$.unbind(eventType, handler);
    },

    removeElement:function (node) {

        node._element$.remove();
    },

    /* internal methods */

    _getTransform:function (node) {

        var translation = 'translate(' + node._position.x + 'px, ' + node._position.y + 'px)';
        var scale = ' scale(' + node._scale.x + ', ' + node._scale.y + ')';
        var acceleration = $.browser.webkit ? ' translateZ(0px)' : '';

        return translation + scale + acceleration;
    }
});

anima.RendererCSS2 = new Class({
    Extends:anima.RendererCSS3,

    initialize:function () {

        this.parent();
    },

    createCanvas:function (canvas) {

        this.parent(canvas);
        this._addScaledBoxMethod(canvas);
    },

    createElement:function (parent, node) {

        this.parent(parent, node);

        this._addScaledBoxMethod(node);
    },

    updateTransform:function (node) {

        node.forEachNode(node, this._applyTransform);
    },

    /* internal methods */

    _applyTransform:function (node) {

        var box = node.getScaledBox();

        node._element$.css({
            'left':box.x,
            'top':box.y,
            'width':box.width,
            'height':box.height,
            'background-size':(box.width + 'px ' + box.height + 'px')
        });
    },

    _addScaledBoxMethod:function (node) {

        if (node.getScaledBox) {
            return;
        }

        var type = node._type;
        if (type == 'Node') {
            node.getScaledBox = function () {
                var layer = node._layer;
                var scene = layer._scene;
                var canvas = scene._canvas;

                return {
                    x:node._position.x * layer._scale.x
                        * scene._scale.x
                        * canvas._scale.x,

                    y:node._position.y * layer._scale.y
                        * scene._scale.y
                        * canvas._scale.y,

                    width:node._size.width * node._scale.x
                        * layer._scale.x * scene._scale.x * canvas._scale.x,

                    height:node._size.height * node._scale.y
                        * layer._scale.y * scene._scale.y * canvas._scale.y
                };
            };
        } else if (type == 'Layer') {
            node.getScaledBox = function () {
                var scene = node._scene;
                var canvas = scene._canvas;

                return {
                    x:node._position.x
                        * scene._scale.x
                        * canvas._scale.x,

                    y:node._position.y
                        * scene._scale.y
                        * canvas._scale.y,

                    width:node._size.width * node._scale.x
                        * scene._scale.x * canvas._scale.x,

                    height:node._size.height * node._scale.y
                        * scene._scale.y * canvas._scale.y
                };
            };
        } else if (type == 'Scene') {
            node.getScaledBox = function () {
                var canvas = node._canvas;

                return {
                    x:node._position.x
                        * canvas._scale.x,

                    y:node._position.y
                        * canvas._scale.y,

                    width:node._size.width * node._scale.x
                        * canvas._scale.x,

                    height:node._size.height * node._scale.y
                        * canvas._scale.y
                };
            };
        } else if (type == 'Canvas') {
            node.getScaledBox = function () {
                return {
                    x:node._position.x,

                    y:node._position.y,

                    width:node._size.width * node._scale.x,

                    height:node._size.height * node._scale.y
                };
            };
        }
    }
});

if ($.browser.msie) {
    var version = parseInt($.browser.version[0]);
    anima.defaultRenderer = (version <= 8) ? new anima.RendererCSS2() : new anima.RendererCSS3();
} else {
    anima.defaultRenderer = new anima.RendererCSS3();
}

anima.defaultRenderer = new anima.RendererCSS3();