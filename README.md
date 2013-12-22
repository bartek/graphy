Graphy
---

A tiny web app for displaying Graphite JSON blobs in the browser. There is
nothing fancy about this, but I just wanted a page to display my Graphite graphs
with quick ease.

Still a work in progress in terms of design and various implementation.

Installation
---

    $ npm install
    $ bower install
    $ browserify -t debowerify static/app.js --outfile static/bundled.js

Configuration
---

Create a config.json in the root directory with config options:

    {
        "root": "http://your.graphiteinstall.com/render"
    }

Run
---

    $ node server.js
    

Graph Data
---

Currently there is no guidance as to how to add a graph. Work in progress! Graph
data can be stored on the redis key (currently named 'graphs', derp) as a JSON
string.

    redis = require('then-redis');

    var db = redis.createClient();
    db.hset('graphs', 1, JSON.stringify({
        "id": "1",
        "width":"586",
        "height":"308",
        "from":"-7days",
        "target": [
            "stats.api.webhook.handled",
            "stats.api.webhook.received",
        ],
        "_refresh": "5sec" // meta attribute for browser refresh rate
    }));

This spec is still a work in progress.


Test
---

    $ npm install -g mocha
    $ mocha
