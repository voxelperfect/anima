var global_scale = 0.5;

var pictureFrames = {
    'the_place':{
        x1:2142*global_scale,
        y1:96*global_scale,
        x2:2875*global_scale,
        y2:648*global_scale,
        zoomed:{
            x1:1886*global_scale,
            y1:0*global_scale,
            x2:2900*global_scale,
            y2:816*global_scale
        },
        imagePrefix:'the_place',
        textOverlay:{
            width:235*global_scale,
            height:816*global_scale,
            backBox:{
                x1:14*global_scale,
                y1:784*global_scale,
                x2:56*global_scale,
                y2:804*global_scale
            }
        },
        titleSize:{
            width:79*global_scale,
            height:23*global_scale
        }
    }
};

$('#mainPage').live('pageshow', function (event, ui) {

    var canvas = new anima.Canvas('mainCanvas');
    canvas.setBackground(
        'black',
        null,
        3600*global_scale, 2126*global_scale);

    var scene = new anima.Scene('scene1');
    canvas.addScene(scene);
    scene.setBackground(
        'black',
        'resources/images/back_img.jpg');

    var layer = new anima.Layer('layer1');
    scene.addLayer(layer);
    layer.setBackground();

    var node;

    node = new anima.Node('red');
    layer.addNode(node);
    node.setBackground('red', null, 50*global_scale, 50*global_scale);
    node.setPosition({
        x:30*global_scale,
        y:30*global_scale
    });

    node = new anima.Node('green');
    layer.addNode(node);
    node.setBackground('green', null, 50*global_scale, 50*global_scale);
    node.setPosition({
        x:700*global_scale,
        y:30*global_scale
    });

    var pictureFrame = pictureFrames['the_place'];
    node = new anima.Node('the_place');
    layer.addNode(node);
    node.setBackground(null, null, pictureFrame.x2 - pictureFrame.x1, pictureFrame.y2 - pictureFrame.y1);
    node.setPosition({
        x:pictureFrame.x1,
        y:pictureFrame.y1
    });
    node.getElement().css('cursor', 'pointer');
    node.on('tap', function (event) {
        node = event.data;
        var animator = node.getAnimator();

        if (!scene.inViewport()) {
            scene.setViewport(
                pictureFrame.zoomed,
                2000,
                anima.Easing.transition['ease-in-out-sine']);
        } else {
            scene.setViewport(
                null,
                2000,
                anima.Easing.transition['ease-in-out-sine']);
        }
    });

    anima.start(function () {
        canvas.setCurrentScene('scene1');
    });
});