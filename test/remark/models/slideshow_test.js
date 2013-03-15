var EventEmitter = require('events').EventEmitter
  , Slideshow = require('../../../src/remark/models/slideshow')
  , Slide = require('../../../src/remark/models/slide')
  ;

describe('Slideshow', function () {
  var events
    , slideshow
    ;

  beforeEach(function () {
    events = new EventEmitter(); 
    slideshow = new Slideshow(events);
  });

  describe('loading from source', function () {
    it('should create slides', function () {
      slideshow.set('source', 'a\n---\nb');
      slideshow.getSlides().length.should.equal(2);
    });

    it('should replace slides', function () {
      slideshow.set('source', 'a\n---\nb\n---\nc');
      slideshow.getSlides().length.should.equal(3);
    });
  });

  describe('continued slides', function () {
    it('should be created when using only two dashes', function () {
      slideshow.set('source', 'a\n--\nb'); 

      slideshow.getSlides()[1].properties.should.have.property('continued', 'true');
    });
  });

  describe('name mapping', function () {
    it('should map named slide', function () {
      slideshow.set('source', 'name: a\n---\nno name\n---\nname: b');
      slideshow.getSlides().names.should.have.keys(['a', 'b']);
    });
  });

  describe('templates', function () {
    it('should have properties inherited by referenced slide', function () {
      slideshow.set('source', 'name: a\na\n---\ntemplate: a\nb');
      slideshow.getSlides()[1].source.should.equal('\na\nb');
    });

    it('should have source inherited by referenced slide', function () {
      slideshow.set('source', 'name: a\na\n---\ntemplate: a\nb');
      slideshow.getSlides()[1].source.should.equal('\na\nb');
    });
  });

  describe('layout slides', function () {
    it('should be default template for subsequent slides', function () {
      slideshow.set('source', 'layout: true\na\n---\nb'); 
      slideshow.getSlides()[0].source.should.equal('\nab');
    });

    it('should not be default template for subsequent layout slide', function () {
      slideshow.set('source', 'layout: true\na\n---\nlayout: true\nb\n---\nc'); 
      slideshow.getSlides()[0].source.should.equal('\nbc');
    });

    it('should be omitted from list of slides', function () {
      slideshow.set('source', 'name: a\nlayout: true\n---\nname: b'); 
      slideshow.getSlides().length.should.equal(1);
    });

    it('should still be mapped if named', function () {
      slideshow.set('source', 'name: a\nlayout: true'); 
      slideshow.getSlides().names.should.have.keys(['a']);
    });
  });

  describe('events', function () {
    it('should emit slidesChanged event', function (done) {
      events.on('slidesChanged', function () {
        done();
      });

      slideshow.set('source', 'a\n---\nb');
    });
  });
});
