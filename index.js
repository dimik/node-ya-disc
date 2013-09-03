var http = require('http'),
    url = require('url'),
    querystring = require('querystring'),
    YaDisk = require(__dirname + '/lib/ya-disk'),
    disk = new YaDisk({ token: 'c5a90c24062242889b23459a0c15ff53' });

http.createServer(function (request, response) {
    console.log(request.url, request.headers, request.method);
    var options = url.parse(request.url),
        query = querystring.parse(options.query),
        apiMethod = options.pathname.match(/\w+/)[0];

    disk.callMethod(apiMethod, query)
        .then(function (res) {
            response.writeHead(200, {'Content-Type': 'application/json'});
            response.end(res.toJSON());
        }, function (err) {
            console.log(err);
        });
}).listen(1338, '127.0.0.1');

console.log('Server running at http://127.0.0.1:1338/');
