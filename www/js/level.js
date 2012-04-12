anima.Level = anima.Scene.extend({

    init:function (id, physicalWidth, gravity) {

        this._super(id);

        this._physicalSize = {
            width:physicalWidth,
            height:null
        };
        this._physicsScale = 1.0;

        this._world = new b2World(
            gravity, // gravity
            true  // allow sleep
        );

        this._nodesWithLogic = [];
        this._dynamicBodies = [];
    },

    setBackground:function (color, url, postponeTransform) {

        this._super(color, url, postponeTransform);

        this._physicsScale = this._size.width / this._physicalSize.width;
        this._physicalSize.height = this._size.height * this._physicalSize.width / this._size.width;

        if (this._canvas._debug) {
            var debugDraw = new b2DebugDraw();
            debugDraw.SetSprite(this._renderer.getHtml5CanvasContext(this._canvas));
            debugDraw.SetDrawScale(this._physicsScale);
            debugDraw.SetFillAlpha(0.5);
            debugDraw.SetLineThickness(1.0);
            debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit); // | b2DebugDraw.e_centerOfMassBit);

            this._world.SetDebugDraw(debugDraw);
        }
    },

    getWorld:function () {

        return this._world;
    },

    getPhysicsScale:function () {

        return this._physicsScale;
    },

    getPhysicalSize:function () {

        return this._physicalSize;
    },

    setContactListener:function (onBeginContactFn, onEndContact, onPreSolveFn, OnPostSolveFn) {

        var me = this;

        var listener = new Box2D.Dynamics.b2ContactListener;

        listener.BeginContact = function (contact) {

            var bodyA = contact.GetFixtureA().GetBody().GetUserData().node;
            var bodyB = contact.GetFixtureB().GetBody().GetUserData().node;
            onBeginContactFn(bodyA, bodyB);
        };

        listener.EndContact = function (contact) {

        };

        listener.PostSolve = function (contact, impulse) {

        };

        listener.PreSolve = function (contact, oldManifold) {

        };

        this._world.SetContactListener(listener);
    },

    isAwake:function () {

        var node;
        for (var id in this._dynamicBodies) {
            node = this._dynamicBodies[id];
            if (node._body.IsAwake()) {
                return true;
            }
        }

        return false;
    },

    /* internal methods */

    _addNodeWithLogic:function (node) {

        if (node._logicFn) {
            this._nodesWithLogic[this._renderer.getElementId(node)] = node;
        }
    },

    _removeNodeWithLogic:function (node) {

        delete this._nodesWithLogic[this._renderer.getElementId(node)];
    },

    _logic:function () {

        var node;
        for (var id in this._nodesWithLogic) {
            node = this._nodesWithLogic[id];
            node._checkAwake();
            node._logicFn(node);
        }
    },

    _addDynamicBody:function (node) {

        if (node._body && node._body.GetType() == b2Body.b2_dynamicBody) {
            this._dynamicBodies[this._renderer.getElementId(node)] = node;
        }
    },

    _removeDynamicBody:function (node) {

        delete this._dynamicBodies[this._renderer.getElementId(node)];
    },

    _update:function () {

        var node;
        for (var id in this._dynamicBodies) {
            node = this._dynamicBodies[id];
            if (node._body.IsAwake()) {
                this._updateBody(node);
            }
        }
    },

    _updateBody:function (node) {

        var center = node._body.GetWorldCenter();
        node._position.x = (center.x /* + node._centroidOffset.x */) * this._physicsScale;
        node._position.y = (center.y /* + node._centroidOffset.y */) * this._physicsScale;

        node._angle = -node._body.GetAngle();

        this._renderer.updateAll(node);
    }
});