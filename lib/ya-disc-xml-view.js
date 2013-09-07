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
            ns = { d: 'DAV:' },
            sources = xmlDoc.find('/d:multistatus/d:response', ns);

        return '[' +
            sources.map(function (source) {
                var href = source.get('d:href', ns),
                    status = source.get('d:propstat/d:status', ns),
                    props = source.get('d:propstat/d:prop', ns).childNodes();

                return '{' +
                    [
                        '"' + href.name() + '":"' + href.text() + '"',
                        '"' + status.name() + '":"' + status.text() + '"'
                    ].concat(
                        props.map(function (prop) {
                            var firstChild = prop.childNodes()[0],
                                propName = prop.name(),
                                propValue = prop.text() || (firstChild && firstChild.name() || prop.text());

                            return '"' + propName + '":"' + propValue + '"';
                        })
                    ).join() +
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
