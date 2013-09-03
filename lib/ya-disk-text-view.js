var libxmljs = require("libxmljs"),
    inherit = require('inherit');

var TextView = module.exports = inherit(/** @lends TextView.prototype */ {
    __constructor: function (data) {
        this._data = data;
    },
    getType: function () {
        return 'text';
    },
    toJSON: function () {
        var result = [],
            data = this._data.split(':');

        for(var i = 0, len = data.length; i < len; i += 2) {
            result.push('{"' + data[i] + '":"' + data[i + 1] + '"}');
        }

        return '[' + result.join() + ']';
    },
    toXML: function () {
        var doc = new libxmljs.Document(),
            root = doc.node('multistatus'),
            data = this._data.split(':');

        root.defineNamespace('DAV:');

        var parent = root
            .node('response')
                .node('propstat')
                    .node('status', 'HTTP/1.1 200 OK')
                    .parent()
                    .node('prop');

        for(var i = 0, len = data.length; i < len; i += 2) {
            parent.node(data[i], data[i + 1]);
        }

        return doc.toString();
    },
    toString: function () {
        return this._data;
    },
    valueOf: function () {
        return this._data;
    }
});
