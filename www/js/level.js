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

        this._beginContactListenerFn = null;
        this._registerContactListener();
    },

    setSize:function (postponeTransform) {

        this._super(postponeTransform);

        this._physicsScale = this._size.width / this._physicalSize.width;
        this._physicalSize.height = this._size.height * this._physicalSize.width / this._size.width;

        if (this._canvas._debug) {
            var debugDraw = new b2DebugDraw();
            debugDraw.SetSprite(this._renderer.getHtml5CanvasContext(this._canvas));
            debugDraw.SetDrawScale(this._physicsScale);
            debugDraw.SetFillAlpha(0.5);
            debugDraw.SetLineThickness(1.0);
            debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit | b2DebugDraw.e_centerOfMassBit);

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

    setContactListener:function (beginContactListenerFn) {

        this._beginContactListenerFn = beginContactListenerFn;
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

        if (node.logic) {
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
            if (node.logic) {
                node.logic();
            }
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
                node._update();
            }
        }
    },

    _registerContactListener:function () {

        var me = this;

        var listener = new Box2D.Dynamics.b2ContactListener;

        listener.BeginContact = function (contact) {

            var bodyA = contact.GetFixtureA().GetBody().GetUserData().node;
            var bodyB = contact.GetFixtureB().GetBody().GetUserData().node;

            if (bodyA.onBeginContact) {
                bodyA.onBeginContact(bodyB);
            }
            if (bodyB.onBeginContact) {
                bodyB.onBeginContact(bodyA);
            }

            if (me._beginContactListenerFn) {
                me._beginContactListenerFn(bodyA, bodyB);
            }
        };

        listener.EndContact = function (contact) {

        };

        listener.PostSolve = function (contact, impulse) {

        };

        listener.PreSolve = function (contact, oldManifold) {

        };

        this._world.SetContactListener(listener);
    }
});