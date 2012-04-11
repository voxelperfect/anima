var canvas = null;

// http://www.hobistic.com/anima/deploy/index.html?scale=18.0&mass=2&impulse=14&gravity=7&damp=0.2&debug=true
var DEBUG = anima.getRequestParameter('debug');
var WORLD_SCALE = parseFloat(anima.getRequestParameter('scale', '18.0'));
var CHARACTER_MASS = parseFloat(anima.getRequestParameter('mass', '2.0'));
var CHARACTER_IMPULSE = parseFloat(anima.getRequestParameter('impulse', '14.0'));
var GRAVITY = parseFloat(anima.getRequestParameter('gravity', '7.0'));
var LINEAR_DAMPING = parseFloat(anima.getRequestParameter('damp', '0.2'));

function getImageUrl(level, imageName, extension) {

    if (!extension) {
        extension = 'png';
    }
    return 'resources/images/' + level.getId() + '/' + imageName + '.' + extension;
}

function debug(layer, message) {

    var node = layer.getScene().getLayer('gizmos').getNode('debugBox');
    node.getElement().html(message);
}

function createDebugBox(layer) {

    var node = new anima.Node('debugBox');
    layer.addNode(node);

    node.setBackground(null, null, layer.getScene().getSize().width, 30);
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

function createPlatformImage(layer, id, platformX, platformY) {

    var level = layer.getScene();

    var posX = platformX * level.getPhysicsScale();
    var posY = platformY * level.getPhysicsScale();

    var node = new anima.Node('image_' + id);
    layer.addNode(node);

    node.setBackground(null, getImageUrl(level, 'platform'), 213, 48);
    var spriteGrid = {
        rows:6,
        columns:6,
        totalSprites:35
    };
    node.setSpriteGrid(spriteGrid);
    node.setPosition({
        x:posX - 95,
        y:posY - 30
    });
    node.setOrigin({
        x:0.5,
        y:0.5
    });

    var bounceSound = new anima.Sound('bounce', 'resources/sounds/bounce.mp3');
    node.set('bounce', bounceSound);
}

function createPlatform(layer) {

    var level = layer.getScene();
    var levelHeight = level.getPhysicalSize().height;

    var posX = 0.53 * WORLD_SCALE;
    var posY = levelHeight - 0.31 * WORLD_SCALE;

    var body = new anima.Body('platform');
    layer.addNode(body);

    body.setBackground(null, null, 197, 22);
    var physicalSize = body.getPhysicalSize();
    body._physicalSize.height /= 2;

    var bodyDef = new b2BodyDef;
    bodyDef.type = b2Body.b2_staticBody;
    bodyDef.position.x = posX
    bodyDef.position.y = posY;

    var fixDef = new b2FixtureDef;
    fixDef.shape = new b2PolygonShape;
    fixDef.friction = 0.5;
    fixDef.restitution = 0.2;
    fixDef.shape.SetAsBox(physicalSize.width / 2, physicalSize.height / 2);

    body.define(bodyDef, fixDef);

    createPlatformImage(layer, 'platform', posX, posY);
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
    //bodyDef.fixedRotation = false;

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
        if (physicalBody.IsAwake()) {
            var center = physicalBody.GetWorldCenter();
            if (center.y < 0 || center.y > level.getPhysicalSize().height) {
                var animator = body.getAnimator();
                animator.endAnimation(body.get('animationId'));

                physicalBody.SetPositionAndAngle(new b2Vec2(characterPosX, characterPosY), 0);
                physicalBody.SetLinearVelocity(new b2Vec2(0, 0));
                physicalBody.SetAngularVelocity(0);

                var arrow = level.getLayer('gizmos').getNode('arrow');
                arrow.setAngle(anima.toRadians(40));
                var power = 0.0;
                arrow.set('power', power * CHARACTER_IMPULSE);
                arrow.setCurrentSprite(power * arrow.getTotalSprites());
                arrow.fadeIn();
            }
        }
    });

    var gaziaSound = new anima.Sound('gazia', 'resources/sounds/gazia.mp3');
    body.set('gazia', gaziaSound);
    var papakiaSound = new anima.Sound('sta_papakia', 'resources/sounds/sta_papakia_mas_re.mp3');
    body.set('sta_papakia', papakiaSound);
}

function animateCharacter(character) {

    var animator = character.getAnimator();

    var animationId = character.get('animationId');
    if (animationId) {
        animator.endAnimation(animationId);
    }

    animationId = animator.addAnimation(function (animator, t) {
        var characterSprites = character.getTotalSprites();
        var index = t * characterSprites / 2000;
        character.setCurrentSprite(index);
    }, 0, 2000);
    character.set('animationId', animationId);
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

            var power = Math.max(0.0, Math.min(1.0, (Math.sqrt(dx * dx + dy * dy) - arrowWidth / 2) / arrowWidth));
            arrow.setCurrentSprite(power * totalSprites);
            arrow.set('power', power * CHARACTER_IMPULSE);

            if (DEBUG) {
                debug(layer, ''
                    + ' | scale:' + WORLD_SCALE.toFixed(1)
                    + ' | mass:' + CHARACTER_MASS.toFixed(1)
                    + ' | angle:' + anima.round(anima.toDegrees(theta - Math.PI / 2))
                    + ' | impulse: ' + (power * CHARACTER_IMPULSE).toFixed(2) + ' (' + power.toFixed(2) + ')'
                    + ' | gravity:' + GRAVITY.toFixed(2)
                    + ' | damping:' + LINEAR_DAMPING.toFixed(2)
                    + ' |');
            }
        } else if (vtype == 'dragend') {
            if (!character.getPhysicalBody().IsAwake()) {
                arrow.fadeOut();

                var animator = character.getAnimator();
                animateCharacter(character);
                animator.addTask(function (loopTime) {
                    character.get('sta_papakia').play();
                    character.applyImpulse(arrow.getAngle(), arrow.get('power'));
                });
                var platformImage = level.getLayer('environment').getNode('image_platform');
                animator.addAnimation(function (animator, t) {
                    if (t == 0) {
                        platformImage.get('bounce').play();
                    }
                    var platformSprites = platformImage.getTotalSprites();
                    var index = t * platformSprites / 1000;
                    platformImage.setCurrentSprite(index);
                }, 0, 1000);
            }
        }
    });
}

function createSkorosPouf(layer, id, skorosX, skorosY) {

    var level = layer.getScene();

    var poufX = skorosX * level.getPhysicsScale();
    var poufY = skorosY * level.getPhysicsScale();

    var node = new anima.Node('pouf_' + id);
    layer.addNode(node);

    var poufidth = 100;
    var poufHeight = 100;
    node.setBackground(null, getImageUrl(layer.getScene(), 'pouf'), poufidth, poufHeight);
    var spriteGrid = {
        rows:3,
        columns:5,
        totalSprites:14
    };
    node.setSpriteGrid(spriteGrid);
    node.setPosition({
        x:poufX,
        y:poufY
    });
    node.setOrigin({
        x:0.5,
        y:0.5
    });

    node.hide();
}

function createSkoros(layer, id, posX, posY, animationOffset) {

    var level = layer.getScene();
    var levelHeight = level.getPhysicalSize().height;

    var body = new anima.Body(id);
    layer.addNode(body);

    body.setBackground(null, getImageUrl(level, 'skoros'), 100, 100);
    var physicalSize = body.getPhysicalSize();
    body.setPhysicalSize({
        width:physicalSize.width / 3,
        height:physicalSize.height
    });
    body.setSpriteGrid({
        row:7,
        columns:8,
        totalSprites:50
    });
    var physicalSize = body.getPhysicalSize();

    var bodyDef = new b2BodyDef;
    bodyDef.type = b2Body.b2_staticBody;
    bodyDef.allowSleep = true;
    bodyDef.position.x = posX;
    bodyDef.position.y = posY;
    bodyDef.fixedRotation = false;

    var fixDef = new b2FixtureDef;
    fixDef.mass = 1.0;
    fixDef.friction = 0.5;
    fixDef.restitution = 0.2;
    fixDef.svgPoints = [
        {x:248.718, y:346.851},
        {x:264.129, y:312.945},
        {x:294.953, y:312.945},
        {x:314.988, y:354.557},
        {x:302.659, y:434.698},
        {x:261.047, y:443.945},
        {x:241.012, y:400.792}
    ];
    body.define(bodyDef, fixDef);

    var animator = body.getAnimator();
    var moveId = animator.addAnimation(function (animator, t) {
//        if (t == 0) {
//            body.get('laugh').play();
//        }
        var characterSprites = body.getTotalSprites();
        var index = t * characterSprites / 2000;
        body.setCurrentSprite(index);
    }, animationOffset, 2000, null, null, true);
    body.set('moveId', moveId);

    createSkorosPouf(layer, id, posX - 1.5 * physicalSize.width, posY - 0.2 * physicalSize.height);

    var boomSound = new anima.Sound(id + 'boom', 'resources/sounds/boom.mp3');
    body.set('boom', boomSound);
    var laughSound = new anima.Sound(id + '_laugh', 'resources/sounds/laugh.mp3');
    body.set('laugh', laughSound);
}

function createObstacle(layer, id, imageFile, points, size, posX, posY) {

    var level = layer.getScene();
    var levelHeight = level.getPhysicalSize().height;

    var body = new anima.Body(id);
    layer.addNode(body);

    body.setBackground(null, getImageUrl(level, imageFile), size.width, size.height);
    var physicalSize = body.getPhysicalSize();

    var bodyDef = new b2BodyDef;
    bodyDef.type = b2Body.b2_staticBody;
    bodyDef.allowSleep = true;
    bodyDef.position.x = posX;
    bodyDef.position.y = posY;

    var fixDef = new b2FixtureDef;
    fixDef.mass = CHARACTER_MASS;
    fixDef.friction = 0.5;
    fixDef.restitution = 0.2;
    fixDef.svgPoints = points
    body.define(bodyDef, fixDef);

    var boomSound = new anima.Sound(id + '_boom', 'resources/sounds/boom.mp3');
    body.set('boom', boomSound);
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
    createSkoros(layer, 'skoros-1', 1.5 * WORLD_SCALE, 0.5 * WORLD_SCALE, 0);
    createSkoros(layer, 'skoros-2', 1.8 * WORLD_SCALE, 0.6 * WORLD_SCALE, 1200);
    createSkoros(layer, 'skoros-3', 1.4 * WORLD_SCALE, 0.8 * WORLD_SCALE, 600);
    createObstacle(layer, 'sock', 'sock', [
        {x:679.75, y:392.162},
        {x:619.111, y:451.844},
        {x:592.373, y:429.88},
        {x:623.887, y:379.746},
        {x:620.066, y:280.453},
        {x:675.444, y:279}
    ], {
        width:78,
        height:169
    }, 1.0 * WORLD_SCALE, 0.2 * WORLD_SCALE);
    createObstacle(layer, 'tie', 'tie', [
        {x:645, y:442.979},
        {x:594, y:391},
        {x:628, y:316},
        {x:600, y:279},
        {x:696, y:278},
        {x:663, y:315},
        {x:680.99, y:412}
    ], {
        width:81,
        height:165
    }, 1.0 * WORLD_SCALE, 0.55 * WORLD_SCALE);
    createObstacle(layer, 'slip', 'slip', [
        {x:227, y:453.379},
        {x:227, y:382.89},
        {x:368, y:382.89},
        {x:368, y:449.171},
        {x:329, y:483.89},
        {x:266, y:483.89}
    ], {
        width:146,
        height:108
    }, 1.0 * WORLD_SCALE, 0.85 * WORLD_SCALE);

    layer = new anima.Layer('gizmos');
    level.addLayer(layer);
    createArrow(layer);
    createDebugBox(layer);

    level.setContactListener(function (bodyA, bodyB) {

        var idA = bodyA.getId();
        var idB = bodyB.getId();

        if (idA == 'character' && idB == 'platform') {
            animateCharacter(bodyA);
            bodyA.get('gazia').play();
            return;
        }

        if (idA == 'character' && (idB == 'sock' || idB == 'tie' || idB == 'slip')) {
            bodyB.get('boom').play();
            bodyB.fadeOut(400, function () {
                bodyB.hide();
                var physicalBody = bodyB.getPhysicalBody();
                physicalBody.SetActive(false);
                level.getWorld().DestroyBody(physicalBody);
            });
        }

        if (idA == 'character' && idB.startsWith('skoros')) {
            var animator = bodyB.getAnimator();
            if (bodyB.get('hits')) {
                if (bodyB.get('hits') == 1) {
                    bodyB.set('hits', 2);

                    bodyB.get('boom').play();

                    var pouf = bodyB.getLayer().getNode('pouf_' + bodyB.getId());
                    pouf.show();
                    animator.endAnimation(bodyB.get('pulseId'));
                    animator.endAnimation(bodyB.get('moveId'));
                    bodyB.fadeOut(1000);

                    animator.addAnimation(function (animator, t) {
                        var characterSprites = pouf.getTotalSprites();
                        var index = t * characterSprites / 1000;
                        pouf.setCurrentSprite(index);
                    }, 0, 1000, null, function (animation) {
                        pouf.hide();
                        var physicalBody = bodyB.getPhysicalBody();
                        physicalBody.SetActive(false);
                        level.getWorld().DestroyBody(physicalBody);
                    });
                }
            } else {
                bodyB.set('hits', 1);

                bodyB.get('boom').play();

                var pulseAnimationId = animator.addAnimation(function (animator, t) {
                    var value = animator.interpolate(0.0, 1.0, t);
                    var opacity = (value < 0.5) ? 1.0 - 2 * value : 2 * value - 1;
                    bodyB.getElement().css('opacity', opacity);
                }, 0, 1000, anima.Easing.easeInOutSine, null, true);
                bodyB.set('pulseId', pulseAnimationId);
            }
        }
    });
}

$('#mainPage').live('pageshow', function (event, ui) {

    document.title = 'Game';

    $('#mainPage').trigger('updatelayout');
    anima.onResize();

    $.mobile.hidePageLoadingMsg();

    var canvasSize = canvas.getSize();
    var x0 = 0.20 * canvasSize.width;
    var y0 = 0.44 * canvasSize.height;
    var level = canvas.getScene('level0');
    level.setViewport({
        x1:x0,
        y1:y0,
        x2:x0 + 300,
        y2:y0 + 300
    });
    canvas.setCurrentScene('level0', 500, function () {
        level.setViewport(null, 2000);
    });
});

$(function () {

    canvas = new anima.Canvas('main-canvas', DEBUG);
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
            $.mobile.showPageLoadingMsg();
            $.mobile.changePage($('#mainPage'), {
                transition:'fade',
                dataUrl:'#mainPage',
                changeHash:false
            });
            document.title = 'Game';
        });
});



