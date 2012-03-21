anima._canvases = [];

anima.Canvas = new Class({
    Extends:anima.Node,

    _animator:null,

    _scenes:[],
    _sceneMap:[],
    _currentScene:null,

    initialize:function (id) {

        this.parent(id);

        this._element$ = $('#' + this.id);
        this._element$.css({
            'padding':'0px',
            'margin':'0px',
            'width':'100%',
            'height':'100%',
            'overflow':'hidden',
            'position':'relative'
        });

        this._animator = new anima.Animator();

        anima._canvases.push(this);
    },

    addScene:function (scene) {

        this._element$.append('<div id="' + scene.id + '"></div>');
        scene._element$ = $('#' + scene.id);
        scene._element$.hide();
        scene._element$.css({
            'position':'absolute'
        });

        this._scenes.push(scene);
        this._sceneMap[scene.id] = scene;

        scene._canvas = this;
    },

    getScene:function (id) {

        return this._sceneMap[id];
    },

    setCurrentScene:function (id, duration) {

        var me = this;

        if (!duration) {
            duration = 1500;
        }

        var newScene = this.getScene(id);
        if (newScene) {
            if (this._currentScene) {
                this._animator.clearAnimations();
                this._currentScene._element$.fadeOut(duration, function () {
                    newScene._element$.fadeIn(duration);
                    me._currentScene = scene;
                });
            } else {
                newScene._element$.fadeIn(duration);
                this._currentScene = newScene;
            }
        }
    },

    getCurrentScene:function () {

        return this._currentScene;
    },

    removeScene:function (id) {

        var scene = this.getScene();
        if (scene) {
            var count = this._scenes.length;
            for (var i = 0; i < count; i++) {
                if (this._scenes[i].id = id) {
                    this._scenes.splice(i, 1);
                    delete this._sceneMap[id];
                    scene._removeElement();
                    return;
                }
            }
            scene._canvas = null;
        }
    },

    getAnimator:function () {

        return this._animator;
    },

    setBackground:function (color, url, width, height) {

        this.parent(color, url, width, height);
        this._resize();
    },

    /* internal methods */

    _getImageUrls:function (urls) {

        var count = this._scenes.length;
        for (var i = 0; i < count; i++) {
            this._scenes[i]._getImageUrls(urls);
        }
    },

    _resize:function () {

        var sourceWidth = this._size.width;
        var sourceHeight = this._size.height;

        var container$ = this._element$.parent();
        var targetWidth = container$.width();
        var targetHeight = container$.height();

        var offsetX = 0;
        var offsetY = 0;
        var width = targetWidth;
        var height = targetHeight;

        var requiredWidth = sourceWidth * targetHeight / sourceHeight;
        if (requiredWidth < targetWidth) {
            offsetX = (targetWidth - requiredWidth) / 2;
            width = requiredWidth;
        } else {
            var requiredHeight = sourceHeight * targetWidth / sourceWidth;
            offsetY = (targetHeight - requiredHeight) / 2;
            height = requiredHeight;
        }

        var scale = width / sourceWidth;

        this._origin = {
            x:0,
            y:0
        };
        this._position = {
            x:offsetX,
            y:offsetY
        };
        this._scale = {
            x:scale,
            y:scale
        };

        this._updateTransform();
    }
});

$(window).resize(function () {

    $.each(anima._canvases, function (index, value) {
        value._resize();
    });
});

function _update() {

    $.each(anima._canvases, function (index, value) {
        value.getAnimator().animate();
    });
    requestAnimFrame(_update);
}

anima._loadImages = function (callbackFn) {

    $.mobile.showPageLoadingMsg("b", "Loading Images");

    var urls = [];
    try {
        $.each(anima._canvases, function (index, value) {
            value._getImageUrls(urls);
        });
    } catch (e) {
        console.log(e);
        $.mobile.hidePageLoadingMsg();
        return;
    }
    var totalImages = urls.length;
    if (totalImages == 0) {
        $.mobile.hidePageLoadingMsg();
        if (callbackFn) {
            callbackFn.call();
        }
        return;
    }
    var image;
    var loadedImages = 0;
    for (var i = 0; i < totalImages; i++) {
        image = new Image();
        image.onload = function () {

            if (++loadedImages >= totalImages) {
                $.mobile.hidePageLoadingMsg();
                if (callbackFn) {
                    callbackFn.call();
                }
            }

            image = null;
        };
        image.src = urls[i];
    }
};

anima.start = function (callbackFn) {

    anima._loadImages(function () {
        if (callbackFn) {
            callbackFn.call();
        }
        requestAnimFrame(_update);
    });
};
