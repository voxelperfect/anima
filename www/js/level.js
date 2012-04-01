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
            true               // allow sleep
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
    }
});