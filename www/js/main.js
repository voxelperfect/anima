var canvas = null;

soundManager.url = 'resources/swf';
soundManager.useHTML5Audio = true;

function getImageUrl(level, imageName) {

    return 'resources/images/' + level.id + '/' + imageName + '.png';
}

function createCommode(layer) {

    var level = layer.getScene();
    var levelHeight = level.getPhysicalSize().height;

    var physicalSize = {
        width:0.48,
        height:0.31
    };
    var body = new anima.Body('commode', physicalSize);
    layer.addNode(body);

    var imageWidth = 249;
    var imageHeight = 159;
    body.setBackground(null, getImageUrl(level, 'commode'), imageWidth, imageHeight);

    var bodyDef = new b2BodyDef;
    bodyDef.type = b2Body.b2_staticBody;
    bodyDef.position.x = physicalSize.width / 2;
    bodyDef.position.y = (levelHeight - physicalSize.height + (physicalSize.height / 2));

    var fixDef = new b2FixtureDef;
    fixDef.density = 1.0;
    fixDef.friction = 0.5;
    fixDef.restitution = 0.2;
    fixDef.shape = new b2PolygonShape;
    fixDef.shape.SetAsBox(physicalSize.width / 2, physicalSize.height / 2);

    body.define(bodyDef, fixDef);
}

function createLevel0() {

    var level = new anima.Level('level0', 2.0, new b2Vec2(0, 9.81)); // 2m wide, gravity = 9.81 m/sec2
    canvas.addScene(level);
    level.setBackground('black', getImageUrl(level, 'background'));

    var layer = new anima.Layer('environment');
    level.addLayer(layer);

    createCommode(layer);
}

$('#mainPage').live('pageshow', function (event, ui) {

    canvas = new anima.Canvas('main-canvas');
    canvas.setBackground('black', null, 1575, 787);

    createLevel0();

    anima.start(function () {

        canvas.setCurrentScene('level0');
    });
});

