var HTTPClient = require('http-client'),
    client = new HTTPClient(),
    url = require('url'),
    Vow = require('vow'),
    inherit = require('inherit');

var Model = module.exports = inherit(/** @lends Model.prototype */ {
    __constructor: function (token) {
        this._token = token;
        this._methods = [ 'get', 'getPreview', 'put', 'cp', 'mv', 'rm', 'ls', 'mkdir', 'chmod', 'id', 'df' ];
    },
    get: function (options) {
        return this._send({
            url: this.getUrl(options.path),
            method: 'GET',
            headers: this.getHeaders()
        });
    },
    getPreview: function (options) {
        return this._send({
            url: this.getUrl(options.path + '?preview'),
            method: 'GET',
            data: {
                size: options.size || 'M'
            },
            headers: this.getHeaders()
        });
    },
    put: function (options) {
        return this._send({
            url: this.getUrl(options.path),
            method: 'PUT',
            data: options.file,
            headers: this.getHeaders({
                'Content-Type': 'application/' + options.type || 'binary'
            })
        });
    },
    cp: function (options) {
        return this._send({
            url: this.getUrl(options.source),
            method: 'COPY',
            headers: this.getHeaders({
                Destination: url.resolve('/', options.target)
            })
        });
    },
    mv: function (options) {
        return this._send({
            url: this.getUrl(options.source),
            method: 'MOVE',
            headers: this.getHeaders({
                Destination: url.resolve('/', options.target)
            })
        });
    },
    rm: function (options) {
        return this._send({
            url: this.getUrl(options.path),
            method: 'DELETE',
            headers: this.getHeaders()
        });
    },
    mkdir: function (options) {
        return this._send({
            url: this.getUrl(options.path),
            method: 'MKCOL',
            headers: this.getHeaders()
        });
    },
    ls: function (options) {
        return this._send({
            url: this.getUrl(options.path),
            data: options,
            method: 'PROPFIND',
            headers: this.getHeaders({
                Depth: '1'
            })
        });
    },
    id: function () {
        return this._send({
            url: this.getUrl('?userinfo'),
            method: 'GET',
            headers: this.getHeaders()
        });
    },
    chmod: function (options) {
        var modes = {
                'a+r': [
                    '<set>',
                        '<prop>',
                            '<public_url xmlns="urn:yandex:disk:meta">true</public_url>',
                        '</prop>',
                    '</set>'
                ],
                'a-r': [
                    '<remove>',
                        '<prop>',
                            '<public_url xmlns="urn:yandex:disk:meta"/>',
                        '</prop>',
                    '</remove>'
                ]
            },
            requestBody = [
                '<propertyupdate xmlns="DAV:">',
                    modes[options.mode || 'a-r'].join(''),
                '</propertyupdate>'
            ].join('');

        return this._send({
            url: this.getUrl(options.path),
            method: 'PROPPATCH',
            body: requestBody,
            headers: this.getHeaders()
        });
    },
    df: function () {
        var requestBody = [
                '<propfind xmlns="DAV:">',
                    '<prop>',
                        '<quota-available-bytes/>',
                        '<quota-used-bytes/>',
                    '</prop>',
                '</propfind>'
            ].join('');

        return this._send({
            url: this.getUrl(),
            method: 'PROPFIND',
            body: requestBody,
            headers: this.getHeaders({
                Depth: '0'
            })
        });
    },
    getUrl: function (paths) {
        var args = Array.prototype.slice.call(arguments, 0);

        return url.resolve(this.__self.url, args.join('/'));
    },
    getHeaders: function (headers) {
        return this._extend({
            Authorization: 'OAuth ' + this._token
        }, headers);
    },
    isMethod: function (name) {
        return this._methods.indexOf(name) >= 0;
    },
    _send: function (request) {
        var promise = Vow.promise(),
            response;

        client.open(request, function (err, res) {
            if(err) {
                promise.reject(err);
            }
            else {
                promise.fulfill([res, response.statusCode, response.headers]);
            }
        })
        .once('response', function (res) {
            response = res;
        });

        return promise;
    },
    _extend: function (target, source) {
        var slice = Array.prototype.slice,
            hasOwnProperty = Object.prototype.hasOwnProperty;

        slice.call(arguments, 1).forEach(function (o) {
            for(var key in o) {
                hasOwnProperty.call(o, key) && (target[key] = o[key]);
            }
        });

        return target;
    }
}, {
    url: 'https://webdav.yandex.ru'
});
