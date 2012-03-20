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
            for (var i in this.nodes) {
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

    removeElement:function () {

        for (var i in this.nodes) {
            this.nodes[i].removeElement();
        }
        this.nodes = [];
        this.nodeMap = [];

        this.element$.remove();
    }
});
