anima.RendererCSS3 = Class.extend({

    init:function () {

    },

    css:function (node, properties) {

        node._element$.css(properties);
    },

    createCanvas:function (canvas) {

        var parent$ = $('#pageContent');
        parent$.append('<div id="' + canvas._id + '"></div>');
        canvas._element$ = $('#' + canvas._id);

        canvas._element$.css({
            'padding':'0px',
            'margin':'0px',
            'width':'100%',
            'height':'100%',
            'overflow':'hidden',
            'position':'absolute'
        });
    },

    addHtml5Canvas:function (canvas) {

        if (!canvas._type == 'canvas') {
            return;
        }

        var html5Canvas = document.createElement("canvas");
        html5Canvas.id = canvas._id + '_html5Canvas';
        canvas._element$.append(html5Canvas);
        canvas._html5canvas$ = $('#' + html5Canvas.id);

        canvas._html5canvas$.css({
            'position':'absolute',
            'left':'0px',
            'top':'0px',
            'padding':'0px',
            'margin':'0px'
        });

        canvas._html5canvas$.css({
            'width':'100%',
            'height':'100%',
            'min-height':'100%',
            'max-height':'100%'
        });

        canvas._html5canvas$.css({
            'overflow':'hidden',
            'pointer-events':'none',
            'z-index':10000
        });
    },

    getHtml5CanvasContext:function (canvas) {

        if (canvas._html5canvas$) {
            return canvas._html5canvas$[0].getContext("2d");
        } else {
            return null;
        }
    },

    getElementIdContext:function (parent) {

        var id = '';
        if (!parent) {
            return id;
        }

        do {
            id = parent._id + '_' + id;
            parent = parent.getParent();
        } while (parent != null);

        return id;
    },

    getElementId:function (node) {

        return this.getElementIdContext(node.getParent()) + node._id;
    },

    createElement:function (parent, node) {

        var elementId = this.getElementIdContext(parent) + node._id;

        var html = null;
        if (node._elementType == 'box') {
            html = '<div id="' + elementId + '"></div>';
        } else if (node._elementType == 'text') {
            html = '<input data-role="none" id="' + elementId + '"></input>';
        } else if (node._elementType == 'number') {
            html = '<input data-role="none" id="' + elementId + '"></input>';
        } else if (node._elementType == 'email') {
            html = '<input data-role="none" id="' + elementId + '"></input>';
        } else if (node._elementType == 'telephone') {
            html = '<input data-role="none" id="' + elementId + '"></input>';
        } else if (node._elementType == 'textarea') {
            html = '<input data-role="none" id="' + elementId + '"></input>';
        } else if (node._elementType == 'date') {
            html = '<input data-role="none" id="' + elementId + '"></input>';
        } else if (node._elementType == 'time') {
            html = '<input data-role="none" id="' + elementId + '"></input>';
        }
        var appended = false;
        if (parent._type == 'Layer') {
            var count = parent._nodes.length;
            if (count > 0) {
                parent._nodes[count - 1]._element$.after(html);
                appended = true;
            }
        }
        if (!appended) {
            this.getElement(parent).append(html);
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

    setCurrentSprite:function (node, index) {

        if (node._background.url && node._spriteGrid) {
            index = anima.round(index);
            if (index >= 0 && index < node._spriteGrid.totalSprites) {
                var rows = node._spriteGrid.rows;
                var columns = node._spriteGrid.columns;

                var row = Math.floor(index / columns);
                var column = index - (row * columns);

                var position = (-column * node._size.width) + 'px '
                    + (-row * node._size.height) + 'px';

                node._element$.css('background-position', position);
            }
        }
    },

    setFont:function (node) {

        node._element$.css({
            'font-family':node._font.family,
            'font-size':node._font.size,
            'font-weight':node._font.weight,
            'color':node._font.color
        });
    },

    getElement:function (node) {

        while (node != null && !node._element$) {
            node = node.getParent();
        }
        return (node != null) ? node._element$ : null;
    },

    updateTransform:function (node) {

        var x = (node._position.x - node._origin.x * node._size.width + 0.5) << 0;
        var y = (node._position.y - node._origin.y * node._size.height + 0.5) << 0;
        var translation = 'translate(' + x + 'px, ' + y + 'px)';

        var scale = ' scale(' + node._scale.x + ', ' + node._scale.y + ')';

        var rotation = '';
        if (node._angle && node._angle != 0) {
            var degrees = -anima.toDegrees(node._angle);
            rotation = 'rotate(' + degrees + 'deg) ';
        }

        var acceleration = anima.isWebkit ? ' translateZ(0)' : '';

        var transformation = translation + scale + rotation + acceleration;
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

    updateHtml5Canvas:function (node) {

        if (node._html5canvas$) {
            var canvas = node._html5canvas$[0];
            canvas.width = node._size.width;
            canvas.height = node._size.height;
        }
    },

    updateAll:function (node) {

        this.updateOrigin(node);
        this.updateSize(node);
        this.updateTransform(node);

        this.updateHtml5Canvas(node);
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

    addHtml5Canvas:function (canvas) {

    },

    getHtml5CanvasContext:function (canvas) {

        return null;
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

    updateHtml5Canvas:function (node) {

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
