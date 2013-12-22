var _ = require('underscore'),
    Backbone = require('backbone'),
    Mustache = require('mustache'),
    config = require('../config.json'),
    $ = require('jquery');

Backbone.$ = $; // Why?

var root = config.root;

var Graph = Backbone.Model.extend({
});

var GraphGroup = Backbone.Collection.extend({
    model: Graph,
    url: '/graphs'
});

var GraphView = Backbone.View.extend({
    className: 'graph-item',
    template: [
        "<div contenteditable='true' class='editor'></div>",
        "<button class='btn btn-primary'>Edit</button>",
        "<img class='img-responsive' src='{{url}}'>"
    ].join('\n'),

    events: {
        "click button": "toggleMode"
    },

    toggleMode: function() {
        var $editor = this.$('.editor');
        var $btn = this.$('button');

        if (!$editor.hasClass('on')) {
            $editor.addClass('on');

            var str = JSON.stringify(this.model.attributes, undefined, "<br>");
            $editor.html(str);
            $btn.html('Save');
            this.isEditing = true;
            return;
        }

        // Revert back to regular mode, attempt save.
        $editor.removeClass('on');
        $btn.html('Edit');
        this.isEditing = false;
        this.model.save(JSON.parse($editor.text()), {patch: true});
    },

    attrsToUrl: function() {
        var attrs = this.model.attributes;
        return _.map(attrs, function(value, key, list) {
            if (_.isArray(value)) {
                return _.map(value, function(v) {
                    return key + "=" + v;
                }).join('&');
            }
            return key + "=" + value;
        }).join('&');
    },

    refreshRate: function() {
        var rate = this.model.get('_refresh');
        if (!rate) return null;

        // Parse "sec", "min"
        var sec = rate.indexOf("sec"),
            min = rate.indexOf("min"),
            m = 0;

        var idx = -1;
        if (sec !== -1) { idx = sec; m = 1000; }
        else if (min !== -1) { idx = min; m = 10000; }

        return rate.slice(0, idx) * m;
    },

    buildImage: function() {
        return $('<img>').attr(
            'src', root + '/?' + this.attrsToUrl());
    },

    render: function(options) {
        // Bail out early if we're in edit mode. Don't need to re-render
        if (this.isEditing) return this;

        options = (options || {});
        var self = this;
        var template = this.template;

        var img = this.buildImage()[0];
        img.onload = function() {
            self.$el.html(Mustache.render(template, {
                url: img.src
            }));
            return self;
        };

        if (options.refresh) return this;

        // Re-render every _refresh rate.
        var rate = this.refreshRate();
        if (rate) {
            setInterval(function() {
                self.render({refresh: true});
            }, rate);
        }
        return this;
    }
});

module.exports = {
    // app init
    blastoff: function() {
        var self = window.app = this;

        // wait for dom ready to render main view
        $(function() {
            self.graphs = new GraphGroup();
            self.graphs.on('add', self.newView);
            self.graphs.fetch({remove: false});
        });
    },

    newView: function(graph) {
        var view = new GraphView({
            model: graph
        });
        $("#app").append(view.render().el);
    }
};

// run app.
module.exports.blastoff();
