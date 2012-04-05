anima.Sound = new Class({

    _sound:null,
    _loop:false,

    initialize:function (id, url, loop) {

        if (window.soundManager != undefined) {
            this._sound = soundManager.createSound({
                id:'music',
                url:'resources/sounds/music.mp3',
                autoload:true
            });

            this._loop = loop;
        }
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

    isPlaying:function () {

        return this._sound ? this._sound.playState : false;
    },

    stop:function () {

        if (this._sound) {
            this._sound.stop();
        }
    },

    play:function () {

        if (this._sound) {
            var options = {};
            if (this._loop) {
                options.onfinish = function () {
                    this.play();
                }
            }

            this._sound.play(options);
        }
    },

    pause:function () {

        if (this._sound) {
            this._sound.pause();
        }
    }
});

anima._initializeSound = function (callback) {

    window.SM2_DEFER = true;

    anima.getScript('js/lib/soundmanager2-nodebug.js', // 'js/lib/soundmanager2-nodebug-jsmin.js',
        {
            "success":function (data, textStatus, jqXHR) {

                try {
                    window.soundManager = new SoundManager();
                    soundManager.url = 'resources/swf';

                    soundManager.onready(callback);
                    soundManager.ontimeout(callback);

                    soundManager.beginDelayedInit();
                } catch (e) {
                    callback();
                }
            },

            "error":function (jqXHR, textStatus, errorThrown) {

                callback();
            }
        });
};
