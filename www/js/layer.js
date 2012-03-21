anima.Layer = new Class({
    Extends:anima.Node,

    scene:null,

    nodes:[],
    nodeMap:[],

    initialize:function (id) {

        this.parent(id);
    },

    addNode:function (node) {

        this.element$.append('<div id="' + node.id + '"></div>');
        node.element$ = $('#' + node.id);
        node.element$.css({
            'position':'absolute'
        });

        this.nodes.push(node);
        this.nodeMap[node.id] = node;

        node.layer = this;
    },

    getNode:function (id) {

        return this.nodeMap[id];
    },

    removeNode:function (id) {

        var node = this.getNode();
        if (node) {
            var count = this.nodes.length;
            for (var i = 0; i < count; i++) {
                if (this.nodes[i].id = id) {
                    this.nodes.splice(i, 1);
                    delete this.nodeMap[id];
                    node.removeElement();
                    return;
                }
            }
            node.layer = null;
        }
    },

    getImageUrls:function (urls) {

        var url;
        var count = this.nodes.length;
        for (var i = 0; i < count; i++) {
            url = this.nodes[i].getImageUrl();
            if (url) {
                urls.push(url);
            }
        }
    },

    setBackground:function (color, url, width, height) {

        if (!width) {
            width = this.scene.element$.width();
        }
        if (!height) {
            height = this.scene.element$.height();
        }
        this.parent(color, url, width, height);
    },

    removeElement:function () {

        var count = this.nodes.length;
        for (var i = 0; i < count; i++) {
            this.nodes[i].removeElement();
        }
        this.nodes = [];
        this.nodeMap = [];

        this.element$.remove();
    }
});
