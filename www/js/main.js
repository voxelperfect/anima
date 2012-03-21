$(function () {

    var canvas = new anima.Canvas('mainCanvas');
    canvas.setBackground('gray', null, 800, 600);

    var scene = new anima.Scene('scene1');
    canvas.addScene(scene);
    scene.setBackground();

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

    anima.start(function () {
        canvas.setCurrentScene('scene1');
    });
});