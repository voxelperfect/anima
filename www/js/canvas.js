anima._canvases = [];

anima.Canvas = anima.Node.extend({

    init:function (id, debug, adaptive) {

        this._super(id);

        this._type = 'Canvas';

        this._renderer.createCanvas(this);

        this._animator = new anima.Animator(adaptive);

        this._scenes = [];
        this._sceneMap = [];
        this._currentScene = null;

        anima._canvases.push(this);

        this._debug = debug;
        if (debug) {
            this._renderer.addHtml5Canvas(this);
        }
    },

    getParent:function () {

        return null;
    },

    getCanvas:function () {

        return this._canvas;
    },

    addScene:function (scene) {

        this._renderer.createElement(this, scene);
        scene.hide();

        this._scenes.push(scene);
        this._sceneMap[scene._id] = scene;

        scene._canvas = this;
        scene._animator = this._animator;
        scene._canvas = this;

        if (this._debug && scene._world) {
            var debugDraw = new b2DebugDraw();
            debugDraw.SetSprite(this._renderer.getHtml5CanvasContext(this));
            debugDraw.SetDrawScale(scene._physicsScale);
            debugDraw.SetFillAlpha(0.3);
            debugDraw.SetLineThickness(1.0);
            debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit); // | b2DebugDraw.e_centerOfMassBit);

            scene._world.SetDebugDraw(debugDraw);
        }
    },

    getScene:function (id) {

        return this._sceneMap[id];
    },

    setCurrentScene:function (id, duration, callbackFn) {

        var me = this;

        if (!duration) {
            duration = 500;
        }

        var newScene = this.getScene(id);
        if (newScene) {
            if (this._currentScene) {
                this._animator.clearAnimations();
                this._currentScene.fadeOut(duration, function () {
                    newScene.fadeIn(duration, callbackFn);
                    me._currentScene = newScene;
                });
            } else {
                newScene.fadeIn(duration, callbackFn);
                this._currentScene = newScene;
            }
        }

        return newScene;
    },

    getCurrentScene:function () {

        return this._currentScene;
    },

    removeScene:function (id) {

        var scene = this.getScene();
        if (scene) {
            var count = this._scenes.length;
            for (var i = 0; i < count; i++) {
                if (this._scenes[i]._id = id) {
                    this._scenes.splice(i, 1);
                    delete this._sceneMap[id];
                    scene._removeElement();
                    return;
                }
            }
            scene._canvas = null;
        }
    },

    setBackground:function (color, url, width, height) {

        this._super(color, url, width, height, true);
        this._resize();
    },

    /* internal methods */

    _FIXED_TIMESTEP:1.0 / anima.physicsFrameRate,
    _MINIMUM_TIMESTEP:1.0 / (anima.physicsFrameRate * 10.0),
    _VELOCITY_ITERATIONS:8,
    _POSITION_ITERATIONS:8,
    _MAXIMUM_NUMBER_OF_STEPS:anima.frameRate,

    _step:function (level) {

        var world = level._world;

        var frameTime = 1.0 / anima.frameRate;
        var stepsPerformed = 0;
        while ((frameTime > 0.0) && (stepsPerformed < this._MAXIMUM_NUMBER_OF_STEPS)) {
            var deltaTime = Math.min(frameTime, this._FIXED_TIMESTEP);
            frameTime -= deltaTime;
            if (frameTime < this._MINIMUM_TIMESTEP) {
                deltaTime += frameTime;
                frameTime = 0.0;
            }
            world.Step(deltaTime, this._VELOCITY_ITERATIONS, this._POSITION_ITERATIONS);
            stepsPerformed++;
        }
        level._logic();

        if (this._debug) {
            level._world.DrawDebugData(true);
        }

        world.ClearForces();
    },

    _update:function () {

        var level = this._currentScene;
        var hasLevel = (level && level._world) ? true : false;

        if (hasLevel && level.isAwake()) {
            this._step(level);
        }

        var loopTime = this._animator.animate();

        if (hasLevel && level.isAwake()) {
            level._update();

            if (this._debug) {
                var ctx = this._renderer.getHtml5CanvasContext(this);
                ctx.beginPath();
                ctx.rect(-2, 1, this._size.width + 2, this._size.height - 2);
                ctx.lineWidth = 2;
                ctx.strokeStyle = "green";
                ctx.stroke();
            }
        }
    },

    _getImageUrls:function (urls) {

        var url = this._background.url;
        if (url) {
            urls.push(url);
        }

        var count = this._scenes.length;
        for (var i = 0; i < count; i++) {
            this._scenes[i]._getImageUrls(urls);
        }
    },

    _resize:function () {

        var sourceWidth = this._size.width;
        var sourceHeight = this._size.height;

        var containerSize = this._renderer.getParentElementSize(this);
        var targetWidth = containerSize.width;
        var targetHeight = containerSize.height;

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

        this._renderer.updateAll(this);
    }
});

anima.onResize = function () {

    $.each(anima._canvases, function (index, value) {
        value.getAnimator().addTask(function () {
            value._resize();
        });
    });
};

$(window).resize(function () {

    anima.onResize();
});

$(window).bind('orientationchange', function (event, orientation) {

    anima.onResize();
})

function _anima_update() {

    $.each(anima._canvases, function (index, value) {
        value._update();
    });

    window.requestAnimationFrame(_anima_update, '_anima_update()');
}

anima._loadImages = function (progressFn, callbackFn) {

    $.mobile.showPageLoadingMsg();

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
            loadedImages++;

            if (progressFn) {
                progressFn(anima.round(loadedImages * 100.0 / totalImages));
            }
            if (loadedImages >= totalImages) {
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

anima.start = function (progressFn, callbackFn) {

    $.mobile.loadingMessageTextVisible = false;

    anima._loadImages(progressFn, function () {
        anima._initializeSound(function () {
            anima.onResize();
            if (callbackFn) {
                callbackFn.call();
            }
            window.requestAnimationFrame(_anima_update, '_anima_update()');
        });
    });
};
