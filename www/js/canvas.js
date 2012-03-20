anima._canvases = [];

anima.Canvas = new Class({
    Extends:anima.Node,

    animator:null,

    scenes:[],
    sceneMap:[],

    initialize:function (id) {

        this.parent(id);

        this.element$ = $('#' + this.id);

        this.animator = new anima.Animator();

        anima._canvases.push(this);
    },

    addScene:function (scene) {

        this.scene$.append('<div id="' + scene.id + '"></div>');
        scene.scene$ = $('#' + scene.id);

        this.scenes.push(scene);
        this.sceneMap[scene.id] = scene;

        scene.canvas = this;
    },

    getScene:function (id) {

        return this.sceneMap[id];
    },

    removeScene:function (id) {

        var scene = this.getScene();
        if (scene) {
            for (var i in this.scenes) {
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

    resize:function () {

        var me = this;

        this.animator.addTask(function (loopTime) {
            me.animator.clearAnimations();
        });
    },

    _adjustWindowSize:function (sourceWidth, sourceHeight, targetWidth, targetHeight) {

        var adjusted = {
            offsetX:0,
            offsetY:0,
            width:targetWidth,
            height:targetHeight
        };

        var requiredWidth = sourceWidth * targetHeight / sourceHeight;
        if (requiredWidth < targetWidth) {
            adjusted.offsetX = (targetWidth - requiredWidth) / 2;
            adjusted.width = requiredWidth;
        } else {
            var requiredHeight = sourceHeight * targetWidth / sourceWidth;
            adjusted.offsetY = (targetHeight - requiredHeight) / 2;
            adjusted.height = requiredHeight;
        }

        return adjusted;
    }
});

$(window).resize(function () {

    $.each(anima._canvases, function (index, value) {
        value.resize();
    });
});

/*
 acc.currentLevel.loadBackground(function () {
 acc.currentLevel.initializeLevel(acc.gameCanvas);
 requestAnimFrame(update);
 });

 function update() {

 acc.animator.animate();
 requestAnimFrame(update);
 }

 */