var url = require('url'),
    http = require('http'),
    querystring = require('querystring'),
    YaDisc = require(__dirname + '/lib/ya-disc'),
    disc = new YaDisc({ token: 'c5a90c24062242889b23459a0c15ff53' });

http.createServer(function (request, response) {

    console.log(request.url, request.headers, request.method);

    var options = url.parse(request.url),
        args = querystring.parse(options.query),
        method = options.pathname.match(/\w+/)[0];

    disc.request(method, args)
        .then(function (res) {
            response.writeHead(200, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'});
            console.log('JSON: ', res.toJSON());
            response.end(res.toJSON());
        }, function (err) {
            console.log(err);
        });
}).listen(1338, '127.0.0.1');

console.log('Server running at http://127.0.0.1:1338/');
