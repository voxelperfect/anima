anima.Body = anima.Node.extend({

    init:function (id) {

        this._super(id);

        this._physicalSize = null;
        this._body = null;

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

        var me = this;

        var world = this._layer._scene._world;

        this._body = world.CreateBody(bodyDef);
        this._body.SetUserData({
            node:me
        });

        var level = this._layer._scene;
        this._position = {
            x:bodyDef.position.x * level._physicsScale,
            y:bodyDef.position.y * level._physicsScale
        }

        if (fixDef.shapeFile) {
            var file = fixDef.shapeFile;
            fixDef.shapeFile = null;

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

    isMoving:function () {

        var velocity = this._body.GetLinearVelocity();
        return velocity.Length() > 0.01;
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

        if (this._awakeListenerFn) {
            var awake = this._body.IsAwake();
            if (awake != this._wasAwake) {
                this._awakeListenerFn(this, awake);
            }
            this._wasAwake = awake;
        }
    },

    _pointToVector:function (point, scale) {

        var text = $(point).text();
        var components = text.split(',');
        var x = parseFloat(components[0].split('{')[1].trim());
        var y = parseFloat(components[1].split('}')[0].trim());

        return new b2Vec2(x / scale, -y / scale);
    },

    _toClockwise:function (points) {

        points.reverse();
        var last = points.pop();
        points.unshift(last);
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
            this._toClockwise(array);

            polygonShape = new b2PolygonShape();
            polygonShape.SetAsArray(array, array.length);
            fixDef.shape = polygonShape;

            this._body.CreateFixture(fixDef);
        }
    },

    _removeElement:function () {

        this._body.SetActive(false);
        this.hide();

        var level = this.getLevel();
        level._removeNodeWithLogic(this);
        level._removeDynamicBody(this);

        if (this._body) {
            var me = this;
            this._animator.addTask(function () {
                level.getWorld().DestroyBody(me._body);
                me._body = null;
            });
        }

        this._super();
    }
});