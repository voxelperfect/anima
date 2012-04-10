anima.Sound = Class.extend({

    init:function (id, url, loop) {

        this._id = id;
        this._url = url;
        this._loop = loop;

        this._sound = null;
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

        if (!this._sound) {
            this._load();
        }

        return this._sound ? this._sound.playState : false;
    },

    stop:function () {

        if (!this._sound) {
            this._load();
        }

        if (this._sound) {
            this._sound.stop();
        }
    },

    play:function (options) {

        if (!this._sound) {
            this._load();
        }

        if (this._sound) {
            var options = $.extend({}, options);
            if (this._loop) {
                options.onfinish = function () {
                    this.play(options);
                }
            }

            this._sound.play(options);
        }
    },

    pause:function () {

        if (!this._sound) {
            this._load();
        }

        if (this._sound) {
            this._sound.pause();
        }
    },

    /* internal methods */

    _load:function () {

        if (window.soundManager != undefined) {
            this._sound = soundManager.createSound({
                id:this._id,
                url:this._url,
                autoload:true
            });
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
