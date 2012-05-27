anima.ext.ScoreDisplay = Class.extend({

    init:function (level, config) {

        this._spriteSheetUrl = config.spriteSheetUrl;
        this._spriteSheet = config.spriteSheet;

        this._digitWidth = config.digitWidth;
        this._digitHeight = config.digitHeight;
        this._digitGap = config.digitGap;
        this._digitCount = config.digitCount;

        if (config.digitAnimation) {
            this._digitAnimation = anima.clone(config.digitAnimation);
        } else {
            this._digitAnimation = {
                duration:300,
                frameCount:1
            }
        }

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

        var frameCount = this._digitAnimation.frameCount;
        var duration = this._digitAnimation.duration;

        var digit, digitNode;
        for (i = 0; i < this._digitCount; i++) {
            digit = scoreStr.charAt(i);
            digitNode = this._digits[i];
            if (digit == ' ') {
                digitNode.setCurrentSprite(11 * frameCount);
            } else {
                var startFrame = parseInt(digit) * frameCount;
                if (frameCount == 1) {
                    digitNode.setCurrentSprite(startFrame);
                } else {
                    //var endFrame = startFrame + frameCount - 1;
                    //digitNode.animateSpriteSheet(startFrame + 1, endFrame, duration, function () {
                    digitNode.setCurrentSprite(startFrame);
                    //}, 'add-score-digits');
                }
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

        var data = {
            pointsToAdd:points,
            pointsAdded:0,
            increment:increment,
            duration:duration,
            display:this
        };

        var animator = this._layer.getAnimator();
        animator.addAnimation({
            interpolateValuesFn:this._scoreInterpolator,
            duration:duration
        }, 'add-score', data);
    },

    /* internal methods */

    _scoreInterpolator:function (animator, t, animation) {

        var data = animation.data;
        var newPoints = data.increment;
        if (data.pointsAdded + newPoints > data.pointsToAdd) {
            newPoints = data.pointsToAdd - data.pointsAdded;
        }

        var display = data.display;
        display.setScore(display._currentScore + newPoints);

        data.pointsAdded += newPoints;
    },

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

        node.setSize(this._digitWidth, this._digitHeight);
        node.addBackground(null, this._spriteSheetUrl, this._spriteSheet);
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