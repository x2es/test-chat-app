var expect = require('chai').expect;
var sinon = require('sinon');

var MiniFrame = require('../lib/miniframe.js');

var accessors = MiniFrame.accessors;
var delegate  = MiniFrame.delegate;

describe('MiniFrame', function() {
  describe('accessors', function() {
    var FooClass;

    beforeEach(function() {
      FooClass = function() {};
      accessors(FooClass, ['propBar', 'propBaz']);
    });

    it('should add get<Property> method to prototype', function() {
      expect(FooClass.prototype).have.property('getPropBar');
      expect(FooClass.prototype).have.property('getPropBaz');
    });

    it('should add set<Property> method to prototype', function() {
      expect(FooClass.prototype).have.property('setPropBar');
      expect(FooClass.prototype).have.property('setPropBaz');
    });

    it('should persist property', function() {
      var foo = new FooClass();

      foo.setPropBar('barVal');
      foo.setPropBaz(3);

      expect(foo.getPropBar()).equal('barVal');
      expect(foo.getPropBaz()).equal(3);
    });
  });

  describe('delegate', function() {
    it('should delegate', function() {
      function Foo() {};

      Foo.prototype.play = function() {};
      Foo.prototype.stop = function() {};

      function Bar(foo) { this._foo = foo };

      delegate(Bar, {
        methods: ['play', 'stop'],
        to: '_foo'
      });

      var foo = new Foo();
      sinon.spy(foo, 'play');
      sinon.spy(foo, 'stop');

      var bar = new Bar(foo);

      expect(bar).have.property('play');
      expect(bar).have.property('stop');

      bar.play('a/b/c', 123);
      bar.stop(1);

      expect(foo.play.calledOnce).ok;
      expect(foo.play.firstCall.args).deep.equal([ 'a/b/c', 123 ]);

      expect(foo.stop.calledOnce).ok;
      expect(foo.stop.firstCall.args).deep.equal([ 1 ]);

    });
  });

  describe('events', function() {
    it('should handle events', function() {
      function Foo() {}

      MiniFrame.events(Foo, [ 
        /**
         * @param {String} who
         * @param {String} when
         */
        'open', 

        /**
         * @param {String} why
         */
        'close' 
      ]);

      var openSpy1 = sinon.spy();
      var openSpy2 = sinon.spy();
      var closeSpy1 = sinon.spy();
      var closeSpy2 = sinon.spy();

      var foo = new Foo();

      foo.onOpen(openSpy1);
      foo.onOpen(openSpy2);
      foo.onClose(closeSpy1);
      foo.onClose(closeSpy2);
      
      foo._fireOpen('me', 'now');
      foo._fireClose('enough');

      expect(openSpy1.calledOnce).ok;
      expect(openSpy2.calledOnce).ok;
      expect(closeSpy1.calledOnce).ok;
      expect(closeSpy2.calledOnce).ok;

      expect(openSpy1.firstCall.args).deep.equal(openSpy2.firstCall.args);
      expect(closeSpy1.firstCall.args).deep.equal(closeSpy2.firstCall.args);

      expect(openSpy1.firstCall.args).deep.equal(['me', 'now']);
      expect(closeSpy1.firstCall.args).deep.equal([ 'enough' ]);
    });
  });
});


