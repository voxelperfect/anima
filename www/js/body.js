anima.Body = anima.Node.extend({

    init:function (id) {

        this._super(id);

        this._physicalSize = null;
        this._body = null;

        this._logicFn = null;

        this._wasAwake = false;
        this._awakeListenerFn = null;

        this._origin.x = 0.5;
        this._origin.y = 0.5;
    },

    setSize:function (width, height) {

        this._super(width, height, true);

        var level = this._layer._scene;
        var ps = level.getPhysicsScale();
        this._physicalSize = {
            width:this._size.width / ps,
            height:this._size.height / ps
        };
    },

    define:function (bodyDef, fixDef) {

        var world = this._layer._scene._world;

        this._body = world.CreateBody(bodyDef);
        this._body.SetUserData({
            node:this
        });

        var level = this._layer._scene;
        this._position = {
            x:bodyDef.position.x * level._physicsScale,
            y:bodyDef.position.y * level._physicsScale
        }

        if (fixDef.shapeFile) {
            var file = fixDef.shapeFile;
            fixDef.shapeFile = null;

            var me = this;
            anima.loadXML(file, function (data$) {
                me._createShapes(data$, fixDef);

                me._update();
                me._renderer.updateAll(me);

            });
        } else {
            this._body.CreateFixture(fixDef);

            this._update();
            this._renderer.updateAll(this);
        }

        level._addDynamicBody(this);
    },

    getLevel:function () {

        return this._layer._scene;
    },

    setLogic:function (logicFn) {

        this._logicFn = logicFn;
        if (logicFn) {
            this.getLevel()._addNodeWithLogic(this);
        } else {
            this.getLevel()._removeNodeWithLogic(this);
        }
    },

    getLogic:function () {

        return this._logicFn;
    },

    getPhysicalBody:function () {

        return this._body;
    },

    getPhysicalSize:function () {

        return this._physicalSize;
    },

    setPhysicalSize:function (physicalSize) {

        this._physicalSize = anima.clone(physicalSize);
    },

    applyImpulseVector:function (vector, point) {

        if (!point) {
            point = this._body.GetWorldCenter();
        }
        this._body.ApplyImpulse(vector, point);
    },

    applyForceVector:function (vector, point) {

        if (!point) {
            point = this._body.GetWorldCenter();
        }
        this._body.ApplyForce(vector, point);
    },

    applyImpulse:function (angle, power) {

        if (!power || power == 0.0) {
            return;
        }

        this._body.ApplyImpulse(
            new b2Vec2(Math.cos(angle) * power, Math.sin(angle) * power),
            this._body.GetWorldCenter());
    },

    setAngle:function (angle) {

        this._super(angle);

        this._body.SetAngle(-angle);
    },

    getAABB:function () {

        return this._body.GetFixtureList().GetAABB();
    },

    setAwakeListener:function (listenerFn) {

        this._awakeListenerFn = listenerFn;
    },

    /* internal methods */

    _update:function () {

        var level = this._layer._scene;

        var center = this._body.GetPosition();
        this._position.x = center.x * level._physicsScale;
        this._position.y = center.y * level._physicsScale;

        this._angle = -this._body.GetAngle();

        this._renderer.updateTransform(this);
    },

    _checkAwake:function () {

        var awake = this._body.IsAwake();
        if (awake != this._wasAwake && this._awakeListenerFn) {
            this._awakeListenerFn(this, awake);
        }
        this._wasAwake = awake;

        return awake;
    },

    _pointToVector:function (point, scale) {

        var text = $(point).text();
        var components = text.split(',');
        var x = parseFloat(components[0].split('{')[1].trim());
        var y = parseFloat(components[1].split('}')[0].trim());

        return new b2Vec2(x / scale, -y / scale);
    },

    _createShapes:function (data$, fixDef) {

        var level = this._layer._scene;
        var scale = level.getPhysicsScale();

        var polygonSets = data$.find('plist > dict :nth-child(4) > dict :nth-child(4) dict > array').children();

        var s, p, points, polygonShape, array;
        for (s = 0; s < polygonSets.length; s++) {
            array = [];
            points = $(polygonSets[s]).children();
            for (p = 0; p < points.length; p++) {
                array.push(this._pointToVector(points[p], scale));
            }

            polygonShape = new b2PolygonShape();
            polygonShape.SetAsArray(array, array.length);
            fixDef.shape = polygonShape;

            this._body.CreateFixture(fixDef);
        }
    },

    _removeElement:function () {

        this.getLevel()._removeNodeWithLogic(this);
        this.getLevel()._removeDynamicBody(this);
        this._super();
    }
});