anima.TransformerCSS3 = new Class({

    initialize:function () {
    },

    setTransform:function (node) {

        var translation = 'translate(' + node._position.x + 'px, ' + node._position.y + 'px)';
        var scale = ' scale(' + node._scale.x + ', ' + node._scale.y + ')';
        var acceleration = $.browser.webkit ? ' translateZ(0px)' : '';

        var transformation = translation + scale + acceleration;

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
            '-o-transform-origin':origin
        });
    }
});

anima.TransformerIE = new Class({
    Extends:anima.TransformerCSS3,

    initialize:function () {
    },

    setTransform:function (node) {

        node._element$.css({
            'left': node._position.x - (node._origin.x * node._size.width),
            'top': node._position.y - (node._origin.y * node._size.height),
            'zoom': node._scale.x
        });
        /*
        node._element$.transform({
            'translate':[node._position.x + 'px', node._position.y + 'px'],
            'scale':[node._scale.x, node._scale.y],
            'origin':[node._origin.x * 100 + '%', node._origin.y * 100 + '%']
        });
        */
    }
});

if ($.browser.msie) {
    var version = parseInt($.browser.version[0]);
    anima.defaultTransformer = (version <= 8) ? new anima.TransformerIE() : new anima.TransformerCSS3();
} else {
    anima.defaultTransformer = new anima.TransformerCSS3();
}


