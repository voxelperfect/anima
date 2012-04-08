anima.Level = anima.Scene.extend({

    _physicalSize:null,
    _physicsScale:1.0,

    _world:null,

    _nodesWithLogic:null,

    init:function (id, physicalWidth, gravity) {

        this._super(id);

        this._physicalSize = {
            width:physicalWidth,
            height:null
        }

        this._world = new b2World(
            gravity, // gravity
            true  // allow sleep
        );

        this._nodesWithLogic = [];
    },

    setBackground:function (color, url, postponeTransform) {

        this._super(color, url, postponeTransform);

        this._physicsScale = this._size.width / this._physicalSize.width;
        this._physicalSize.height = this._size.height * this._physicalSize.width / this._size.width;
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

    setContactListener:function (listenerFn) {

        var me = this;

        var listener = new Box2D.Dynamics.b2ContactListener;

        listener.BeginContact = function (contact) {

            var bodyA = contact.GetFixtureA().GetBody().GetUserData().node;
            var bodyB = contact.GetFixtureB().GetBody().GetUserData().node;
            listenerFn(bodyA, bodyB);
        };

        listener.EndContact = function (contact) {

        };

        listener.PostSolve = function (contact, impulse) {

        };

        listener.PreSolve = function (contact, oldManifold) {

        };

        this._world.SetContactListener(listener);
    },

    /* internal methods */

    _addNodeWithLogic: function(node) {

        this._nodesWithLogic[this._renderer.getElementId(node)] = node;
    },

    _removeNodeWithLogic: function(node) {

        delete this._nodesWithLogic[this._renderer.getElementId(node)];
    },

    _logic:function () {

        var node;
        for (var id in this._nodesWithLogic) {
            node = this._nodesWithLogic[id];
            node._logicFn(node);
        }
    },

    _update:function () {

        var layer, node;
        var count = this._layers.length;
        for (var i = 0; i < count; i++) {
            layer = this._layers[i];
            for (var j = 0; j < layer._nodes.length; j++) {
                node = layer._nodes[j];
                if (node._body
                    && node._body.IsAwake()
                    && node._body.GetType() == b2Body.b2_dynamicBody) {

                    this._updateBody(node);
                }
            }
        }
    },

    _updateBody:function (node) {

        var center = node._body.GetWorldCenter();
        node._position.x = (center.x /* + node._centroidOffset.x */) * this._physicsScale;
        node._position.y = (center.y /* + node._centroidOffset.y */) * this._physicsScale;

        node._angle = node._body.GetAngle();

        this._renderer.updateAll(node);
    }

});