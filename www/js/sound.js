anima.Sound = new Class({

    _sound:null,
    _loop: false,

    initialize:function (id, url, loop) {

        this._sound = soundManager.createSound({
            id:'music',
            url:'resources/sounds/music.mp3',
            autoload: true
        });

        this._loop = loop;
    },

    toggle:function () {
        if (this.isPlaying()) {
            this.stop();
            return false;
        } else {
            this.play();
            return true;
        }
    },

    isPlaying: function() {

        return this._sound.playState;
    },

    stop: function() {

        this._sound.stop();
    },

    play: function() {

        var options = {};
        if (this._loop) {
            options.onfinish = this.play;
        }

        this._sound.play(options);
    },

    pause: function() {

        this._sound.pause();
    }
});