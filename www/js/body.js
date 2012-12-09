/*
 * Copyright 2012 Kostas Karolemeas
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

anima._destroyBodyTask = function (animator, animation) {

    var data = animation.data;
    data.level.getWorld().DestroyBody(data.node._body);
    data.node._body = null;
};

anima.Body = anima.Node.extend({

    init:function (id) {

        this._super(id);

        this._physicalSize = null;
        this._body = null;

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
            id:this.getId()
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

        this.hide();
        this._body.SetActive(false);

        var level = this.getLevel();
        level._removeNodeWithLogic(this);
        level._removeDynamicBody(this);

        if (this._body) {
            this._animator.addTask(anima._destroyBodyTask, null, {
                level:level,
                node:this
            });
        }

        this._super();
    }
});
