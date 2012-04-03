anima.Level = new Class({
    Extends:anima.Scene,

    _physicalSize:null,
    _physicsScale:1.0,

    _world:null,

    initialize:function (id, physicalWidth, gravity) {

        this.parent(id);

        this._physicalSize = {
            width:physicalWidth,
            height:null
        }

        this._world = new b2World(
            gravity, // gravity
            true  // allow sleep
        );
    },

    setBackground:function (color, url, postponeTransform) {

        this.parent(color, url, postponeTransform);

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

        return anima.clone(this._physicalSize);
    },

    /* internal methods */

    _logic:function () {

        var layer, node;
        var count = this._layers.length;
        for (var i = 0; i < count; i++) {
            layer = this._layers[i];
            for (var j = 0; j < layer._nodes.length; j++) {
                node = layer._nodes[j];
                if (node._logicFn) {
                    node._logicFn(node);
                }
            }
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
        node._position.x = (center.x + node._centroidOffset.x) * this._physicsScale;
        node._position.y = (center.y + node._centroidOffset.y) * this._physicsScale;

        node._angle = node._body.GetAngle();

        this._renderer.updateAll(node);
    }

});