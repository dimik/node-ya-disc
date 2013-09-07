var Vow = require('vow'),
    inherit = require('inherit'),
    Model = require('./ya-disc-model'),
    XMLView = require('./ya-disc-xml-view'),
    TextView = require('./ya-disc-text-view');

var YaDisc = module.exports = inherit(/** @lends YaDisc.prototype */{
    __constructor: function (options) {
        this._model = new Model(options.token);
    },
    getModel: function () {
        return this._model;
    },
    request: function (method, args) {
        var promise = Vow.promise(),
            model = this._model;

        if(!model.isMethod(method)) {
            promise.reject("Method doesn't exist");
        }
        else {
            model[method](args)
                .then(function (result) {
                    var response = result[0], status = result[1], headers = result[2],
                        contentType = headers['content-type'] || '';

                    if(status < 200 || status >= 300) {
                        promise.reject(response.toString());
                    }
                    else {
                        if(~contentType.search('text')) {
                            promise.fulfill(new TextView(response.toString()));
                        }
                        else if(~contentType.search('xml')) {
                            promise.fulfill(new XMLView(response.toString()));
                        }
                        else {
                            promise.fulfill(response);
                        }
                    }
                }, function (err) {
                    promise.reject(err);
                });
        }

        return promise;
    }
});
