var anima = {};

$.anima = anima;

anima.fpsIntervalRate = 60;

window.requestAnimFrame = (function () {
    return  window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (/* function */ callback, /* DOMElement */ element) {
            window.setTimeout(callback, 1000 / fpsIntervalRate);
        };
})();

anima.getRequestParameter = function (name) {

    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.search);
    if (results == null)
        return "";
    else
        return decodeURIComponent(results[1].replace(/\+/g, " "));
}

if (typeof String.prototype.startsWith != 'function') {
    String.prototype.startsWith = function (str) {
        return this.indexOf(str) == 0;
    };
}

anima.nowTime = function () {

    return new Date().getTime();
}

anima.isArray = function (value) {

    return $.isArray(value);
}

anima.isNumber = function (value) {

    return $.type(value) === "number";
}

anima.isString = function (value) {

    return $.type(value) === "string";
}

anima.isObject = function (value) {

    return $.isPlainObject(value);
}

anima.isVisible = function (element$) {

    return element$ ? (element$.css("display") != "none") : false;
}

anima.clone = function (obj) {

    return $.extend({}, obj);
}
