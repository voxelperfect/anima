anima.Body = new Class({
    Extends:anima.Node,

    _physicalSize:null,
    _body:null,

    _centroidOffset:null,

    initialize:function (id, physicalSize) {

        this.parent(id);

        this._physicalSize = anima.clone(physicalSize);
    },

    setBackground:function (color, url, width, height) {

        this.parent(color, url, width, height, true);

        var level = this._layer._scene;
        var proportionalWidth = this._physicalSize.width * level.getPhysicsScale();
        var scale = proportionalWidth / this._size.width;

        this.setScale({
            x:scale,
            y:scale
        });
    },

    define:function (bodyDef, fixDef) {

        var world = this._layer._scene._world;

        this._body = world.CreateBody(bodyDef);
        this._body.SetUserData({
            node:this
        });

        this._body.CreateFixture(fixDef);

        var level = this._layer._scene;
        this._position = {
            x:bodyDef.position.x * level._physicsScale,
            y:bodyDef.position.y * level._physicsScale
        }

        this._calculateCentroidOffset();

        this._renderer.updateAll(this);
    },

    getPhysicalSize:function () {

        return anima.clone(this._physicalSize);
    },

    applyImpulse:function (degrees, power) {

        this._body.ApplyImpulse(new b2Vec2(Math.cos(degrees * (Math.PI / 180)) * power,
            Math.sin(degrees * (Math.PI / 180)) * power),
            this._body.GetWorldCenter());
    },

    /* internal methods */

    _calculateShapeSize:function (shapePoints) {

        var MAX = 100000.0;

        var x, y;
        var minX = MAX, maxX = -MAX;
        var minY = MAX, maxY = -MAX;

        var count = shapePoints.length;
        for (var i = 0; i < count; i++) {
            x = shapePoints[i].x;
            if (x > maxX) {
                maxX = x;
            }
            if (x < minX) {
                minX = x;
            }

            y = shapePoints[i].y;
            if (y > maxY) {
                maxY = y;
            }
            if (y < minY) {
                minY = y;
            }
        }

        return {
            width:maxX - minX,
            height:maxY - minY
        }
    },

    _calculateShapeScale:function (shapePoints, physicalShapeWidth, physicalShapeHeight) {

        var shapeSize = this.calculateShapeSize(shapePoints);

        var requiredShapeSize = {
            width:physicalShapeWidth * this.physicsScale,
            height:physicalShapeHeight * this.physicsScale
        };

        return shapeSize.width / requiredShapeSize.width;
    },

    _svgToShape:function (shapePoints, physicalShapeWidth, physicalShapeHeight) {

        var shapeScale = this.calculateShapeScale(shapePoints, physicalShapeWidth, physicalShapeHeight);

        var x, y;
        var i;

        var tempShape = new b2PolygonShape;
        var vectors = [];
        var count = shapePoints.length;
        for (i = 0; i < count; i++) {
            x = shapePoints[i].x / shapeScale;
            y = shapePoints[i].y / shapeScale;
            vectors.push(new b2Vec2(x, y));
        }
        tempShape.SetAsArray(vectors, vectors.length);
        var centroid = tempShape.m_centroid;
        var vertices = tempShape.m_vertices;

        var shape = new b2PolygonShape;
        vectors = [];
        for (i = 0; i < count; i++) {
            x = (vertices[i].x - centroid.x) / this.physicsScale;
            y = (vertices[i].y - centroid.y) / this.physicsScale;
            vectors.push(new b2Vec2(x, y));
        }
        shape.SetAsArray(vectors, vectors.length);

        return shape;
    },

    _calculateCentroidOffset:function () {

        var aabb = this._body.GetFixtureList().GetAABB();
        var centroid = aabb.GetCenter();

        var center = this._body.GetWorldCenter();
        this._centroidOffset = {
            x:centroid.x - center.x,
            y:centroid.y - center.y
        }

        this._origin = {
            x:(center.x - aabb.lowerBound.x) / this._physicalSize.width,
            y:(center.y - aabb.lowerBound.y) / this._physicalSize.height
        }
    }
});