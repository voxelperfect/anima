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

    getElementIdContext:function (parent) {

        var id = '';
        do {
            id = parent.id + '_' + id;
            parent = parent.getParent();
        } while (parent != null);

        return id;
    },

    createElement:function (parent, node) {

        var elementId = this.getElementIdContext(parent) + node.id;

        var div = '<div id="' + elementId + '"></div>';
        var appended = false;
        if (parent._type == 'Layer') {
            var count = parent._nodes.length;
            if (count > 0) {
                parent._nodes[count - 1]._element$.after(div);
                appended = true;
            }
        }
        if (!appended) {
            this.getElement(parent).append(div);
        }

        node._element$ = $('#' + elementId);
        node._element$.css({
            'position':'absolute'
        });
    },

    getParentElementSize:function (node) {

        var parent$ = this.getElement(node).parent();
        return {
            width:parent$.width(),
            height:parent$.height()
        }
    },

    setBackground:function (node) {

        if (!node._element$) {
            return;
        }

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

        if (node._background.url) {
            css['background-repeat'] = 'no-repeat';
            css['background-position'] = 'left top';
        }

        node._element$.css(css);
    },

    getElement:function (node) {

        while (node != null && !node._element$) {
            node = node.getParent();
        }
        return (node != null) ? node._element$ : null;
    },

    updateTransform:function (node) {

        var rotation = '';
        if (node._angle && node._angle != 0) {
            var degrees = node._angle * (180.0 / Math.PI);
            rotation = 'rotate(' + degrees + 'deg) ';
        }

        var x = (node._position.x + 0.5) << 0;
        var y = (node._position.y + 0.5) << 0;
        var translation = 'translate(' + x + 'px, ' + y + 'px)';

        var scale = ' scale(' + node._scale.x + ', ' + node._scale.y + ')';

        var acceleration = anima.isWebkit ? ' translateZ(0)' : '';

        var transformation = rotation + translation + scale + acceleration;
        node._element$.css(anima.cssVendorPrefix + 'transform', transformation);
    },

    updateOrigin:function (node) {

        var origin = (node._origin.x * 100) + '% ' + (node._origin.y * 100) + '%';
        node._element$.css(anima.cssVendorPrefix + 'transform-origin', origin);
    },

    updateSize:function (node) {

        node._element$.css({
            'width':node._size.width,
            'height':node._size.height
        });
    },

    updateAll:function (node) {

        this.updateTransform(node);
        this.updateSize(node);
        this.updateOrigin(node);
    },

    on:function (node, eventType, handler) {

        node._element$.bind(eventType, node, handler);
    },

    off:function (node, eventType, handler) {

        node._element$.unbind(eventType, handler);
    },

    removeElement:function (node) {

        node._element$.remove();
    }
});

anima.RendererIE = new Class({
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

    setBackground:function (node) {

        if (!node._element$) {
            return;
        }

        var css = {};

        var background = '';
        var scaleFilter = '';

        if (node._background.color) {
            background += node._background.color;
        }
        if (node._background.url) {
            var scaleFilter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"
                + node._background.url
                + "',sizingMethod='scale')";
        }
        if (background.length > 0) {
            css['background'] = background;
        }

        if (node._background.url) {
            css['background-repeat'] = 'no-repeat';
            css['background-position'] = 'left top';

            css['filter'] = scaleFilter;
            css['-ms-filter'] = scaleFilter;
        }

        node._element$.css(css);
    },

    updateTransform:function (node) {

        node.forEachNode(node, this._applyTransform);
    },

    updateOrigin:function (node) {

    },

    updateSize:function (node) {

    },

    /* internal methods */

    _applyTransform:function (node) {

        if (!node.getScaledBox) {
            return;
        }

        var box = node.getScaledBox();

        node._element$.css({
            'left':(box.x + 0.5) << 0,
            'top':(box.y + 0.5) << 0,
            'width':(box.width + 0.5) << 0,
            'height':(box.height + 0.5) << 0
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

anima.defaultRenderer = anima.isIE8 ? new anima.RendererIE() : new anima.RendererCSS3();
