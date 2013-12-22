var _ = require('underscore');

module.exports = {
    urlToObject: function(url) {
        // Remove anything before the querystring.
        url = url.slice(url.indexOf('?') + 1, url.length);

        var items = url.split('&');
        var obj = {};
        for (var i = 0; i < items.length; i++) {
            var k = items[i].split('=')[0],
                v = items[i].split('=')[1];

            // If object key already exists, transform to array.
            if (_.has(obj, k)) {
                if (!_.isArray(obj[k])) obj[k] = [obj[k]];
                obj[k].push(v);
            } else {
                obj[k] = v;
            }
        }
        return obj;
    }
};
