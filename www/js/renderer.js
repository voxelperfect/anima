/*
 * Copyright 2012 Kostas Karolemeas
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

anima.RendererCSS3 = Class.extend({

    init:function () {

    },

    css:function (node, properties) {

        node._element$.css(properties);
    },

    html:function (node, html) {

        node._element$.html(html);
    },

    createCanvas:function (canvas) {

        var parent$ = $('#pageContent');
        parent$.append('<div id="' + canvas._id + '"></div>');
        canvas._element$ = $('#' + canvas._id);
        canvas._domElement = canvas._element$.get(0);

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
        } else {
            var dataRole = 'data-role="none"';
            var placeHolder = node._editPlaceHolder ? ' placeholder="' + node._editPlaceHolder + '"' : '';
            if (node._elementType == 'text') {
                html = '<input ' + dataRole + placeHolder + ' id="' + elementId + '"></input>';
            } else if (node._elementType == 'number') {
                html = '<input ' + dataRole + placeHolder + ' id="' + elementId + '"></input>';
            } else if (node._elementType == 'email') {
                html = '<input ' + dataRole + placeHolder + ' id="' + elementId + '"></input>';
            } else if (node._elementType == 'telephone') {
                html = '<input ' + dataRole + placeHolder + ' id="' + elementId + '"></input>';
            } else if (node._elementType == 'textarea') {
                html = '<textarea ' + dataRole + placeHolder + ' id="' + elementId + '"></textarea>';
            } else if (node._elementType == 'date') {
                html = '<input ' + dataRole + placeHolder + ' id="' + elementId + '"></input>';
            } else if (node._elementType == 'time') {
                html = '<input ' + dataRole + placeHolder + ' id="' + elementId + '"></input>';
            }
        }

        if (node._renderMode == 'fast') {
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
        } else if (node._renderMode == 'accurate') {
            var topElement$ = node._canvas._element$.parent();
            topElement$.append(html);
        }

        node._element$ = $('#' + elementId);
        node._domElement = node._element$.get(0);

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

        var spriteSheet = node._background.spriteSheet;

        if (index >= 0 && index < spriteSheet.totalSprites) {
            var rows = spriteSheet.rows;
            var columns = spriteSheet.columns;

            var row = Math.floor(index / columns);
            var column = index - (row * columns);

            var position = (-column * node._size.width) + 'px '
                + (-row * node._size.height) + 'px';

            if (anima.isWebkit) {
                node._domElement.style['background-position'] = position;
            } else {
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

        if (node._renderMode == 'fast') {
            this._applyCSS3Transform(node);
        } else if (node._renderMode == 'accurate') {
            this._applyCSS2Transform(node);
        }

        this._updateAccurateNodes(node);
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

        if (node._resizeHandler && node.isVisible()) {
            node._resizeHandler(node);
        }
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
    },

    /* internal methods */

    _updateAccurateNodes:function (node) {

        var accurateNodes = node._accurateNodes;
        if (accurateNodes) {
            var accurateNode, renderer;
            var count = accurateNodes.length;
            for (var i = 0; i < count; i++) {
                accurateNode = accurateNodes[i];
                accurateNode._renderer.updateTransform(accurateNode);
            }
        }
    },

    _applyCSS3Transform:function (node) {

        var x = (node._position.x - node._origin.x * node._size.width + 0.5) << 0;
        var y = (node._position.y - node._origin.y * node._size.height + 0.5) << 0;
        var transformation = 'translate(' + x + 'px, ' + y + 'px)';

        var sx = node._scale.x;
        var sy = node._scale.y;
        if (sx != 1 && sy != 1) {
            transformation += ' scale(' + sx + ', ' + sy + ')';
        }

        if (node._angle && Math.abs(node._angle) > 0.1) {
            var degrees = -anima.toDegrees(node._angle);
            transformation += ' rotate(' + degrees + 'deg)';
        }

        if (anima.isWebkit) {
            transformation += ' translateZ(0)';
        }

        if (node._lastTransformation != transformation) {
            node._lastTransformation = transformation;

            if (anima.isWebkit) {
                node._domElement.style[anima.cssVendorPrefix + 'transform'] = transformation;
            } else {
                node._element$.css(anima.cssVendorPrefix + 'transform', transformation);
            }

            if (node._resizeHandler && node.isVisible()) {
                node._resizeHandler(node);
            }
        }
    },

    _applyCSS2Transform:function (node) {

        var box = node._getScaledBox(true);
        if (!box) {
            return;
        }

        node._element$.css({
            'left':(box.x + 0.5) << 0,
            'top':(box.y + 0.5) << 0,
            'width':(box.width + 0.5) << 0,
            'height':(box.height + 0.5) << 0
        });

        if (node._resizeHandler && node.isVisible()) {
            node._resizeHandler(node);
        }
    }
});

anima.RendererIE = anima.RendererCSS3.extend({

    addHtml5Canvas:function (canvas) {

    },

    getHtml5CanvasContext:function (canvas) {

        return null;
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

        node.forEachNode(node, this._applyCSS2Transform);
    },

    updateOrigin:function (node) {

    },

    updateSize:function (node) {

        if (node._resizeHandler && node.isVisible()) {
            node._resizeHandler(node);
        }
    },

    updateHtml5Canvas:function (node) {

    },

    /* internal methods */

    _applyCSS2Transform:function (node) {

        var box = node._getScaledBox();
        if (!box) {
            return;
        }

        node._element$.css({
            'left':(box.x + 0.5) << 0,
            'top':(box.y + 0.5) << 0,
            'width':(box.width + 0.5) << 0,
            'height':(box.height + 0.5) << 0
        });

        if (node._resizeHandler && node.isVisible()) {
            node._resizeHandler(node);
        }
    }
});

anima.defaultRenderer = anima.isIE8 ? new anima.RendererIE() : new anima.RendererCSS3();

