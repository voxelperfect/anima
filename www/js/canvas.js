anima._canvases = [];

anima.Canvas = new Class({
    Extends:anima.Node,

    animator:null,

    scenes:[],
    sceneMap:[],
    currentScene:null,

    initialize:function (id) {

        this.parent(id);

        this.element$ = $('#' + this.id);
        this.element$.css({
            'padding':'0px',
            'margin':'0px',
            'width':'100%',
            'height':'100%',
            'overflow':'hidden',
            'position':'relative'
        });

        this.animator = new anima.Animator();

        anima._canvases.push(this);
    },

    addScene:function (scene) {

        this.element$.append('<div id="' + scene.id + '"></div>');
        scene.element$ = $('#' + scene.id);
        scene.element$.hide();
        scene.element$.css({
            'position':'absolute'
        });

        this.scenes.push(scene);
        this.sceneMap[scene.id] = scene;

        scene.canvas = this;
    },

    getScene:function (id) {

        return this.sceneMap[id];
    },

    setCurrentScene:function (id) {

        var me = this;

        var newScene = this.getScene(id);
        if (newScene) {
            if (this.currentScene) {
                this.animator.clearAnimations();
                this.currentScene.element$.fadeOut(1000, function () {
                    newScene.element$.fadeIn(1000);
                    me.currentScene = scene;
                });
            } else {
                newScene.element$.fadeIn(1000);
                this.currentScene = newScene;
            }
        }
    },

    removeScene:function (id) {

        var scene = this.getScene();
        if (scene) {
            var count = this.scenes.length;
            for (var i = 0; i < count; i++) {
                if (this.scenes[i].id = id) {
                    this.scenes.splice(i, 1);
                    delete this.sceneMap[id];
                    scene.removeElement();
                    return;
                }
            }
            scene.canvas = null;
        }
    },

    getAnimator:function () {

        return this.animator;
    },

    getImageUrls:function (urls) {

        var count = this.scenes.length;
        for (var i = 0; i < count; i++) {
            this.scenes[i].getImageUrls(urls);
        }
    },

    setBackground:function (color, url, width, height) {

        this.parent(color, url, width, height);
        this.resize();
    },

    resize:function () {

        var sourceWidth = this.size.width;
        var sourceHeight = this.size.height;

        var container$ = this.element$.parent();
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

        this.origin = {
            x:0,
            y:0
        };
        this.position = {
            x:offsetX,
            y:offsetY
        };
        this.scale = {
            x:scale,
            y:scale
        };

        this._updateTransform();
    }
});

$(window).resize(function () {

    $.each(anima._canvases, function (index, value) {
        value.resize();
    });
});

function update() {

    $.each(anima._canvases, function (index, value) {
        value.getAnimator().animate();
    });
    requestAnimFrame(update);
}

anima.loadImages = function (callbackFn) {

    $.mobile.showPageLoadingMsg("b", "Loading Images");

    var urls = [];
    try {
        $.each(anima._canvases, function (index, value) {
            value.getImageUrls(urls);
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

    anima.loadImages(function () {
        if (callbackFn) {
            callbackFn.call();
        }
        requestAnimFrame(update);
    });
};
