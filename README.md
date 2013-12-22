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
    

Test
---

    $ npm install -g mocha
    $ mocha
