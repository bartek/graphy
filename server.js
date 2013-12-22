var express = require('express'),
    redis = require('then-redis'),
    hogan = require('hogan-express');

var app = express();
var db = redis.createClient();

// -- templating setup
app.use(express.bodyParser());
app.set('view engine', 'html');
app.engine('html', hogan);
app.use('/static', express.static(__dirname + '/static'));

// -- db
var graph = function(id) { 
    return db.hget("graphs", id).then(function(reply) {
        return JSON.parse(reply);
    });
};
var graphs = function() {
    return db.hgetall("graphs").then(function(reply) {
        reply = Object.keys(reply).map(function(k) {
            return JSON.parse(reply[k]);
        });
        return reply;
    });
};

var update = function(id, data) {
    return db.hset("graphs", id, data).then(function(reply) {
        return reply;
    });
};

// -- views
app.patch('/graphs/:id', function(req, res) {
    update(req.params.id, JSON.stringify(req.body)).then(function(reply) {
        res.send(reply);
    });
});
app.get('/graphs/:id?', function(req, res) {
    var id = (req.params.id || null);

    var func = id ? graph(id) : graphs();
    func.then(function(reply) {
        res.send(reply);
    });
});

app.get('/', function(req, res) {
    res.render('layout');
});
app.listen(4000);
