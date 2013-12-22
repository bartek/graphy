var assert = require('assert'),
    _ = require('underscore'),
    utils = require('../utils');

describe('utils', function() {
    it('should convert url to object', function() {
        var url = "http://foo.com/render/?width=586&height=308&_salt=1387560844.442&from=-7days&target=stats.captainhook.dispatched.total&target=stats.ecomm.api.webhook.handled&target=stats.ecomm.api.webhook.received";
        var r = utils.urlToObject(url);

        assert.equal(r.width, '586');
        assert.equal(r.height, '308');
        assert.equal(_.isArray(r.target), true);
        assert.equal(r.target.length, 3);
    });
});
