anima.ext.ScoreDisplay = Class.extend({

    init:function (level, config) {

        this._spriteSheet = config.spriteSheet;
        this._spriteGrid = config.spriteGrid;

        this._digitWidth = config.digitWidth;
        this._digitHeight = config.digitHeight;
        this._digitGap = config.digitGap;
        this._digitCount = config.digitCount;

        if (!config.posX) {
            this._calculatePosition(level);
        } else {
            this._posX = config.posX;
            this._posY = config.posY;
        }

        this._createDisplay(level, config.layerId);

        this._currentScore = 0;
    },

    getLayer:function () {

        return this._layer;
    },

    setScore:function (score) {

        var scoreStr = score.toFixed();

        var i;

        var scoreDigitCount = scoreStr.length;
        if (scoreDigitCount < this._digitCount) {
            for (i = 0; i < this._digitCount - scoreDigitCount; i++) {
                scoreStr = ' ' + scoreStr;
            }
        }

        var digit;
        for (i = 0; i < this._digitCount; i++) {
            digit = scoreStr.charAt(i);
            if (digit == ' ') {
                this._digits[i].setCurrentSprite(11);
            } else {
                this._digits[i].setCurrentSprite(parseInt(digit));
            }
        }

        this._currentScore = score;
    },

    getScore:function () {

        return this._currentScore;
    },

    addScore:function (points) {

        var increment = 10;
        var steps = points / increment;
        var duration = 100 * steps;

        var animator = this._layer.getAnimator();
        animator.addAnimation({
            interpolateValuesFn:function (animator, t, data) {
                var newPoints = data.increment;
                if (data.pointsAdded + newPoints > data.pointsToAdd) {
                    newPoints = data.pointsToAdd - data.pointsAdded;
                }

                var display = data.display;
                display.setScore(display._currentScore + newPoints);

                data.pointsAdded += newPoints;
            },
            duration:duration,
            data:{
                pointsToAdd:points,
                pointsAdded:0,
                increment:increment,
                duration:duration,
                display:this
            }}, 'add-score');
    },

    /* internal methods */

    _calculatePosition:function (level) {

        var displaySize = (this._digitWidth + this._digitGap) * this._digitCount;
        var x = level.getSize().width - displaySize - this._digitWidth;
        this._posX = x;
        this._posY = 0;
    },

    _createDisplay:function (level, layerId) {

        this._layer = new anima.Layer(layerId);
        level.addLayer(this._layer);

        this._digits = [];

        var id;
        var x = this._posX;
        var y = this._posY;
        for (var i = 0; i < this._digitCount; i++) {
            id = 'score_digit_' + i;
            this._digits.push(this._createDigit(this._layer, id, x, y));
            x += this._digitWidth + this._digitGap;
        }
    },

    _createDigit:function (layer, id, posX, posY) {

        var level = layer.getScene();

        var node = new anima.Node('score_' + id);
        layer.addNode(node);

        node.setBackground(null, this._spriteSheet, this._digitWidth, this._digitHeight);
        node.setSpriteGrid(this._spriteGrid);
        node.setPosition({
            x:posX,
            y:posY
        });
        node.setOrigin({
            x:0.0,
            y:0.0
        });

        return node;
    }
});