var canvas = null;

// http://www.hobistic.com/anima/deploy/index.html?scale=18.0&mass=2&impulse=50.0&gravity=9.81&damp=1.0
var WORLD_SCALE = parseFloat(anima.getRequestParameter('scale', '18.0'));
var CHARACTER_MASS = parseFloat(anima.getRequestParameter('mass', '2.0'));
var CHARACTER_IMPULSE = parseFloat(anima.getRequestParameter('impulse', '50.0'));
var GRAVITY = parseFloat(anima.getRequestParameter('gravity', '9.81'));
var LINEAR_DAMPING = parseFloat(anima.getRequestParameter('damp', '1.0'));

function getImageUrl(level, imageName, extension) {

    if (!extension) {
        extension = 'png';
    }
    return 'resources/images/' + level.id + '/' + imageName + '.' + extension;
}

function debug(layer, message) {

    var node = layer.getScene().getLayer('gizmos').getNode('debugBox');
    node.getElement().html(message);
}

function createDebugBox(layer) {

    var node = new anima.Node('debugBox');
    layer.addNode(node);

    node.setBackground(null, null, 1200, 30);
    node.setPosition({
        x:0,
        y:0
    });

    node.setFont({
        'size':'30px',
        'weight':'bold',
        'color':'black'
    });

    node.getElement().css({
        opacity:0.5
    })
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
    body._physicalSize.height /= 2;

    var bodyDef = new b2BodyDef;
    bodyDef.type = b2Body.b2_staticBody;
    bodyDef.position.x = 0.53 * WORLD_SCALE;
    bodyDef.position.y = levelHeight - 0.305 * WORLD_SCALE;

    var fixDef = new b2FixtureDef;
    fixDef.shape = new b2PolygonShape;
    fixDef.friction = 0.5;
    fixDef.restitution = 0.2;
    fixDef.shape.SetAsBox(physicalSize.width / 2, physicalSize.height / 2);

    body.define(bodyDef, fixDef);
}

function setCharacterPointsSvg(fixDef) {

    fixDef.svgPoints = [
        {x:614.991, y:417.988},
        {x:603.991, y:400.5},
        {x:588.991, y:365.5},
        {x:600.491, y:328},
        {x:633.784, y:320.479},
        {x:688.988, y:396},
        {x:685.979, y:417.5}
    ];
}

function setCharacterPointsPolys(level, fixDef) {

    var ptm_ratio = level._physicsScale;
    fixDef.polyPoints = [
        [
            [   new b2Vec2(99 / ptm_ratio, 46 / ptm_ratio)  , new b2Vec2(96 / ptm_ratio, 74 / ptm_ratio)  , new b2Vec2(14 / ptm_ratio, 50 / ptm_ratio)  , new b2Vec2(30 / ptm_ratio, 23 / ptm_ratio)  , new b2Vec2(70 / ptm_ratio, 7 / ptm_ratio)  ] ,
            [   new b2Vec2(142 / ptm_ratio, 136 / ptm_ratio)  , new b2Vec2(101 / ptm_ratio, 125 / ptm_ratio)  , new b2Vec2(40 / ptm_ratio, 95 / ptm_ratio)  , new b2Vec2(112 / ptm_ratio, 102 / ptm_ratio)  , new b2Vec2(133 / ptm_ratio, 106 / ptm_ratio)  ] ,
            [   new b2Vec2(101 / ptm_ratio, 125 / ptm_ratio)  , new b2Vec2(142 / ptm_ratio, 136 / ptm_ratio)  , new b2Vec2(137 / ptm_ratio, 143 / ptm_ratio)  , new b2Vec2(117 / ptm_ratio, 147 / ptm_ratio)  , new b2Vec2(100 / ptm_ratio, 137 / ptm_ratio)  ] ,
            [   new b2Vec2(40 / ptm_ratio, 95 / ptm_ratio)  , new b2Vec2(101 / ptm_ratio, 125 / ptm_ratio)  , new b2Vec2(89 / ptm_ratio, 138 / ptm_ratio)  , new b2Vec2(40 / ptm_ratio, 141 / ptm_ratio)  , new b2Vec2(31 / ptm_ratio, 132 / ptm_ratio)  , new b2Vec2(29 / ptm_ratio, 110 / ptm_ratio)  ] ,
            [   new b2Vec2(112 / ptm_ratio, 102 / ptm_ratio)  , new b2Vec2(40 / ptm_ratio, 95 / ptm_ratio)  , new b2Vec2(23 / ptm_ratio, 83 / ptm_ratio)  , new b2Vec2(14 / ptm_ratio, 63 / ptm_ratio)  , new b2Vec2(14 / ptm_ratio, 50 / ptm_ratio)  , new b2Vec2(96 / ptm_ratio, 74 / ptm_ratio)  , new b2Vec2(111 / ptm_ratio, 89 / ptm_ratio)  ]
        ],
        [
            [   new b2Vec2(99 / ptm_ratio, 46 / ptm_ratio)  , new b2Vec2(96 / ptm_ratio, 74 / ptm_ratio)  , new b2Vec2(14 / ptm_ratio, 50 / ptm_ratio)  , new b2Vec2(30 / ptm_ratio, 23 / ptm_ratio)  , new b2Vec2(70 / ptm_ratio, 7 / ptm_ratio)  ] ,
            [   new b2Vec2(142 / ptm_ratio, 136 / ptm_ratio)  , new b2Vec2(101 / ptm_ratio, 125 / ptm_ratio)  , new b2Vec2(40 / ptm_ratio, 95 / ptm_ratio)  , new b2Vec2(112 / ptm_ratio, 102 / ptm_ratio)  , new b2Vec2(133 / ptm_ratio, 106 / ptm_ratio)  ] ,
            [   new b2Vec2(101 / ptm_ratio, 125 / ptm_ratio)  , new b2Vec2(142 / ptm_ratio, 136 / ptm_ratio)  , new b2Vec2(137 / ptm_ratio, 143 / ptm_ratio)  , new b2Vec2(117 / ptm_ratio, 147 / ptm_ratio)  , new b2Vec2(100 / ptm_ratio, 137 / ptm_ratio)  ] ,
            [   new b2Vec2(40 / ptm_ratio, 95 / ptm_ratio)  , new b2Vec2(101 / ptm_ratio, 125 / ptm_ratio)  , new b2Vec2(89 / ptm_ratio, 138 / ptm_ratio)  , new b2Vec2(40 / ptm_ratio, 141 / ptm_ratio)  , new b2Vec2(31 / ptm_ratio, 132 / ptm_ratio)  , new b2Vec2(29 / ptm_ratio, 110 / ptm_ratio)  ] ,
            [   new b2Vec2(112 / ptm_ratio, 102 / ptm_ratio)  , new b2Vec2(40 / ptm_ratio, 95 / ptm_ratio)  , new b2Vec2(23 / ptm_ratio, 83 / ptm_ratio)  , new b2Vec2(14 / ptm_ratio, 63 / ptm_ratio)  , new b2Vec2(14 / ptm_ratio, 50 / ptm_ratio)  , new b2Vec2(96 / ptm_ratio, 74 / ptm_ratio)  , new b2Vec2(111 / ptm_ratio, 89 / ptm_ratio)  ]
        ]
    ];
}

function createCharacter(layer) {

    var characterPosX = 0.5 * WORLD_SCALE;
    var characterPosY = 0.1 * WORLD_SCALE; //0.6;

    var level = layer.getScene();
    var levelHeight = level.getPhysicalSize().height;

    var body = new anima.Body('character');
    layer.addNode(body);

    body.setBackground(null, getImageUrl(level, 'character'), 150, 150);
    body.setSpriteGrid({
        row:7,
        columns:8,
        totalSprites:52
    });
    var physicalSize = body.getPhysicalSize();

    var bodyDef = new b2BodyDef;
    bodyDef.type = b2Body.b2_dynamicBody;
    bodyDef.allowSleep = true;
    bodyDef.linearDamping = LINEAR_DAMPING;
    bodyDef.position.x = characterPosX;
    bodyDef.position.y = characterPosY;
    bodyDef.fixedRotation = false;
    bodyDef.bullet = true;

    var fixDef = new b2FixtureDef;
    fixDef.mass = CHARACTER_MASS;
    fixDef.friction = 0.5;
    fixDef.restitution = 0.2;
    //setCharacterPointsPolys(level, fixDef);
    setCharacterPointsSvg(fixDef);
    body.define(bodyDef, fixDef);

    body.setLogic(function (body) {

        var level = body.getLevel();
        var physicalBody = body.getPhysicalBody();
        var center = physicalBody.GetWorldCenter();
        if (center.y > level.getPhysicalSize().height) {
            var animator = body.getAnimator();
            animator.endAnimation(body.get('animationId'));

            physicalBody.SetPositionAndAngle(new b2Vec2(characterPosX, characterPosY), 0);
            physicalBody.SetLinearVelocity(new b2Vec2(0, 0));
            physicalBody.SetAngularVelocity(0);
        }
    });
}

function createArrow(layer) {

    var level = layer.getScene();
    var character = level.getLayer('characters').getNode('character');

    var arrowX = 200;
    var arrowY = 250;

    var node = new anima.Node('arrow');
    layer.addNode(node);

    var arrowWidth = 160;
    var arrowHeight = 77;
    node.setBackground(null, getImageUrl(layer.getScene(), 'arrow'), arrowWidth, arrowHeight);
    var spriteGrid = {
        rows:5,
        columns:6,
        totalSprites:30
    };
    node.setSpriteGrid(spriteGrid);
    node.setPosition({
        x:arrowX,
        y:arrowY
    });
    node.setOrigin({
        x:0.5,
        y:0.5
    });
    node.setAngle(anima.toRadians(40));

    var arrow = node;
    var totalSprites = spriteGrid.totalSprites;
    node.getCanvas().on('vdrag', function (event, vtype) {

        if (vtype == 'dragmove') {
            var pos = arrow.canvasPosition(event);
            var dx = pos.x - arrowX;
            var dy = pos.y - arrowY;
            var theta = Math.atan2(dx, dy);
            node.setAngle(theta - Math.PI / 2);

            var power = Math.max(0.0, Math.min(1.0, (Math.sqrt(dx * dx + dy * dy) - arrowWidth/2) / arrowWidth));
            arrow.setCurrentSprite(power * totalSprites);
            arrow.set('power', power * CHARACTER_IMPULSE);

            /**/
            debug(layer, ''
                + ' | scale:' + WORLD_SCALE.toFixed(1)
                + ' | mass:' + CHARACTER_MASS.toFixed(1)
                + ' | angle:' + anima.round(anima.toDegrees(theta - Math.PI / 2))
                + ' | impulse: ' + (power * CHARACTER_IMPULSE).toFixed(2) + ' (' + power.toFixed(2) + ')'
                + ' | gravity:' + GRAVITY.toFixed(2)
                + ' | damping:' + LINEAR_DAMPING.toFixed(2)
                + ' |');
            /**/
        } else if (vtype == 'dragend') {
            if (!character.getPhysicalBody().IsAwake()) {
                var animator = character.getAnimator();
                var animationId = animator.addAnimation(function (animator, t) {
                    var characterSprites = character.getSpriteGrid().totalSprites;
                    var index = t * characterSprites / 2000;
                    character.setCurrentSprite(index);
                }, 0, 2000);
                character.set('animationId', animationId);
                animator.addTask(function (loopTime) {
                    character.applyImpulse(arrow.getAngle(), arrow.get('power'));
                });
            }
        }
    });
}

function createLevel0() {

    var level = new anima.Level('level0', 2.0 * WORLD_SCALE, new b2Vec2(0, GRAVITY)); // 2m wide, gravity = 9.81 m/sec2
    canvas.addScene(level);
    level.setBackground('black', getImageUrl(level, 'background', 'jpg'));

    var layer;

    layer = new anima.Layer('environment');
    level.addLayer(layer);
    createCommode(layer);
    createPlatform(layer);

    layer = new anima.Layer('characters');
    level.addLayer(layer);
    createCharacter(layer);

    layer = new anima.Layer('gizmos');
    level.addLayer(layer);
    createArrow(layer);
    createDebugBox(layer);
}

$('#mainPage').live('pageshow', function (event, ui) {

    document.title = 'Game';

    $('#mainPage').trigger('updatelayout');
    anima.onResize();

    canvas.setCurrentScene('level0');
});

$(function () {

    canvas = new anima.Canvas('main-canvas');
    canvas.setBackground('black', null, 1575, 787);

    createLevel0();

    $('.ui-loader').css({
        'opacity':0.4,
        'overflow':'hidden',
        'top':'70%'
    });

    anima.start(
        function (percent) {
            var loadIcon$ = $('.ui-loader .ui-icon-loading');
            loadIcon$.html('' + percent);
        },
        function () {

            $.mobile.changePage($('#mainPage'), {
                transition:'fade',
                dataUrl:'#mainPage',
                changeHash:false
            });
            document.title = 'Game';
        });
});



