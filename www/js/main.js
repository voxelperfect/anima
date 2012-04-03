var canvas = null;

soundManager.url = 'resources/swf';
soundManager.useHTML5Audio = true;

function getImageUrl(level, imageName, extension) {

    if (!extension) {
        extension = 'png';
    }
    return 'resources/images/' + level.id + '/' + imageName + '.' + extension;
}

function createCommode(layer) {

    var level = layer.getScene();
    var levelHeight = level.getPhysicalSize().height;

    var body = new anima.Body('commode');
    layer.addNode(body);

    body.setBackground(null, getImageUrl(level, 'commode'), 378, 241);
    var physicalSize = body.getPhysicalSize();

    var bodyDef = new b2BodyDef;
    bodyDef.type = b2Body.b2_staticBody;
    bodyDef.position.x = physicalSize.width / 2;
    bodyDef.position.y = (levelHeight - physicalSize.height + (physicalSize.height / 2));

    var fixDef = new b2FixtureDef;
    fixDef.friction = 0.5;
    fixDef.restitution = 0.2;
    fixDef.shape = new b2PolygonShape;
    fixDef.shape.SetAsBox(physicalSize.width / 2, physicalSize.height / 2);

    body.define(bodyDef, fixDef);
}

function createPlatform(layer) {

    var level = layer.getScene();
    var levelHeight = level.getPhysicalSize().height;

    var body = new anima.Body('platform');
    layer.addNode(body);

    body.setBackground(null, getImageUrl(level, 'platform'), 197, 22);
    var physicalSize = body.getPhysicalSize();

    var bodyDef = new b2BodyDef;
    bodyDef.type = b2Body.b2_staticBody;
    bodyDef.position.x = 0.53;
    bodyDef.position.y = levelHeight - 0.32;

    var fixDef = new b2FixtureDef;
    fixDef.shape = new b2PolygonShape;
    fixDef.friction = 0.5;
    fixDef.restitution = 0.2;
    fixDef.shape.SetAsBox(physicalSize.width / 2, physicalSize.height / 2);

    body.define(bodyDef, fixDef);
}

function createCharacter(layer) {

    var characterPosX = 0.2;
    var characterPosY = 0.1; //0.6;

    var level = layer.getScene();
    var levelHeight = level.getPhysicalSize().height;

    var body = new anima.Body('character');
    layer.addNode(body);

    body.setBackground(null, getImageUrl(level, 'character'), 150, 148);
    var physicalSize = body.getPhysicalSize();

    var bodyDef = new b2BodyDef;
    bodyDef.type = b2Body.b2_dynamicBody;
    bodyDef.allowSleep = true;
    bodyDef.position.x = characterPosX;
    bodyDef.position.y = characterPosY;
    bodyDef.fixedRotation = false;
    bodyDef.bullet = true;

    var fixDef = new b2FixtureDef;
    fixDef.mass = 5.0;
    fixDef.friction = 0.5;
    fixDef.restitution = 0.2;
    fixDef.svgPoints = [
        {x:614.991, y:417.988},
        {x:603.991, y:400.5},
        {x:588.991, y:365.5},
        {x:600.491, y:328},
        {x:633.784, y:320.479},
        {x:688.988, y:396},
        {x:685.979, y:417.5}
    ];

    body.define(bodyDef, fixDef);

    body.setLogic(function (body) {

        var level = body.getLevel();
        var physicalBody = body.getPhysicalBody();
        var center = physicalBody.GetWorldCenter();
        if (center.y > level.getPhysicalSize().height) {
            physicalBody.SetPositionAndAngle(new b2Vec2(characterPosX, characterPosY), 0);
            physicalBody.SetLinearVelocity(new b2Vec2(0, 0));
            physicalBody.SetAngularVelocity(0);
        }
    });

    body.on('tap', function () {

        body.getAnimator().addTask(function (loopTime) {
            if (!body.getPhysicalBody().IsAwake()) {
                body.applyImpulse(40, 10);
            }
        });
    });
}

function createLevel0() {

    var level = new anima.Level('level0', 2.0, new b2Vec2(0, 9.81)); // 2m wide, gravity = 9.81 m/sec2
    canvas.addScene(level);
    level.setBackground('black', getImageUrl(level, 'background', 'jpg'));

    var layer = new anima.Layer('environment');
    level.addLayer(layer);

    createCommode(layer);
    createPlatform(layer);
    createCharacter(layer);
}

$('#mainPage').live('pageshow', function (event, ui) {

    canvas = new anima.Canvas('main-canvas');
    canvas.setBackground('black', null, 1575, 787);

    createLevel0();

    anima.start(function () {

        canvas.setCurrentScene('level0');
    });
});

