var pictureFrames = {
    'the_place':{
        x1:2142,
        y1:96,
        x2:2875,
        y2:648,
        zoomed:{
            x1:1886,
            y1:0,
            x2:2900,
            y2:816
        },
        imagePrefix:'the_place',
        textOverlay:{
            width:235,
            height:816,
            backBox:{
                x1:14,
                y1:784,
                x2:56,
                y2:804
            }
        },
        titleSize:{
            width:79,
            height:23
        }
    }
};

$('#mainPage').live('pageshow', function (event, ui) {

    var canvas = new anima.Canvas('mainCanvas');
    canvas.setBackground(
        'black',
        null,
        3600, 2126);

    var scene = new anima.Scene('scene1');
    canvas.addScene(scene);
    scene.setBackground(
        'black',
        '../../mpiros/www/resources/images/back_img_final.jpg');

    var layer = new anima.Layer('layer1');
    scene.addLayer(layer);
    layer.setBackground();

    var node;

    node = new anima.Node('red');
    layer.addNode(node);
    node.setBackground('red', null, 50, 50);
    node.setPosition({
        x:30,
        y:30
    });

    node = new anima.Node('green');
    layer.addNode(node);
    node.setBackground('green', null, 50, 50);
    node.setPosition({
        x:700,
        y:30
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
                2500,
                {
                    interpolate:animator.interpolators.exponentialInOut,
                    exponent:1,
                    pingPong:false
                });
        } else {
            scene.setViewport(
                null,
                2500,
                {
                    interpolate:animator.interpolators.exponentialInOut,
                    exponent:1,
                    pingPong:false
                });
        }
    });

    anima.start(function () {
        canvas.setCurrentScene('scene1');
    });
});