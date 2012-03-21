
$(function() {

    var canvas = new anima.Canvas('mainCanvas');
    canvas.setBackground('gray', null, 800, 600);

    var scene = new anima.Scene('scene1');
    canvas.addScene(scene);
    scene.setBackground();

    var layer = new anima.Layer('layer1');
    scene.addLayer(layer);
    layer.setBackground();

    var node = new anima.Node('node1');
    layer.addNode(node);
    node.setBackground('red', null, 50, 50);
    node.setPosition({
        x: 30,
        y: 30
    });

    anima.start(function() {
        canvas.setCurrentScene('scene1');
    });
});