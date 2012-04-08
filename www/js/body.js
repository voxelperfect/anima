anima.Body = anima.Node.extend({

    _physicalSize:null,
    _body:null,

    _centroidOffset:null,

    _logicFn:null,

    init:function (id) {

        this._super(id);
    },

    setBackground:function (color, url, width, height) {

        this._super(color, url, width, height, true);

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

        if (fixDef.svgPoints) { // from a tracing tool (e.g. Adobe Illustrator)
            fixDef.shape = this._svgToShape(fixDef.svgPoints);

            fixDef.svgPoints = null;
            this._body.CreateFixture(fixDef);
        } else if (fixDef.polyPoints) { // from Physics Editor
            this._createPolygonShapes(fixDef);
        } else {
            this._body.CreateFixture(fixDef);
        }

        var level = this._layer._scene;
        this._position = {
            x:bodyDef.position.x * level._physicsScale,
            y:bodyDef.position.y * level._physicsScale
        }

        this._calculateCentroidOffset();

        this._renderer.updateAll(this);
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

    applyImpulse:function (angle, power) {

        this._body.ApplyImpulse(
            new b2Vec2(Math.cos(angle) * power, Math.sin(angle) * power),
            this._body.GetWorldCenter());
    },

    /* internal methods */

    _createPolygonShapes:function (fixDef) {

        var level = this._layer._scene;

        var s, p, polygons, polygonShape;

        var polygonSets = fixDef.polyPoints;
        for (s = 0; s < polygonSets.length; s++) {
            polygons = polygonSets[s];
            for (p = 0; p < polygons.length; p++) {
                polygonShape = new b2PolygonShape();
                polygonShape.SetAsArray(polygons[p], polygons[p].length);
                fixDef.shape = polygonShape;

                this._body.CreateFixture(fixDef);
            }
        }
        fixDef.polyPoints = null;
    },

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

    _calculateShapeScale:function (shapePoints) {

        var level = this._layer._scene;

        var shapeSize = this._calculateShapeSize(shapePoints);

        var requiredShapeSize = {
            width:this._physicalSize.width * level._physicsScale,
            height:this._physicalSize.height * level._physicsScale
        };

        return shapeSize.width / requiredShapeSize.width;
    },

    _svgToShape:function (shapePoints) {

        var level = this._layer._scene;

        var shapeScale = this._calculateShapeScale(shapePoints);

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
            x = (vertices[i].x - centroid.x) / level._physicsScale;
            y = (vertices[i].y - centroid.y) / level._physicsScale;
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
    },

    _removeElement:function () {

        this.getLevel()._removeNodeWithLogic(this);
        this._super();
    }
});