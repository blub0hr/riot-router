var assert = require('assert'),
    helper = require('./support/helper'),
    riot = helper.riot,
    router = helper.router;

var Route = router.Route;
var NotFoundRoute = router.NotFoundRoute;
var DefaultRoute = router.DefaultRoute;
var Request = router._.Request;
var Response = router._.Response;

riot.tag('need-data', '<span>{ opts.someData }</span>', function (opts) {
});

describe('riot.route', function() {
  var tag;
  var someData = 'the data i need';

  before(function () {
    var route = document.createElement('route');
    route.setAttribute('some-data', someData);
    document.body.appendChild(route);

    tag = riot.mount('route')[0];
    router.routes([
      new Route({tag: 'static'}),
      new Route({tag: 'need-data'}),
      new Route({path: '/dynamic', tag: function () { return 'dynamic'; }}),
      new Route({path: '/dynamic-api', tag: function () {
        return {tag: 'dynamic-api', api: {}};
      }})
    ]);
  });

  it('works with static tags', function() {
    riot.tag('static', '<p>testing<p>');
    router.navigateTo('/static');
    riot.unregister('static');
    assert.ok(document.querySelector('static'));
  });

  it('works with dynamic tags', function() {
    riot.tag('dynamic', '<p>testing<p>');
    router.navigateTo('/dynamic');
    riot.unregister('dynamic');
    assert.ok(document.querySelector('dynamic'));
  });

  it('works with dynamic tags and api', function() {
    riot.tag('dynamic-api', '<p>testing<p>');
    router.navigateTo('/dynamic-api');
    riot.unregister('dynamic-api');
    assert.ok(document.querySelector('dynamic-api'));
  });

  it('passes data to the mounted tag', function() {
    router.navigateTo('/need-data');
    assert.equal(tag.instance.opts.someData, someData);
  });

});
