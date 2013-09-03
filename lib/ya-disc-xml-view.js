var libxmljs = require("libxmljs"),
    inherit = require('inherit');

var XMLView = module.exports = inherit(/** @lends XMLView.prototype */ {
    __constructor: function (data) {
        this._data = data;
    },
    getType: function () {
        return 'xml';
    },
    toJSON: function () {
        var xmlDoc = libxmljs.parseXmlString(this._data),
            props = xmlDoc.find('//d:prop', { d: 'DAV:' });

        return '[' +
            props.map(function (prop) {
                return '{' + prop.childNodes().map(function (node) {
                        return '"' + node.name() + '":"' + node.text() + '"';
                    }).join() +
                '}';
            }).join() +
        ']';
    },
    toString: function () {
        var xmlDoc = libxmljs.parseXmlString(this._data),
            props = xmlDoc.find('//d:prop', { d: 'DAV:' });

        return props.map(function (prop) {
            return prop.childNodes().map(function (node) {
                return node.name() + ':' + node.text();
            }).join(':');
        }).join(':');
    },
    toXML: function () {
        return this._data;
    },
    valueOf: function () {
        return this._data;
    }
});
